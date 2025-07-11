from django import forms
from .models import UserProfile

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'email',
            'phone',
            'address',
            'linkedin',
            'summary'
        ]

class CoverLetterPromptForm(forms.Form):
    job_title = forms.CharField(label="Job Title", max_length=100)
    company_name = forms.CharField(label="Company Name", max_length=100)
    tone = forms.ChoiceField(
        label="Tone",
        choices=[
            ('formal', 'Formal'),
            ('friendly', 'Friendly'),
            ('persuasive', 'Persuasive'),
            ('enthusiastic', 'Enthusiastic')
        ]
    )
