// Cover Letter Generator Application
class CoverLetterGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.isEditing = false;
        this.originalContent = '';
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('coverLetterForm');
        this.generateBtn = document.getElementById('generateBtn');
        this.jobTitleInput = document.getElementById('jobTitle');
        this.companyInput = document.getElementById('company');
        this.toneSelect = document.getElementById('tone');
        this.jobDescriptionInput = document.getElementById('jobDescription');
        this.experienceInput = document.getElementById('experience');

        // Preview elements
        this.previewSection = document.getElementById('previewSection');
        this.coverLetterPreview = document.getElementById('coverLetterPreview');
        
        // Action buttons
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.editBtn = document.getElementById('editBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.editControls = document.getElementById('editControls');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.regenerateBtn.addEventListener('click', () => this.regenerateLetter());
        this.editBtn.addEventListener('click', () => this.toggleEditMode());
        this.downloadBtn.addEventListener('click', () => this.downloadLetter());
        this.saveEditBtn.addEventListener('click', () => this.saveEdits());
        this.cancelEditBtn.addEventListener('click', () => this.cancelEdits());
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        await this.generateCoverLetter(formData);
    }

    validateForm() {
        const jobTitle = this.jobTitleInput.value.trim();
        const company = this.companyInput.value.trim();
        
        // Clear previous errors
        this.clearErrors();

        let isValid = true;

        if (!jobTitle) {
            this.showFieldError(this.jobTitleInput, 'Job title is required');
            isValid = false;
        }

        if (!company) {
            this.showFieldError(this.companyInput, 'Company name is required');
            isValid = false;
        }

        return isValid;
    }

    getFormData() {
        return {
            jobTitle: this.jobTitleInput.value.trim(),
            company: this.companyInput.value.trim(),
            tone: this.toneSelect.value,
            jobDescription: this.jobDescriptionInput.value.trim(),
            experience: this.experienceInput.value.trim()
        };
    }

    async generateCoverLetter(formData) {
        this.showLoading(true);
        
        try {
            // Simulate API call with realistic delay
            await this.delay(1500 + Math.random() * 1000);
            
            const coverLetter = this.generateMockCoverLetter(formData);
            this.displayCoverLetter(coverLetter);
            this.showPreviewSection();
            
        } catch (error) {
            this.showError('Failed to generate cover letter. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    generateMockCoverLetter(data) {
        const { jobTitle, company, tone, jobDescription, experience } = data;
        
        // Date formatting
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Tone-based salutations and closings
        const toneStyles = {
            professional: {
                salutation: 'Dear Hiring Manager,',
                closing: 'Sincerely,',
                style: 'professional and polished'
            },
            enthusiastic: {
                salutation: 'Dear Hiring Team,',
                closing: 'With excitement,',
                style: 'enthusiastic and energetic'
            },
            confident: {
                salutation: 'Dear Hiring Manager,',
                closing: 'Confidently yours,',
                style: 'confident and assertive'
            },
            friendly: {
                salutation: 'Hello!',
                closing: 'Best regards,',
                style: 'friendly and approachable'
            },
            formal: {
                salutation: 'To Whom It May Concern:',
                closing: 'Respectfully,',
                style: 'formal and respectful'
            }
        };

        const selectedTone = toneStyles[tone] || toneStyles.professional;

        // Generate dynamic content based on inputs
        const introVariations = [
            `I am writing to express my strong interest in the ${jobTitle} position at ${company}.`,
            `I am excited to apply for the ${jobTitle} role at ${company}.`,
            `I would like to submit my application for the ${jobTitle} position with ${company}.`
        ];

        const bodyContent = this.generateBodyContent(data, selectedTone.style);
        
        const coverLetter = `${dateStr}

${selectedTone.salutation}

${introVariations[Math.floor(Math.random() * introVariations.length)]} ${bodyContent}

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${company}'s continued success. Thank you for considering my application.

${selectedTone.closing}

[Your Name]
[Your Phone Number]
[Your Email Address]`;

        return coverLetter;
    }

    generateBodyContent(data, style) {
        const { jobTitle, company, jobDescription, experience } = data;
        
        let body = '';

        // Add experience-based content if provided
        if (experience) {
            body += `My experience in ${experience.toLowerCase()} has prepared me well for this role. `;
        } else {
            body += `My background and skills align perfectly with the requirements for this ${jobTitle} position. `;
        }

        // Add job description-based content if provided
        if (jobDescription) {
            body += `Having reviewed the job description, I am particularly excited about the opportunity to contribute to ${company}'s goals. `;
        }

        // Add role-specific content
        if (jobTitle.toLowerCase().includes('engineer') || jobTitle.toLowerCase().includes('developer')) {
            body += `I bring strong technical skills and a passion for creating innovative solutions. `;
        } else if (jobTitle.toLowerCase().includes('manager') || jobTitle.toLowerCase().includes('lead')) {
            body += `I have demonstrated leadership abilities and a track record of driving results. `;
        } else if (jobTitle.toLowerCase().includes('marketing') || jobTitle.toLowerCase().includes('sales')) {
            body += `I have a proven ability to drive growth and engage with customers effectively. `;
        } else {
            body += `I am eager to bring my skills and dedication to this important role. `;
        }

        // Add company-specific content
        body += `I am impressed by ${company}'s reputation and would be thrilled to contribute to your team's success.`;

        return body;
    }

    displayCoverLetter(content) {
        this.coverLetterPreview.textContent = content;
        this.originalContent = content;
    }

    showPreviewSection() {
        this.previewSection.style.display = 'block';
        this.previewSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add success animation
        setTimeout(() => {
            this.previewSection.classList.add('success-animation');
            setTimeout(() => {
                this.previewSection.classList.remove('success-animation');
            }, 600);
        }, 100);
    }

    async regenerateLetter() {
        if (this.isEditing) {
            this.cancelEdits();
        }
        
        const formData = this.getFormData();
        await this.generateCoverLetter(formData);
    }

    toggleEditMode() {
        if (this.isEditing) {
            this.saveEdits();
        } else {
            this.startEditing();
        }
    }

    startEditing() {
        this.isEditing = true;
        this.coverLetterPreview.contentEditable = true;
        this.coverLetterPreview.focus();
        this.editBtn.innerHTML = '💾 Save';
        this.editControls.style.display = 'flex';
        
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(this.coverLetterPreview);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    saveEdits() {
        this.isEditing = false;
        this.coverLetterPreview.contentEditable = false;
        this.editBtn.innerHTML = '✏️ Edit Manually';
        this.editControls.style.display = 'none';
        this.originalContent = this.coverLetterPreview.textContent;
    }

    cancelEdits() {
        this.isEditing = false;
        this.coverLetterPreview.contentEditable = false;
        this.coverLetterPreview.textContent = this.originalContent;
        this.editBtn.innerHTML = '✏️ Edit Manually';
        this.editControls.style.display = 'none';
    }

    downloadLetter() {
        const content = this.coverLetterPreview.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${this.companyInput.value.replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.generateBtn.disabled = true;
            this.generateBtn.querySelector('.btn-text').style.display = 'none';
            this.generateBtn.querySelector('.loading-spinner').style.display = 'inline';
            this.form.parentElement.classList.add('loading');
        } else {
            this.generateBtn.disabled = false;
            this.generateBtn.querySelector('.btn-text').style.display = 'inline';
            this.generateBtn.querySelector('.loading-spinner').style.display = 'none';
            this.form.parentElement.classList.remove('loading');
        }
    }

    showError(message) {
        this.clearErrors();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.form.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearErrors() {
        // Remove error classes
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
        // Remove error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.parentNode.removeChild(msg));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoverLetterGenerator();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.getElementById('generateBtn');
        if (!generateBtn.disabled) {
            generateBtn.click();
        }
    }
    
    // Escape to cancel editing
    if (e.key === 'Escape') {
        const app = document.querySelector('script').coverLetterApp;
        if (app && app.isEditing) {
            app.cancelEdits();
        }
    }
});