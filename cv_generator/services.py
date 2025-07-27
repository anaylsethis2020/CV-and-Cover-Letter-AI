import openai
import json
from django.conf import settings
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import os
from datetime import datetime


class OpenAIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def generate_cover_letter(self, cv_data, job_title, company_name, job_description):
        """
        Generate a personalized cover letter using OpenAI
        """
        try:
            # Prepare CV data for the prompt
            cv_summary = f"""
            Name: {cv_data.get('first_name', '')} {cv_data.get('last_name', '')}
            Summary: {cv_data.get('summary', '')}
            Skills: {cv_data.get('skills', '')}
            Experience: {json.dumps(cv_data.get('experience', []), indent=2)}
            Education: {json.dumps(cv_data.get('education', []), indent=2)}
            """
            
            prompt = f"""
            Write a professional cover letter for the following position:
            
            Job Title: {job_title}
            Company: {company_name}
            Job Description: {job_description}
            
            Based on this candidate's CV information:
            {cv_summary}
            
            The cover letter should:
            1. Be professional and engaging
            2. Highlight relevant skills and experience
            3. Show enthusiasm for the position
            4. Be approximately 300-400 words
            5. Include a clear call to action
            6. Be formatted as a proper business letter
            
            Write the cover letter in a professional tone, addressing the hiring manager.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional resume writer and career coach."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating cover letter: {str(e)}"


class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom styles for the PDF"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=20,
            alignment=1,  # Center alignment
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=10,
            textColor=colors.darkblue
        ))
    
    def generate_cv_pdf(self, cv_data, template_name="default"):
        """
        Generate a PDF CV from CV data
        """
        try:
            # Create filename
            filename = f"cv_{cv_data.get('first_name', 'user')}_{cv_data.get('last_name', '')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(settings.MEDIA_ROOT, 'pdfs', filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # Add title
            title = f"{cv_data.get('first_name', '')} {cv_data.get('last_name', '')}"
            story.append(Paragraph(title, self.styles['CustomTitle']))
            
            # Add contact information
            contact_info = [
                cv_data.get('email', ''),
                cv_data.get('phone', ''),
                cv_data.get('address', '')
            ]
            contact_text = ' | '.join(filter(None, contact_info))
            story.append(Paragraph(contact_text, self.styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Add summary
            if cv_data.get('summary'):
                story.append(Paragraph("Professional Summary", self.styles['SectionHeader']))
                story.append(Paragraph(cv_data['summary'], self.styles['Normal']))
                story.append(Spacer(1, 15))
            
            # Add skills
            if cv_data.get('skills'):
                story.append(Paragraph("Skills", self.styles['SectionHeader']))
                story.append(Paragraph(cv_data['skills'], self.styles['Normal']))
                story.append(Spacer(1, 15))
            
            # Add experience
            if cv_data.get('experience'):
                story.append(Paragraph("Professional Experience", self.styles['SectionHeader']))
                for exp in cv_data['experience']:
                    exp_text = f"<b>{exp.get('position', '')}</b> at {exp.get('company', '')}<br/>"
                    exp_text += f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}<br/>"
                    exp_text += exp.get('description', '')
                    story.append(Paragraph(exp_text, self.styles['Normal']))
                    story.append(Spacer(1, 10))
                story.append(Spacer(1, 15))
            
            # Add education
            if cv_data.get('education'):
                story.append(Paragraph("Education", self.styles['SectionHeader']))
                for edu in cv_data['education']:
                    edu_text = f"<b>{edu.get('degree', '')}</b> in {edu.get('field_of_study', '')}<br/>"
                    edu_text += f"{edu.get('institution', '')}<br/>"
                    edu_text += f"{edu.get('start_date', '')} - {edu.get('end_date', '')}"
                    story.append(Paragraph(edu_text, self.styles['Normal']))
                    story.append(Spacer(1, 10))
            
            # Build PDF
            doc.build(story)
            
            return filepath
            
        except Exception as e:
            raise Exception(f"Error generating CV PDF: {str(e)}")
    
    def generate_cover_letter_pdf(self, cover_letter_data):
        """
        Generate a PDF cover letter
        """
        try:
            # Create filename
            filename = f"cover_letter_{cover_letter_data.get('job_title', 'position').replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(settings.MEDIA_ROOT, 'pdfs', filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=letter)
            story = []
            
            # Add date
            story.append(Paragraph(datetime.now().strftime("%B %d, %Y"), self.styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Add content
            story.append(Paragraph(cover_letter_data.get('content', ''), self.styles['Normal']))
            
            # Build PDF
            doc.build(story)
            
            return filepath
            
        except Exception as e:
            raise Exception(f"Error generating cover letter PDF: {str(e)}") 