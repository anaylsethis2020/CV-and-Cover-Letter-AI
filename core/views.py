
from django.shortcuts import render
from .forms import UserProfileForm, CoverLetterPromptForm
import openai
import os
from django.conf import settings

# Optional: use environment variable or directly paste the key for now
openai.api_key = "YOUR_REAL_API_KEY_HERE"  # ⚠️ Replace with your actual OpenAI API key

def cover_letter_prompt_view(request):
    profile_form = UserProfileForm()
    prompt_form = CoverLetterPromptForm()
    cover_letter = None

    if request.method == 'POST':
        profile_form = UserProfileForm(request.POST)
        prompt_form = CoverLetterPromptForm(request.POST)

        if profile_form.is_valid() and prompt_form.is_valid():
            # Extract cleaned data
            profile_data = profile_form.cleaned_data
            prompt_data = prompt_form.cleaned_data

            # Format your message to OpenAI
            user_input = f"""
            Write a {prompt_data['tone']} cover letter for {profile_data['full_name']}, 
            who lives at {profile_data['address']}, and can be contacted via {profile_data['email']}.
            They are applying for the role of {prompt_data['job_title']} at {prompt_data['company_name']}.
            LinkedIn: {profile_data['linkedin']} | Phone: {profile_data['phone']}
            Summary: {profile_data['summary']}
            """

            try:
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful cover letter generator."},
                        {"role": "user", "content": user_input}
                    ],
                    temperature=0.7
                )
                cover_letter = response['choices'][0]['message']['content'].strip()

            except Exception as e:
                cover_letter = f"⚠️ Error generating cover letter: {str(e)}"

    return render(request, 'core/cover_letter_prompt.html', {
        'profile_form': profile_form,
        'prompt_form': prompt_form,
        'cover_letter': cover_letter,
    })
