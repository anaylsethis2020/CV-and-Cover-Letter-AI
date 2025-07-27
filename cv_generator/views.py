from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, FileResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import os
import tempfile
import logging

logger = logging.getLogger(__name__)

from .models import CV, CoverLetter, CVTemplate, GeneratedPDF
from .forms import CVForm, ExperienceForm, EducationForm, ProjectForm, CoverLetterForm, PDFExportForm
from .services import OpenAIService, PDFService
from .cv_parser import CVParser


def home(request):
    """Home page view"""
    return render(request, 'cv_generator/home.html')


@login_required
def dashboard(request):
    """User dashboard"""
    user_cvs = CV.objects.filter(user=request.user).order_by('-updated_at')
    user_cover_letters = CoverLetter.objects.filter(user=request.user).order_by('-updated_at')
    
    context = {
        'cvs': user_cvs,
        'cover_letters': user_cover_letters,
    }
    return render(request, 'cv_generator/dashboard.html', context)


@login_required
def cv_builder_comprehensive(request):
    """Comprehensive CV builder with all sections"""
    if request.method == 'POST':
        # Handle JSON data for comprehensive form
        import json
        try:
            data = json.loads(request.body)
            cv = CV(
                user=request.user,
                title=data['basic'].get('title', ''),
                first_name=data['basic'].get('first_name', ''),
                last_name=data['basic'].get('last_name', ''),
                email=data['basic'].get('email', ''),
                phone=data['basic'].get('phone', ''),
                address=data['basic'].get('address', ''),
                linkedin_url=data['basic'].get('linkedin_url', ''),
                github_url=data['basic'].get('github_url', ''),
                website_url=data['basic'].get('website_url', ''),
                summary=data['basic'].get('summary', ''),
                skills=data['basic'].get('skills', ''),
                experience=data.get('experience', []),
                education=data.get('education', []),
                projects=data.get('projects', []),
                certifications=data.get('certifications', []),
                awards=data.get('awards', []),
                volunteering=data.get('volunteering', []),
                publications=data.get('publications', []),
            )
            
            # Create default template if none exists
            template, created = CVTemplate.objects.get_or_create(
                name="Default",
                defaults={
                    'description': 'Default CV Template',
                    'template_file': 'default.html',
                    'is_premium': False
                }
            )
            cv.template = template
            cv.save()
            
            return JsonResponse({'success': True, 'cv_id': cv.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return render(request, 'cv_generator/cv_builder_comprehensive.html')


@login_required
def cv_builder(request):
    """CV builder view with file upload support"""
    if request.method == 'POST':
        form = CVForm(request.POST, request.FILES)
        if form.is_valid():
            cv = form.save(commit=False)
            cv.user = request.user
            # Create default template if none exists
            template, created = CVTemplate.objects.get_or_create(
                name="Default",
                defaults={
                    'description': 'Default CV Template',
                    'is_active': True
                }
            )
            cv.template = template
            cv.save()
            messages.success(request, 'CV created successfully!')
            return redirect('cv_generator:cv_editor', cv_id=cv.id)
    else:
        form = CVForm()
    
    return render(request, 'cv_generator/cv_builder.html', {'form': form})


@login_required
def parse_cv_ajax(request):
    """AJAX endpoint for parsing uploaded CV files"""
    if request.method == 'POST' and request.FILES.get('cv_file'):
        try:
            uploaded_file = request.FILES['cv_file']
            
            # Validate file size (max 5MB)
            if uploaded_file.size > 5 * 1024 * 1024:
                return JsonResponse({
                    'success': False,
                    'error': 'File size too large. Maximum size is 5MB.'
                })
            
            # Get file extension
            file_name = uploaded_file.name
            file_extension = os.path.splitext(file_name)[1].lower()
            
            # Validate file format
            parser = CVParser()
            if not parser.is_supported_format(file_name):
                return JsonResponse({
                    'success': False,
                    'error': f'Unsupported file format. Supported formats: {", ".join(parser.get_supported_formats())}'
                })
            
            # Save file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
            
            try:
                # Parse the CV
                parsed_data = parser.parse_cv(temp_file_path, file_extension)
                
                if 'error' in parsed_data:
                    return JsonResponse({
                        'success': False,
                        'error': parsed_data['error']
                    })
                
                # Return parsed data with debug info
                debug_info = {
                    'extracted_fields': [],
                    'file_type': file_extension,
                    'file_size': f"{uploaded_file.size} bytes"
                }
                
                # Check what fields were extracted
                personal_info = parsed_data.get('personal_info', {})
                for field, value in personal_info.items():
                    if value:
                        debug_info['extracted_fields'].append(field)
                
                if parsed_data.get('summary'):
                    debug_info['extracted_fields'].append('summary')
                if parsed_data.get('skills'):
                    debug_info['extracted_fields'].append('skills')
                
                return JsonResponse({
                    'success': True,
                    'data': parsed_data,
                    'debug': debug_info
                })
                
            finally:
                # Clean up temporary file
                os.unlink(temp_file_path)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error processing file: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'No file uploaded or invalid request method'
    })


@login_required
def cv_editor(request, cv_id):
    """CV editor view"""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)
    
    if request.method == 'POST':
        form = CVForm(request.POST, instance=cv)
        if form.is_valid():
            form.save()
            messages.success(request, 'CV updated successfully!')
            return redirect('cv_generator:cv_editor', cv_id=cv.id)
    else:
        form = CVForm(instance=cv)
    
    context = {
        'cv': cv,
        'form': form,
    }
    return render(request, 'cv_generator/cv_editor.html', context)


@login_required
def add_experience(request, cv_id):
    """Add experience to CV"""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)
    
    if request.method == 'POST':
        form = ExperienceForm(request.POST)
        if form.is_valid():
            experience_data = form.cleaned_data
            if experience_data.get('current'):
                experience_data['end_date'] = 'Present'
            
            # Convert to JSON format
            experience_data['start_date'] = experience_data['start_date'].strftime('%Y-%m-%d')
            if experience_data.get('end_date') and experience_data['end_date'] != 'Present':
                experience_data['end_date'] = experience_data['end_date'].strftime('%Y-%m-%d')
            
            # Add to existing experience
            current_experience = cv.experience
            current_experience.append(experience_data)
            cv.experience = current_experience
            cv.save()
            
            messages.success(request, 'Experience added successfully!')
            return redirect('cv_generator:cv_editor', cv_id=cv.id)
    else:
        form = ExperienceForm()
    
    return render(request, 'cv_generator/add_experience.html', {'form': form, 'cv': cv})


@login_required
def add_education(request, cv_id):
    """Add education to CV"""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)
    
    if request.method == 'POST':
        form = EducationForm(request.POST)
        if form.is_valid():
            education_data = form.cleaned_data
            
            # Convert to JSON format
            education_data['start_date'] = education_data['start_date'].strftime('%Y-%m-%d')
            if education_data.get('end_date'):
                education_data['end_date'] = education_data['end_date'].strftime('%Y-%m-%d')
            
            # Add to existing education
            current_education = cv.education
            current_education.append(education_data)
            cv.education = current_education
            cv.save()
            
            messages.success(request, 'Education added successfully!')
            return redirect('cv_generator:cv_editor', cv_id=cv.id)
    else:
        form = EducationForm()
    
    return render(request, 'cv_generator/add_education.html', {'form': form, 'cv': cv})


@login_required
def add_project(request, cv_id):
    """Add project to CV"""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)
    
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project_data = form.cleaned_data
            
            # Add to existing projects
            current_projects = cv.projects
            current_projects.append(project_data)
            cv.projects = current_projects
            cv.save()
            
            messages.success(request, 'Project added successfully!')
            return redirect('cv_generator:cv_editor', cv_id=cv.id)
    else:
        form = ProjectForm()
    
    return render(request, 'cv_generator/add_project.html', {'form': form, 'cv': cv})


@login_required
def cover_letter_generator(request):
    """Cover letter generator view"""
    user_cvs = CV.objects.filter(user=request.user)
    
    if request.method == 'POST':
        form = CoverLetterForm(request.POST)
        if form.is_valid():
            cover_letter = form.save(commit=False)
            cover_letter.user = request.user
            
            # Get the selected CV
            cv_id = request.POST.get('cv_id')
            if cv_id:
                cv = get_object_or_404(CV, id=cv_id, user=request.user)
                cover_letter.cv = cv
                
                # Generate cover letter using OpenAI
                openai_service = OpenAIService()
                cv_data = {
                    'first_name': cv.first_name,
                    'last_name': cv.last_name,
                    'summary': cv.summary,
                    'skills': cv.skills,
                    'experience': cv.experience,
                    'education': cv.education,
                }
                
                generated_content = openai_service.generate_cover_letter(
                    cv_data,
                    cover_letter.job_title,
                    cover_letter.company_name,
                    cover_letter.job_description
                )
                
                cover_letter.generated_content = generated_content
                cover_letter.save()
                
                messages.success(request, 'Cover letter generated successfully!')
                return redirect('cv_generator:cover_letter_view', cover_letter_id=cover_letter.id)
    else:
        form = CoverLetterForm()
    
    return render(request, 'cv_generator/cover_letter_generator.html', {
        'form': form,
        'user_cvs': user_cvs
    })


@login_required
def cover_letter_view(request, cover_letter_id):
    """View generated cover letter"""
    cover_letter = get_object_or_404(CoverLetter, id=cover_letter_id, user=request.user)
    
    return render(request, 'cv_generator/cover_letter_view.html', {
        'cover_letter': cover_letter
    })


@login_required
def export_pdf(request):
    """Export CV or cover letter to PDF"""
    if request.method == 'POST':
        form = PDFExportForm(request.POST)
        if form.is_valid():
            export_type = form.cleaned_data['export_type']
            pdf_service = PDFService()
            
            try:
                if export_type == 'cv':
                    cv_id = request.POST.get('cv_id')
                    cv = get_object_or_404(CV, id=cv_id, user=request.user)
                    
                    cv_data = {
                        'first_name': cv.first_name,
                        'last_name': cv.last_name,
                        'email': cv.email,
                        'phone': cv.phone,
                        'address': cv.address,
                        'summary': cv.summary,
                        'skills': cv.skills,
                        'experience': cv.experience,
                        'education': cv.education,
                        'projects': cv.projects,
                    }
                    
                    filepath = pdf_service.generate_cv_pdf(cv_data)
                    
                    # Save PDF record
                    GeneratedPDF.objects.create(
                        user=request.user,
                        cv=cv,
                        file_path=filepath,
                        file_type='cv'
                    )
                    
                    # Return file for download
                    return FileResponse(open(filepath, 'rb'), content_type='application/pdf')
                
                elif export_type == 'cover_letter':
                    cover_letter_id = request.POST.get('cover_letter_id')
                    cover_letter = get_object_or_404(CoverLetter, id=cover_letter_id, user=request.user)
                    
                    cover_letter_data = {
                        'content': cover_letter.generated_content,
                        'job_title': cover_letter.job_title,
                    }
                    
                    filepath = pdf_service.generate_cover_letter_pdf(cover_letter_data)
                    
                    # Save PDF record
                    GeneratedPDF.objects.create(
                        user=request.user,
                        cover_letter=cover_letter,
                        file_path=filepath,
                        file_type='cover_letter'
                    )
                    
                    # Return file for download
                    return FileResponse(open(filepath, 'rb'), content_type='application/pdf')
                
            except Exception as e:
                messages.error(request, f'Error generating PDF: {str(e)}')
                return redirect('cv_generator:dashboard')
    else:
        form = PDFExportForm()
    
    user_cvs = CV.objects.filter(user=request.user)
    user_cover_letters = CoverLetter.objects.filter(user=request.user)
    
    return render(request, 'cv_generator/export_pdf.html', {
        'form': form,
        'user_cvs': user_cvs,
        'user_cover_letters': user_cover_letters
    })


@login_required
def delete_cv(request, cv_id):
    """Delete CV"""
    cv = get_object_or_404(CV, id=cv_id, user=request.user)
    cv.delete()
    messages.success(request, 'CV deleted successfully!')
    return redirect('cv_generator:dashboard')


@login_required
def delete_cover_letter(request, cover_letter_id):
    """Delete cover letter"""
    cover_letter = get_object_or_404(CoverLetter, id=cover_letter_id, user=request.user)
    cover_letter.delete()
    messages.success(request, 'Cover letter deleted successfully!')
    return redirect('cv_generator:dashboard') 


@login_required
def analyze_job_ajax(request):
    """Analyze job description and provide CV optimization recommendations"""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            
            job_description = data.get('job_description', '')
            job_title = data.get('job_title', '')
            company_name = data.get('company_name', '')
            cv_data = data.get('cv_data', {})
            
            if not job_description or not job_title:
                return JsonResponse({
                    'success': False,
                    'error': 'Job description and title are required'
                })
            
            # Use OpenAI to analyze job requirements vs CV content
            analysis = analyze_job_requirements(job_description, job_title, company_name, cv_data)
            
            return JsonResponse({
                'success': True,
                'analysis': analysis
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Analysis failed: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })


def analyze_job_requirements(job_description, job_title, company_name, cv_data):
    """Analyze job requirements against CV content using OpenAI"""
    try:
        import openai
        from django.conf import settings
        
        # Initialize OpenAI client
        if not hasattr(settings, 'OPENAI_API_KEY') or not settings.OPENAI_API_KEY:
            return get_fallback_analysis(job_description, job_title, cv_data)
        
        openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Prepare CV content for analysis
        cv_summary = f"""
        Personal Info: {cv_data.get('personal_info', {})}
        Summary: {cv_data.get('summary', '')}
        Skills: {cv_data.get('skills', '')}
        Experience: {len(cv_data.get('experience', []))} entries
        Education: {len(cv_data.get('education', []))} entries
        Projects: {len(cv_data.get('projects', []))} entries
        """
        
        # Create analysis prompt
        prompt = f"""
        Analyze this job description against the candidate's CV and provide optimization recommendations.
        
        JOB DETAILS:
        Title: {job_title}
        Company: {company_name}
        Description: {job_description}
        
        CANDIDATE'S CV:
        {cv_summary}
        
        Please provide analysis in the following JSON format:
        {{
            "keyword_score": "85%",
            "missing_skills": ["React", "AWS", "Docker"],
            "recommendations": [
                "Add React.js to your skills section",
                "Highlight AWS experience in your projects",
                "Emphasize leadership experience",
                "Add specific metrics to your achievements"
            ],
            "strengths": [
                "Strong Python experience",
                "Good project management skills"
            ],
            "weaknesses": [
                "Limited cloud experience",
                "No React.js mentioned"
            ],
            "priority_actions": [
                "Add React.js to skills",
                "Include AWS projects",
                "Quantify achievements"
            ]
        }}
        
        Focus on:
        1. Keyword matching between job requirements and CV content
        2. Missing skills that are mentioned in the job description
        3. Specific recommendations to improve CV for this role
        4. ATS (Applicant Tracking System) optimization tips
        5. Quantifiable achievements and metrics
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a CV optimization expert. Analyze job requirements and provide specific, actionable recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.3
        )
        
        # Parse the response
        analysis_text = response.choices[0].message.content.strip()
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
        if json_match:
            analysis = json.loads(json_match.group())
        else:
            # Fallback if JSON parsing fails
            analysis = get_fallback_analysis(job_description, job_title, cv_data)
        
        return analysis
        
    except Exception as e:
        logger.error(f"OpenAI analysis failed: {e}")
        return get_fallback_analysis(job_description, job_title, cv_data)


def get_fallback_analysis(job_description, job_title, cv_data):
    """Provide fallback analysis when OpenAI is not available"""
    import re
    
    # Extract keywords from job description
    job_lower = job_description.lower()
    cv_skills = cv_data.get('skills', '').lower()
    
    # Common tech keywords to look for
    tech_keywords = [
        'python', 'javascript', 'react', 'angular', 'vue', 'node.js', 'django', 'flask',
        'aws', 'azure', 'docker', 'kubernetes', 'git', 'sql', 'mongodb', 'postgresql',
        'html', 'css', 'bootstrap', 'jquery', 'php', 'java', 'c#', 'c++', 'ruby',
        'machine learning', 'ai', 'data science', 'agile', 'scrum', 'devops'
    ]
    
    # Find missing skills
    missing_skills = []
    for keyword in tech_keywords:
        if keyword in job_lower and keyword not in cv_skills:
            missing_skills.append(keyword.title())
    
    # Calculate keyword match score
    found_keywords = sum(1 for keyword in tech_keywords if keyword in job_lower and keyword in cv_skills)
    total_keywords = sum(1 for keyword in tech_keywords if keyword in job_lower)
    keyword_score = f"{int((found_keywords / max(total_keywords, 1)) * 100)}%" if total_keywords > 0 else "75%"
    
    # Generate recommendations
    recommendations = []
    if missing_skills:
        recommendations.append(f"Add {', '.join(missing_skills[:3])} to your skills section")
    
    if 'experience' in job_lower and len(cv_data.get('experience', [])) < 2:
        recommendations.append("Add more work experience entries")
    
    if 'project' in job_lower and len(cv_data.get('projects', [])) < 2:
        recommendations.append("Include more project examples")
    
    if 'leadership' in job_lower or 'manage' in job_lower:
        recommendations.append("Emphasize leadership and management experience")
    
    if 'metric' in job_lower or 'result' in job_lower:
        recommendations.append("Add specific metrics and quantifiable achievements")
    
    return {
        "keyword_score": keyword_score,
        "missing_skills": missing_skills[:5],
        "recommendations": recommendations[:4],
        "strengths": ["Strong technical background", "Good project experience"],
        "weaknesses": missing_skills[:3],
        "priority_actions": recommendations[:3]
    } 


@login_required
def test_job_analysis(request):
    """Test endpoint for job analysis functionality"""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            
            # Simple test data
            test_job_description = data.get('job_description', 'We are looking for a Python developer with Django experience and AWS knowledge.')
            test_job_title = data.get('job_title', 'Python Developer')
            test_company = data.get('company_name', 'Tech Company')
            
            # Test CV data
            test_cv_data = {
                'personal_info': {'first_name': 'John', 'last_name': 'Doe'},
                'summary': 'Experienced developer with Python skills',
                'skills': 'Python, JavaScript, HTML, CSS',
                'experience': [{'job_title': 'Developer', 'company': 'Previous Company'}],
                'education': [{'degree': 'Computer Science', 'institution': 'University'}],
                'projects': [{'name': 'Web App', 'description': 'Built with Django'}]
            }
            
            # Run analysis
            analysis = analyze_job_requirements(test_job_description, test_job_title, test_company, test_cv_data)
            
            return JsonResponse({
                'success': True,
                'analysis': analysis,
                'test_data': {
                    'job_description': test_job_description,
                    'job_title': test_job_title,
                    'company': test_company
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Test failed: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    }) 


@login_required
def preview_cv_ajax(request):
    """Generate CV preview with selected template"""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            
            template_id = data.get('template_id')
            cv_data = data.get('cv_data', {})
            
            if not template_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Template ID is required'
                })
            
            # Store CV data in session for preview
            request.session['preview_cv_data'] = cv_data
            request.session['preview_template_id'] = template_id
            
            # Generate preview URL
            preview_url = f'/cv-preview/{template_id}/'
            
            return JsonResponse({
                'success': True,
                'preview_url': preview_url,
                'template_id': template_id
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Preview generation failed: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })


@login_required
def cv_preview(request, template_id):
    """Display CV preview with selected template"""
    try:
        template = CVTemplate.objects.get(id=template_id)
    except CVTemplate.DoesNotExist:
        messages.error(request, 'Template not found')
        return redirect('cv_generator:cv_builder_comprehensive')
    
    # Get CV data from session or create sample data
    cv_data = request.session.get('preview_cv_data', {})
    
    # Create CV object for preview
    cv = CV(
        user=request.user,
        template=template,
        title=cv_data.get('title', 'Sample CV'),
        first_name=cv_data.get('personal_info', {}).get('first_name', 'John'),
        last_name=cv_data.get('personal_info', {}).get('last_name', 'Doe'),
        email=cv_data.get('personal_info', {}).get('email', 'john.doe@example.com'),
        phone=cv_data.get('personal_info', {}).get('phone', '+44 123 456 7890'),
        address=cv_data.get('personal_info', {}).get('address', 'London, UK'),
        linkedin_url=cv_data.get('personal_info', {}).get('linkedin_url', ''),
        github_url=cv_data.get('personal_info', {}).get('github_url', ''),
        website_url=cv_data.get('personal_info', {}).get('website_url', ''),
        summary=cv_data.get('summary', 'Experienced professional with strong skills in various technologies.'),
        skills=cv_data.get('skills', 'Python, Django, JavaScript, React, HTML, CSS'),
        experience=cv_data.get('experience', []),
        education=cv_data.get('education', []),
        projects=cv_data.get('projects', []),
        certifications=cv_data.get('certifications', []),
        awards=cv_data.get('awards', []),
        volunteering=cv_data.get('volunteering', []),
        publications=cv_data.get('publications', [])
    )
    
    context = {
        'cv': cv,
        'template': template,
        'is_preview': True
    }
    
    return render(request, f'cv_generator/templates/{template.template_file}', context) 


def user_guide(request):
    """User guide and documentation page"""
    return render(request, 'cv_generator/user_guide.html') 