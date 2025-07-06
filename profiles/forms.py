from django import forms
from django.forms import modelformset_factory
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, Field, Fieldset, HTML
from .models import Profile, WorkExperience, Education, Skill


class ProfileForm(forms.ModelForm):
    """Form for basic profile information"""
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'summary']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
            'summary': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Fieldset(
                'Personal Information',
                Row(
                    Column('first_name', css_class='form-group col-md-6 mb-0'),
                    Column('last_name', css_class='form-group col-md-6 mb-0'),
                    css_class='form-row'
                ),
                Row(
                    Column('email', css_class='form-group col-md-8 mb-0'),
                    Column('phone', css_class='form-group col-md-4 mb-0'),
                    css_class='form-row'
                ),
                'address',
                'summary',
            ),
            Submit('submit', 'Save Profile', css_class='btn btn-primary')
        )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            # Check if email is already used by another user's profile
            existing_profile = Profile.objects.filter(email=email).exclude(pk=self.instance.pk if self.instance else None)
            if existing_profile.exists():
                raise forms.ValidationError("This email is already associated with another profile.")
        return email


class WorkExperienceForm(forms.ModelForm):
    """Form for work experience entries"""
    class Meta:
        model = WorkExperience
        fields = ['company', 'position', 'start_date', 'end_date', 'description', 'is_current']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column('company', css_class='form-group col-md-6 mb-0'),
                Column('position', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('start_date', css_class='form-group col-md-4 mb-0'),
                Column('end_date', css_class='form-group col-md-4 mb-0'),
                Column('is_current', css_class='form-group col-md-4 mb-0 d-flex align-items-center'),
                css_class='form-row'
            ),
            'description',
        )

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        is_current = cleaned_data.get('is_current')

        if is_current and end_date:
            raise forms.ValidationError("End date should be empty for current positions.")
        
        if not is_current and not end_date:
            raise forms.ValidationError("End date is required for past positions.")
        
        if start_date and end_date and start_date > end_date:
            raise forms.ValidationError("Start date cannot be after end date.")

        return cleaned_data


class EducationForm(forms.ModelForm):
    """Form for education entries"""
    class Meta:
        model = Education
        fields = ['institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'grade', 'description']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column('institution', css_class='form-group col-md-6 mb-0'),
                Column('degree', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('field_of_study', css_class='form-group col-md-6 mb-0'),
                Column('grade', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('start_date', css_class='form-group col-md-6 mb-0'),
                Column('end_date', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'description',
        )

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')

        if start_date and end_date and start_date > end_date:
            raise forms.ValidationError("Start date cannot be after end date.")

        return cleaned_data


class SkillForm(forms.ModelForm):
    """Form for skill entries"""
    class Meta:
        model = Skill
        fields = ['name', 'level', 'category']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column('name', css_class='form-group col-md-4 mb-0'),
                Column('level', css_class='form-group col-md-4 mb-0'),
                Column('category', css_class='form-group col-md-4 mb-0'),
                css_class='form-row'
            ),
        )


# Formsets for handling multiple entries
WorkExperienceFormSet = modelformset_factory(
    WorkExperience,
    form=WorkExperienceForm,
    extra=1,
    can_delete=True,
    min_num=0,
    validate_min=False
)

EducationFormSet = modelformset_factory(
    Education,
    form=EducationForm,
    extra=1,
    can_delete=True,
    min_num=0,
    validate_min=False
)

SkillFormSet = modelformset_factory(
    Skill,
    form=SkillForm,
    extra=3,
    can_delete=True,
    min_num=0,
    validate_min=False
)