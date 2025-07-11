from django.shortcuts import render
from .forms import UserProfileForm, CoverLetterPromptForm

def cover_letter_prompt_view(request):
    profile_form = UserProfileForm()
    prompt_form = CoverLetterPromptForm()
    return render(request, 'core/cover_letter_prompt.html', {
        'profile_form': profile_form,
        'prompt_form': prompt_form,
    })
