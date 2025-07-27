// CV AI Builder JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeForms();
    initializeStripe();
    initializeCVEditor();
    initializeCoverLetterGenerator();
    initializePDFExport();
});

// Form handling and validation
function initializeForms() {
    // Auto-save forms
    const forms = document.querySelectorAll('form[data-auto-save]');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                saveFormData(form);
            });
        });
    });

    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', checkPasswordStrength);
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${form.id}`, JSON.stringify(data));
}

function loadFormData(form) {
    const saved = localStorage.getItem(`form_${form.id}`);
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

function checkPasswordStrength(input) {
    const password = input.value;
    const strengthIndicator = input.parentNode.querySelector('.password-strength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            feedback = '<span class="text-danger">Very Weak</span>';
            break;
        case 2:
            feedback = '<span class="text-warning">Weak</span>';
            break;
        case 3:
            feedback = '<span class="text-info">Medium</span>';
            break;
        case 4:
            feedback = '<span class="text-success">Strong</span>';
            break;
        case 5:
            feedback = '<span class="text-success">Very Strong</span>';
            break;
    }
    
    strengthIndicator.innerHTML = feedback;
}

// Stripe integration
function initializeStripe() {
    if (typeof Stripe === 'undefined') return;
    
    const stripe = Stripe(document.querySelector('meta[name="stripe-publishable-key"]')?.content);
    
    // Handle subscription checkout
    const subscribeButtons = document.querySelectorAll('[data-stripe-price]');
    subscribeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const priceId = button.dataset.stripePrice;
            const subscriptionType = button.dataset.subscriptionType;
            
            if (!priceId) {
                window.location.href = button.href;
                return;
            }
            
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Processing...';
            
            try {
                const response = await fetch('/payments/create-checkout-session/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: `price_id=${priceId}&subscription_type=${subscriptionType}`
                });
                
                const data = await response.json();
                
                if (data.session_id) {
                    const result = await stripe.redirectToCheckout({
                        sessionId: data.session_id
                    });
                    
                    if (result.error) {
                        showAlert('Payment error: ' + result.error.message, 'danger');
                    }
                } else {
                    showAlert('Error creating checkout session', 'danger');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'danger');
            } finally {
                button.disabled = false;
                button.innerHTML = button.dataset.originalText || 'Subscribe';
            }
        });
    });
}

// CV Editor functionality
function initializeCVEditor() {
    // Add experience section
    const addExperienceBtn = document.querySelector('#add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperienceSection);
    }
    
    // Add education section
    const addEducationBtn = document.querySelector('#add-education-btn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducationSection);
    }
    
    // Add project section
    const addProjectBtn = document.querySelector('#add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProjectSection);
    }
    
    // Real-time preview
    const previewToggle = document.querySelector('#preview-toggle');
    if (previewToggle) {
        previewToggle.addEventListener('change', togglePreview);
    }
}

function addExperienceSection() {
    const container = document.querySelector('#experience-container');
    const template = document.querySelector('#experience-template');
    
    if (container && template) {
        const clone = template.content.cloneNode(true);
        const removeBtn = clone.querySelector('.remove-section');
        removeBtn.addEventListener('click', (e) => {
            e.target.closest('.experience-section').remove();
        });
        container.appendChild(clone);
    }
}

function addEducationSection() {
    const container = document.querySelector('#education-container');
    const template = document.querySelector('#education-template');
    
    if (container && template) {
        const clone = template.content.cloneNode(true);
        const removeBtn = clone.querySelector('.remove-section');
        removeBtn.addEventListener('click', (e) => {
            e.target.closest('.education-section').remove();
        });
        container.appendChild(clone);
    }
}

function addProjectSection() {
    const container = document.querySelector('#project-container');
    const template = document.querySelector('#project-template');
    
    if (container && template) {
        const clone = template.content.cloneNode(true);
        const removeBtn = clone.querySelector('.remove-section');
        removeBtn.addEventListener('click', (e) => {
            e.target.closest('.project-section').remove();
        });
        container.appendChild(clone);
    }
}

function togglePreview() {
    const previewToggle = document.querySelector('#preview-toggle');
    const editor = document.querySelector('#cv-editor');
    const preview = document.querySelector('#cv-preview');
    
    if (previewToggle.checked) {
        editor.style.display = 'none';
        preview.style.display = 'block';
        updatePreview();
    } else {
        editor.style.display = 'block';
        preview.style.display = 'none';
    }
}

function updatePreview() {
    const preview = document.querySelector('#cv-preview');
    const formData = new FormData(document.querySelector('#cv-form'));
    
    // Update preview with form data
    const name = formData.get('first_name') + ' ' + formData.get('last_name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const summary = formData.get('summary');
    
    preview.querySelector('.cv-name').textContent = name;
    preview.querySelector('.cv-email').textContent = email;
    preview.querySelector('.cv-phone').textContent = phone;
    preview.querySelector('.cv-summary').textContent = summary;
}

// Cover Letter Generator
function initializeCoverLetterGenerator() {
    const generateBtn = document.querySelector('#generate-cover-letter-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateCoverLetter);
    }
    
    // Auto-save job description
    const jobDescription = document.querySelector('#id_job_description');
    if (jobDescription) {
        jobDescription.addEventListener('input', debounce(saveJobDescription, 1000));
    }
}

async function generateCoverLetter() {
    const generateBtn = document.querySelector('#generate-cover-letter-btn');
    const form = document.querySelector('#cover-letter-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/cover-letter-generator/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect_url;
            } else {
                showAlert(data.error || 'Error generating cover letter', 'danger');
            }
        } else {
            showAlert('Network error. Please try again.', 'danger');
        }
    } catch (error) {
        showAlert('Error generating cover letter', 'danger');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Generate Cover Letter';
    }
}

function saveJobDescription() {
    const jobDescription = document.querySelector('#id_job_description');
    if (jobDescription) {
        localStorage.setItem('job_description_draft', jobDescription.value);
    }
}

// PDF Export functionality
function initializePDFExport() {
    const exportBtn = document.querySelector('#export-pdf-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportPDF);
    }
}

async function exportPDF() {
    const exportBtn = document.querySelector('#export-pdf-btn');
    const form = document.querySelector('#export-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    exportBtn.disabled = true;
    exportBtn.innerHTML = '<span class="loading-spinner"></span> Generating PDF...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/export-pdf/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            body: formData
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cv_export.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showAlert('Error generating PDF', 'danger');
        }
    } catch (error) {
        showAlert('Error generating PDF', 'danger');
    } finally {
        exportBtn.disabled = false;
        exportBtn.innerHTML = 'Export PDF';
    }
}

// Utility functions
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}

function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('#alert-container') || document.body;
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function debounce(func, wait) {
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

// Auto-load saved form data
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-auto-save]');
    forms.forEach(loadFormData);
    
    // Load job description draft
    const jobDescription = document.querySelector('#id_job_description');
    if (jobDescription) {
        const draft = localStorage.getItem('job_description_draft');
        if (draft) {
            jobDescription.value = draft;
        }
    }
});

// Handle form submissions with AJAX
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.dataset.ajax) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
        
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'X-CSRFToken': getCSRFToken(),
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert(data.message || 'Success!', 'success');
                if (data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1000);
                }
            } else {
                showAlert(data.error || 'Error occurred', 'danger');
            }
        })
        .catch(error => {
            showAlert('Network error. Please try again.', 'danger');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
}); 