from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """User profile with basic personal information for CV"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, help_text="Your first name")
    last_name = models.CharField(max_length=100, help_text="Your last name")
    email = models.EmailField(help_text="Your email address")
    phone = models.CharField(max_length=20, blank=True, help_text="Your phone number (optional)")
    address = models.TextField(blank=True, help_text="Your address (optional)")
    summary = models.TextField(blank=True, help_text="Professional summary or objective (optional)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class WorkExperience(models.Model):
    """Work experience entries for CV"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='work_experiences')
    company = models.CharField(max_length=200, help_text="Company name")
    position = models.CharField(max_length=200, help_text="Job title/position")
    start_date = models.DateField(help_text="Start date (YYYY-MM-DD)")
    end_date = models.DateField(null=True, blank=True, help_text="End date (leave blank if current)")
    description = models.TextField(help_text="Job description and achievements")
    is_current = models.BooleanField(default=False, help_text="Check if this is your current job")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.position} at {self.company}"


class Education(models.Model):
    """Education entries for CV"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='educations')
    institution = models.CharField(max_length=200, help_text="School/University name")
    degree = models.CharField(max_length=200, help_text="Degree or qualification")
    field_of_study = models.CharField(max_length=200, blank=True, help_text="Field of study (optional)")
    start_date = models.DateField(help_text="Start date (YYYY-MM-DD)")
    end_date = models.DateField(null=True, blank=True, help_text="End date (leave blank if ongoing)")
    grade = models.CharField(max_length=50, blank=True, help_text="Grade/GPA (optional)")
    description = models.TextField(blank=True, help_text="Additional details (optional)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Skill(models.Model):
    """Skills for CV"""
    SKILL_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100, help_text="Skill name")
    level = models.CharField(max_length=20, choices=SKILL_LEVELS, default='intermediate', help_text="Proficiency level")
    category = models.CharField(max_length=100, blank=True, help_text="Skill category (e.g., Programming, Languages)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.level})"
