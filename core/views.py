
from django.shortcuts import render
from .forms import UserProfileForm, CoverLetterPromptForm
import openai
import os
from dotenv import load_dotenv
from django.conf import settings

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def cover_letter_prompt_view(request):
    profile_form = UserProfileForm()
    prompt_form = CoverLetterPromptForm()
    cover_letter = None

    if request.method == 'POST':
        profile_form = UserProfileForm(request.POST)
        prompt_form = CoverLetterPromptForm(request.POST)

        if profile_form.is_valid() and prompt_form.is_valid():
            profile_data = profile_form.cleaned_data
            prompt_data = prompt_form.cleaned_data
            user_input = f"""
            Write a {prompt_data['tone']} cover letter for {profile_data['full_name']}, 
            who lives at {profile_data['address']}, and can be contacted via {profile_data['email']}.
            They are applying for the role of {prompt_data['job_title']} at {prompt_data['company_name']}.
            LinkedIn: {profile_data['linkedin']} | Phone: {profile_data['phone']}
            Summary: {profile_data['summary']}
            """
            try:
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
                cover_letter = f"⚠️ Error generating cover letter: {str(e)}"
                request.session['cover_letter'] = cover_letter
                request.session['cover_letter_unlocked'] = False

    # Only show locked letter, not unlocked
    return render(request, 'core/cover_letter_prompt.html', {
        'profile_form': profile_form,
        'prompt_form': prompt_form,
        'cover_letter': request.session.get('cover_letter'),
        'unlocked': request.session.get('cover_letter_unlocked', False),
    })
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Load the Stripe secret key from .env
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_checkout_session(request):
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
        return JsonResponse({'error': str(e)}, status=400)

def payment_success_view(request):
    # Unlock cover letter in session
    request.session['cover_letter_unlocked'] = True
    return render(request, 'core/success.html', {
        'cover_letter': request.session.get('cover_letter'),
        'unlocked': True,
    })

def payment_cancel_view(request):
    return render(request, 'core/cancel.html')
