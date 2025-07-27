from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import stripe
import json
from datetime import datetime, timedelta

from .models import Subscription, Payment
from users.models import UserProfile

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


@login_required
def subscription_plans(request):
    """Display subscription plans"""
    plans = [
        {
            'name': 'Free',
            'price': 0,
            'features': [
                'Basic CV builder',
                '3 CV templates',
                'Basic cover letter generator',
                'PDF export (limited)',
            ],
            'stripe_price_id': None,
        },
        {
            'name': 'Premium',
            'price': 9.99,
            'features': [
                'Advanced CV builder',
                'Unlimited CV templates',
                'AI-powered cover letter generator',
                'Unlimited PDF exports',
                'Priority support',
            ],
            'stripe_price_id': 'price_1QSjp7P1Y8V5LMJ1VYRJLXVr',  # TEST: Replace with your actual Stripe price ID
        },
        {
            'name': 'Enterprise',
            'price': 29.99,
            'features': [
                'Everything in Premium',
                'Team collaboration',
                'Advanced analytics',
                'Custom branding',
                'API access',
            ],
            'stripe_price_id': 'price_1QSjp7P1Y8V5LMJ1VYRJLXVs',  # TEST: Replace with your actual Stripe price ID
        },
    ]
    
    user_subscription = Subscription.objects.filter(user=request.user).first()
    
    return render(request, 'payments/subscription_plans.html', {
        'plans': plans,
        'user_subscription': user_subscription,
        'STRIPE_PUBLISHABLE_KEY': settings.STRIPE_PUBLISHABLE_KEY,
    })


@login_required
def create_checkout_session(request):
    """Create Stripe checkout session"""
    if request.method == 'POST':
        try:
            price_id = request.POST.get('price_id')
            subscription_type = request.POST.get('subscription_type')
            
            # Create Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=request.build_absolute_uri('/payments/success/'),
                cancel_url=request.build_absolute_uri('/payments/cancel/'),
                customer_email=request.user.email,
                metadata={
                    'user_id': request.user.id,
                    'subscription_type': subscription_type,
                }
            )
            
            return JsonResponse({'session_id': checkout_session.id})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@login_required
def success(request):
    """Payment success page"""
    messages.success(request, 'Payment successful! Your subscription has been activated.')
    return redirect('users:dashboard')


@login_required
def cancel(request):
    """Payment cancellation page"""
    messages.warning(request, 'Payment was cancelled.')
    return redirect('payments:subscription_plans')


@csrf_exempt
def stripe_webhook(request):
    """Handle Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session_completed(session)
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        handle_invoice_payment_succeeded(invoice)
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_deleted(subscription)
    
    return HttpResponse(status=200)


def handle_checkout_session_completed(session):
    """Handle successful checkout session"""
    user_id = session['metadata']['user_id']
    subscription_type = session['metadata']['subscription_type']
    
    try:
        user = User.objects.get(id=user_id)
        
        # Create or update subscription
        subscription, created = Subscription.objects.get_or_create(
            user=user,
            defaults={
                'subscription_type': subscription_type,
                'stripe_customer_id': session['customer'],
                'stripe_subscription_id': session['subscription'],
                'is_active': True,
                'end_date': timezone.now() + timedelta(days=30),  # 30-day subscription
            }
        )
        
        if not created:
            subscription.subscription_type = subscription_type
            subscription.stripe_customer_id = session['customer']
            subscription.stripe_subscription_id = session['subscription']
            subscription.is_active = True
            subscription.end_date = timezone.now() + timedelta(days=30)
            subscription.save()
        
        # Update user profile
        user_profile = user.userprofile
        user_profile.subscription_status = subscription_type
        user_profile.subscription_end_date = subscription.end_date
        user_profile.save()
        
        # Create payment record
        Payment.objects.create(
            user=user,
            subscription=subscription,
            stripe_payment_intent_id=session['payment_intent'],
            amount=session['amount_total'] / 100,  # Convert from cents
            currency=session['currency'],
            status='completed',
        )
        
    except User.DoesNotExist:
        pass


def handle_invoice_payment_succeeded(invoice):
    """Handle successful invoice payment"""
    try:
        subscription = Subscription.objects.get(stripe_subscription_id=invoice['subscription'])
        subscription.is_active = True
        subscription.end_date = timezone.now() + timedelta(days=30)
        subscription.save()
        
        # Update user profile
        user_profile = subscription.user.userprofile
        user_profile.subscription_end_date = subscription.end_date
        user_profile.save()
        
    except Subscription.DoesNotExist:
        pass


def handle_subscription_deleted(subscription_data):
    """Handle subscription deletion"""
    try:
        subscription = Subscription.objects.get(stripe_subscription_id=subscription_data['id'])
        subscription.is_active = False
        subscription.save()
        
        # Update user profile
        user_profile = subscription.user.userprofile
        user_profile.subscription_status = 'free'
        user_profile.subscription_end_date = None
        user_profile.save()
        
    except Subscription.DoesNotExist:
        pass


@login_required
def subscription_management(request):
    """User subscription management page"""
    subscription = Subscription.objects.filter(user=request.user).first()
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'cancel':
            try:
                # Cancel subscription in Stripe
                if subscription and subscription.stripe_subscription_id:
                    stripe.Subscription.delete(subscription.stripe_subscription_id)
                
                # Update local subscription
                if subscription:
                    subscription.is_active = False
                    subscription.save()
                
                # Update user profile
                user_profile = request.user.userprofile
                user_profile.subscription_status = 'free'
                user_profile.subscription_end_date = None
                user_profile.save()
                
                messages.success(request, 'Subscription cancelled successfully.')
                
            except Exception as e:
                messages.error(request, f'Error cancelling subscription: {str(e)}')
        
        return redirect('payments:subscription_management')
    
    return render(request, 'payments/subscription_management.html', {
        'subscription': subscription,
    }) 