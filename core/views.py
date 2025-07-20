
# views.py: Handles all business logic and HTTP requests for the CV & Cover Letter AI Builder

# Django imports for rendering templates and handling forms
from django.shortcuts import render
from .forms import UserProfileForm, CoverLetterPromptForm

# OpenAI integration for AI-powered cover letter generation
import openai
import os
from dotenv import load_dotenv
from django.conf import settings

# Load environment variables (API keys, secrets)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def cover_letter_prompt_view(request):
    """
    Main view for the generator page.
    - Displays the user profile and prompt forms.
    - On POST: validates forms, generates cover letter using OpenAI, stores it in session (locked until payment).
    - On GET: shows forms and (if present) the locked cover letter.
    """
    profile_form = UserProfileForm()
    prompt_form = CoverLetterPromptForm()
    cover_letter = None

    if request.method == 'POST':
        profile_form = UserProfileForm(request.POST)
        prompt_form = CoverLetterPromptForm(request.POST)

        if profile_form.is_valid() and prompt_form.is_valid():
            profile_data = profile_form.cleaned_data
            prompt_data = prompt_form.cleaned_data
            # Format user input for OpenAI prompt
            user_input = f"""
            Write a {prompt_data['tone']} cover letter for {profile_data['full_name']}, 
            who lives at {profile_data['address']}, and can be contacted via {profile_data['email']}.
            They are applying for the role of {prompt_data['job_title']} at {prompt_data['company_name']}.
            LinkedIn: {profile_data['linkedin']} | Phone: {profile_data['phone']}
            Summary: {profile_data['summary']}
            """
            try:
                # Call OpenAI API to generate cover letter
                response = openai.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful cover letter writing assistant."},
                        {"role": "user", "content": user_input}
                    ],
                    temperature=0.7
                )
                cover_letter = response.choices[0].message.content.strip()
                # Store cover letter in session, lock until payment
                request.session['cover_letter'] = cover_letter
                request.session['cover_letter_unlocked'] = False
            except Exception as e:
                # Handle OpenAI errors gracefully
                cover_letter = f"⚠️ Error generating cover letter: {str(e)}"
                request.session['cover_letter'] = cover_letter
                request.session['cover_letter_unlocked'] = False

    # Render the generator template, passing forms and cover letter state
    return render(request, 'core/cover_letter_prompt.html', {
        'profile_form': profile_form,
        'prompt_form': prompt_form,
        'cover_letter': request.session.get('cover_letter'),
        'unlocked': request.session.get('cover_letter_unlocked', False),
    })

# Stripe integration for payment unlocking
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Load the Stripe secret key from Django settings
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_checkout_session(request):
    """
    Creates a Stripe Checkout session for payment.
    - Called when user clicks 'Pay with Stripe'.
    - Returns session ID for Stripe redirect.
    - Handles errors and returns JSON response.
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[{
                'price_data': {
                    'currency': 'gbp',
                    'product_data': {
                        'name': 'AI Cover Letter Generator',
                    },
                    'unit_amount': 299,  # £2.99
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://127.0.0.1:8000/success/',
            cancel_url='http://127.0.0.1:8000/cancel/',
        )
        return JsonResponse({'id': checkout_session.id})
    except Exception as e:
        # Return error as JSON if Stripe fails
        return JsonResponse({'error': str(e)}, status=400)

def payment_success_view(request):
    """
    View for Stripe payment success.
    - Unlocks the cover letter in session.
    - Renders the success template with unlocked letter.
    """
    request.session['cover_letter_unlocked'] = True
    return render(request, 'core/success.html', {
        'cover_letter': request.session.get('cover_letter'),
        'unlocked': True,
    })

def payment_cancel_view(request):
    """
    View for Stripe payment cancel.
    - Renders the cancel template.
    """
    return render(request, 'core/cancel.html')
