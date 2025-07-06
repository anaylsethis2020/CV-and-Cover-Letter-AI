from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from .models import Profile, WorkExperience, Education, Skill
from .forms import ProfileForm, WorkExperienceFormSet, EducationFormSet, SkillFormSet


@login_required
def profile_view(request):
    """Display and edit user profile and CV information"""
    # Get or create profile for the current user
    profile, created = Profile.objects.get_or_create(
        user=request.user,
        defaults={
            'first_name': request.user.first_name or '',
            'last_name': request.user.last_name or '',
            'email': request.user.email or '',
        }
    )
    
    if request.method == 'POST':
        profile_form = ProfileForm(request.POST, instance=profile)
        work_formset = WorkExperienceFormSet(
            request.POST, 
            queryset=WorkExperience.objects.filter(profile=profile),
            prefix='work'
        )
        education_formset = EducationFormSet(
            request.POST,
            queryset=Education.objects.filter(profile=profile),
            prefix='education'
        )
        skill_formset = SkillFormSet(
            request.POST,
            queryset=Skill.objects.filter(profile=profile),
            prefix='skill'
        )
        
        if (profile_form.is_valid() and work_formset.is_valid() and 
            education_formset.is_valid() and skill_formset.is_valid()):
            
            try:
                with transaction.atomic():
                    # Save profile
                    profile = profile_form.save(commit=False)
                    profile.user = request.user
                    profile.save()
                    
                    # Save work experience
                    work_instances = work_formset.save(commit=False)
                    for instance in work_instances:
                        instance.profile = profile
                        instance.save()
                    for obj in work_formset.deleted_objects:
                        obj.delete()
                    
                    # Save education
                    education_instances = education_formset.save(commit=False)
                    for instance in education_instances:
                        instance.profile = profile
                        instance.save()
                    for obj in education_formset.deleted_objects:
                        obj.delete()
                    
                    # Save skills
                    skill_instances = skill_formset.save(commit=False)
                    for instance in skill_instances:
                        instance.profile = profile
                        instance.save()
                    for obj in skill_formset.deleted_objects:
                        obj.delete()
                
                messages.success(request, 'Your CV has been updated successfully!')
                return redirect('profile')
                
            except Exception as e:
                messages.error(request, f'An error occurred while saving: {str(e)}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        profile_form = ProfileForm(instance=profile)
        work_formset = WorkExperienceFormSet(
            queryset=WorkExperience.objects.filter(profile=profile),
            prefix='work'
        )
        education_formset = EducationFormSet(
            queryset=Education.objects.filter(profile=profile),
            prefix='education'
        )
        skill_formset = SkillFormSet(
            queryset=Skill.objects.filter(profile=profile),
            prefix='skill'
        )
    
    context = {
        'profile_form': profile_form,
        'work_formset': work_formset,
        'education_formset': education_formset,
        'skill_formset': skill_formset,
        'profile': profile,
    }
    
    return render(request, 'profiles/profile_form.html', context)


@login_required
def cv_preview(request):
    """Display a preview of the user's CV"""
    try:
        profile = Profile.objects.get(user=request.user)
        work_experiences = WorkExperience.objects.filter(profile=profile)
        educations = Education.objects.filter(profile=profile)
        skills = Skill.objects.filter(profile=profile)
        
        context = {
            'profile': profile,
            'work_experiences': work_experiences,
            'educations': educations,
            'skills': skills,
        }
        return render(request, 'profiles/cv_preview.html', context)
        
    except Profile.DoesNotExist:
        messages.info(request, 'Please complete your profile first.')
        return redirect('profile')


def home(request):
    """Home page"""
    return render(request, 'profiles/home.html')
