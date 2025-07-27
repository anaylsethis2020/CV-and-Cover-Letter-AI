/**
 * Comprehensive CV Builder JavaScript
 * Handles dynamic forms, progress tracking, and data management
 */

class CVBuilder {
    constructor() {
        this.sections = ['basic', 'experience', 'education', 'certifications', 'projects', 'awards', 'volunteering', 'publications'];
        this.currentSection = 'basic';
        this.cvData = {
            basic: {},
            experience: [],
            education: [],
            certifications: [],
            projects: [],
            awards: [],
            volunteering: [],
            publications: []
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.loadDraftData();
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this.currentSection = e.target.getAttribute('data-bs-target').substring(1);
                this.updateProgress();
            });
        });

        // Auto-save functionality
        document.addEventListener('input', this.debounce(() => {
            this.saveBasicInfo();
            this.updateProgress();
        }, 1000));

        // CV file upload
        const fileInput = document.getElementById('cv-file-upload');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        }
    }

    // Section Management
    nextTab(tabName) {
        const tab = document.querySelector(`#${tabName}-tab`);
        if (tab) {
            tab.click();
        }
        this.updateProgress();
    }

    previousTab(tabName) {
        const tab = document.querySelector(`#${tabName}-tab`);
        if (tab) {
            tab.click();
        }
    }

    // Dynamic Form Management
    addExperienceEntry() {
        const template = this.getExperienceTemplate();
        const container = document.getElementById('experience-list');
        const noDataElement = document.getElementById('no-experience');
        
        if (noDataElement) {
            noDataElement.style.display = 'none';
        }
        
        container.appendChild(template);
        this.updateProgress();
    }

    addEducationEntry() {
        const template = this.getEducationTemplate();
        const container = document.getElementById('education-list');
        const noDataElement = document.getElementById('no-education');
        
        if (noDataElement) {
            noDataElement.style.display = 'none';
        }
        
        container.appendChild(template);
        this.updateProgress();
    }

    addCertificationEntry() {
        const template = this.getCertificationTemplate();
        const container = document.getElementById('certifications-list');
        container.appendChild(template);
        this.updateProgress();
    }

    addAwardEntry() {
        const template = this.getAwardTemplate();
        const container = document.getElementById('awards-list');
        container.appendChild(template);
        this.updateProgress();
    }

    addVolunteeringEntry() {
        const template = this.getVolunteeringTemplate();
        const container = document.getElementById('volunteering-list');
        container.appendChild(template);
        this.updateProgress();
    }

    addPublicationEntry() {
        const template = this.getPublicationTemplate();
        const container = document.getElementById('publications-list');
        container.appendChild(template);
        this.updateProgress();
    }

    removeEntry(button) {
        const entry = button.closest('.entry-item');
        if (entry) {
            entry.remove();
            this.updateProgress();
        }
    }

    // Template Generators
    getExperienceTemplate() {
        const div = document.createElement('div');
        div.className = 'experience-entry entry-item border rounded p-4 mb-4';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h6 class="fw-bold text-primary mb-0">
                    <i class="fas fa-briefcase me-2"></i>Work Experience
                </h6>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="cvBuilder.removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Job Title *</label>
                        <input type="text" class="form-control" name="job_title" 
                               placeholder="e.g., Senior Software Engineer" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Company *</label>
                        <input type="text" class="form-control" name="company" 
                               placeholder="e.g., Google Inc." required>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Location</label>
                        <input type="text" class="form-control" name="location" 
                               placeholder="e.g., San Francisco, CA">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Start Date *</label>
                        <input type="date" class="form-control" name="start_date" required>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">End Date</label>
                        <input type="date" class="form-control" name="end_date">
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="mb-3">
                        <div class="form-check mt-4 pt-1">
                            <input class="form-check-input" type="checkbox" name="current" 
                                   onchange="cvBuilder.toggleEndDate(this)">
                            <label class="form-check-label fw-semibold">Current</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label fw-semibold">Description *</label>
                <textarea class="form-control" name="description" rows="4" 
                          placeholder="Describe your key responsibilities and achievements..." required></textarea>
            </div>
        `;
        return div;
    }

    getEducationTemplate() {
        const div = document.createElement('div');
        div.className = 'education-entry entry-item border rounded p-4 mb-4';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h6 class="fw-bold text-primary mb-0">
                    <i class="fas fa-graduation-cap me-2"></i>Education
                </h6>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="cvBuilder.removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Degree *</label>
                        <input type="text" class="form-control" name="degree" 
                               placeholder="e.g., Bachelor of Science" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Institution *</label>
                        <input type="text" class="form-control" name="institution" 
                               placeholder="e.g., Stanford University" required>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Field of Study</label>
                        <input type="text" class="form-control" name="field_of_study" 
                               placeholder="e.g., Computer Science">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Start Date</label>
                        <input type="date" class="form-control" name="start_date">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">End Date</label>
                        <input type="date" class="form-control" name="end_date">
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">GPA</label>
                        <input type="text" class="form-control" name="gpa" placeholder="3.8/4.0">
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    getCertificationTemplate() {
        const div = document.createElement('div');
        div.className = 'certification-entry entry-item border rounded p-4 mb-4';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h6 class="fw-bold text-primary mb-0">
                    <i class="fas fa-certificate me-2"></i>Certification
                </h6>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="cvBuilder.removeEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Certification Name *</label>
                        <input type="text" class="form-control" name="name" 
                               placeholder="e.g., AWS Certified Solutions Architect" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Issuer *</label>
                        <input type="text" class="form-control" name="issuer" 
                               placeholder="e.g., Amazon Web Services" required>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Issue Date</label>
                        <input type="date" class="form-control" name="issue_date">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Expiry Date</label>
                        <input type="date" class="form-control" name="expiry_date">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Credential URL</label>
                        <input type="url" class="form-control" name="url" 
                               placeholder="Verification URL (optional)">
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    // Utility Functions
    toggleEndDate(checkbox) {
        const endDateInput = checkbox.closest('.entry-item').querySelector('input[name="end_date"]');
        if (checkbox.checked) {
            endDateInput.disabled = true;
            endDateInput.value = '';
        } else {
            endDateInput.disabled = false;
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Progress Tracking
    updateProgress() {
        let completedSections = 0;
        const totalSections = this.sections.length;

        // Check basic info completion
        if (this.isBasicInfoComplete()) {
            completedSections++;
        }

        // Check other sections
        this.sections.slice(1).forEach(section => {
            const entries = document.querySelectorAll(`#${section}-list .entry-item`);
            if (entries.length > 0) {
                completedSections++;
            }
        });

        const percentage = Math.round((completedSections / totalSections) * 100);
        const progressBar = document.getElementById('cv-progress-bar');
        const percentageText = document.getElementById('completion-percentage');

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (percentageText) {
            percentageText.textContent = percentage + '%';
        }
    }

    isBasicInfoComplete() {
        const requiredFields = ['first_name', 'last_name', 'email'];
        return requiredFields.every(field => {
            const input = document.getElementById(field);
            return input && input.value.trim() !== '';
        });
    }

    // Data Management
    saveBasicInfo() {
        const form = document.getElementById('basic-info-form');
        if (!form) return;

        const formData = new FormData(form);
        this.cvData.basic = {};
        
        for (let [key, value] of formData.entries()) {
            this.cvData.basic[key] = value;
        }

        // Save to localStorage as draft
        localStorage.setItem('cv_draft', JSON.stringify(this.cvData));
    }

    loadDraftData() {
        const draftData = localStorage.getItem('cv_draft');
        if (draftData) {
            try {
                this.cvData = JSON.parse(draftData);
                this.populateBasicInfo();
            } catch (e) {
                console.error('Error loading draft data:', e);
            }
        }
    }

    populateBasicInfo() {
        if (!this.cvData.basic) return;

        Object.keys(this.cvData.basic).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = this.cvData.basic[key];
            }
        });
    }

    // CV File Upload Handler
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('cv_file', file);
        formData.append('csrfmiddlewaretoken', this.getCSRFToken());

        try {
            const response = await fetch('/parse-cv-ajax/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.populateFromParsedData(data.data);
                this.showAlert('CV parsed successfully! Form auto-filled with extracted data.', 'success');
            } else {
                this.showAlert('Error: ' + data.error, 'danger');
            }
        } catch (error) {
            this.showAlert('Network error: ' + error.message, 'danger');
        }
    }

    populateFromParsedData(data) {
        // Fill basic information
        if (data.personal_info) {
            Object.keys(data.personal_info).forEach(key => {
                const input = document.getElementById(key);
                if (input && data.personal_info[key]) {
                    input.value = data.personal_info[key];
                }
            });
        }

        // Fill summary and skills
        ['summary', 'skills'].forEach(field => {
            const input = document.getElementById(field);
            if (input && data[field]) {
                input.value = data[field];
            }
        });

        this.updateProgress();
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Final CV Creation
    async createCV() {
        // Collect all data
        this.collectAllData();

        // Validate required fields
        if (!this.validateCV()) {
            this.showAlert('Please complete all required fields before creating your CV.', 'warning');
            return;
        }

        try {
            const response = await fetch('/cv-builder/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify(this.cvData)
            });

            if (response.ok) {
                this.showAlert('CV created successfully!', 'success');
                // Clear draft data
                localStorage.removeItem('cv_draft');
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard/';
                }, 2000);
            } else {
                this.showAlert('Error creating CV. Please try again.', 'danger');
            }
        } catch (error) {
            this.showAlert('Network error: ' + error.message, 'danger');
        }
    }

    collectAllData() {
        // Collect experience data
        this.cvData.experience = [];
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const data = this.extractFormData(entry);
            if (data.job_title && data.company) {
                this.cvData.experience.push(data);
            }
        });

        // Collect education data
        this.cvData.education = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            const data = this.extractFormData(entry);
            if (data.degree && data.institution) {
                this.cvData.education.push(data);
            }
        });

        // Collect other sections...
        ['certifications', 'awards', 'volunteering', 'publications'].forEach(section => {
            this.cvData[section] = [];
            document.querySelectorAll(`.${section.slice(0, -1)}-entry`).forEach(entry => {
                const data = this.extractFormData(entry);
                this.cvData[section].push(data);
            });
        });
    }

    extractFormData(element) {
        const data = {};
        const inputs = element.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else {
                data[input.name] = input.value;
            }
        });
        return data;
    }

    validateCV() {
        return this.isBasicInfoComplete();
    }

    saveDraft() {
        this.saveBasicInfo();
        this.collectAllData();
        localStorage.setItem('cv_draft', JSON.stringify(this.cvData));
        this.showAlert('Draft saved successfully!', 'info');
    }
}

// Initialize CV Builder when DOM is loaded
let cvBuilder;
document.addEventListener('DOMContentLoaded', function() {
    cvBuilder = new CVBuilder();
});

// Global functions for template usage
function nextTab(tabName) {
    cvBuilder?.nextTab(tabName);
}

function previousTab(tabName) {
    cvBuilder?.previousTab(tabName);
}

function addExperienceEntry() {
    cvBuilder?.addExperienceEntry();
}

function addEducationEntry() {
    cvBuilder?.addEducationEntry();
}

function addCertificationEntry() {
    cvBuilder?.addCertificationEntry();
}

function addAwardEntry() {
    cvBuilder?.addAwardEntry();
}

function addVolunteeringEntry() {
    cvBuilder?.addVolunteeringEntry();
}

function addPublicationEntry() {
    cvBuilder?.addPublicationEntry();
}

function createCV() {
    cvBuilder?.createCV();
}

function saveDraft() {
    cvBuilder?.saveDraft();
} 