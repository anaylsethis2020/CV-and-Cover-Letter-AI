from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class CVTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    template_file = models.CharField(max_length=100)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=50, choices=[
        ('modern', 'Modern'),
        ('classic', 'Classic'),
        ('creative', 'Creative'),
        ('minimal', 'Minimal'),
        ('professional', 'Professional'),
        ('ats_friendly', 'ATS Friendly')
    ], default='professional')
    preview_image = models.ImageField(upload_to='template_previews/', blank=True, null=True)
    color_scheme = models.CharField(max_length=50, default='blue', choices=[
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('purple', 'Purple'),
        ('red', 'Red'),
        ('orange', 'Orange'),
        ('gray', 'Gray'),
        ('black', 'Black')
    ])
    font_family = models.CharField(max_length=50, default='arial', choices=[
        ('arial', 'Arial'),
        ('times', 'Times New Roman'),
        ('helvetica', 'Helvetica'),
        ('georgia', 'Georgia'),
        ('verdana', 'Verdana')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CV(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    template = models.ForeignKey(CVTemplate, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    
    # Professional Summary
    summary = models.TextField()
    
    # Skills
    skills = models.TextField(help_text="Enter skills separated by commas")
    
    # Experience
    experience = models.JSONField(default=list)
    
    # Education
    education = models.JSONField(default=list)
    
    # Projects
    projects = models.JSONField(default=list)
    
    # Certifications
    certifications = models.JSONField(default=list)
    
    # Awards & Scholarships
    awards = models.JSONField(default=list)
    
    # Volunteering & Leadership
    volunteering = models.JSONField(default=list)
    
    # Publications
    publications = models.JSONField(default=list)
    
    # Languages
    languages = models.JSONField(default=list)
    
    # References
    references = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.title}"


class CoverLetter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cv = models.ForeignKey(CV, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    job_description = models.TextField()
    generated_content = models.TextField()
    is_ai_generated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cover Letter for {self.job_title} at {self.company_name}"


class GeneratedPDF(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, null=True, blank=True)
    cover_letter = models.ForeignKey(CoverLetter, on_delete=models.CASCADE, null=True, blank=True)
    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=20, choices=[
        ('cv', 'CV'),
        ('cover_letter', 'Cover Letter'),
        ('both', 'Both'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.file_type} PDF - {self.created_at}" 


class CVVersion(models.Model):
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name='versions')
    version_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=200, blank=True)
    company_name = models.CharField(max_length=200, blank=True)
    job_description = models.TextField(blank=True)
    is_optimized = models.BooleanField(default=False)
    optimization_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.cv.title} - {self.version_name}"

    class Meta:
        ordering = ['-created_at']


class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cv_version = models.ForeignKey(CVVersion, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    job_description = models.TextField()
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[
        ('applied', 'Applied'),
        ('interviewing', 'Interviewing'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn')
    ], default='applied')
    response_received = models.BooleanField(default=False)
    response_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

    class Meta:
        ordering = ['-application_date'] 