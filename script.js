// CV and Cover Letter AI - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize responsive features
    initializeResponsiveFeatures();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
});

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Improve focus management for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const firstInput = modal.querySelector('input, button, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });
    
    // Add keyboard navigation hints
    addKeyboardNavigationHints();
    
    // Improve form validation messages
    improveFormValidation();
}

/**
 * Add keyboard navigation hints for screen readers
 */
function addKeyboardNavigationHints() {
    const navigationItems = document.querySelectorAll('.nav-link');
    navigationItems.forEach((item, index) => {
        item.setAttribute('aria-posinset', index + 1);
        item.setAttribute('aria-setsize', navigationItems.length);
    });
}

/**
 * Improve form validation with accessible error messages
 */
function improveFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            // Add error container for each required field
            const errorContainer = document.createElement('div');
            errorContainer.className = 'invalid-feedback';
            errorContainer.id = `${input.id}-error`;
            input.setAttribute('aria-describedby', `${input.id}Help ${input.id}-error`);
            input.parentNode.appendChild(errorContainer);
            
            // Add real-time validation
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid')) {
                    validateField(input);
                }
            });
        });
    });
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - The form field to validate
 */
function validateField(field) {
    const errorContainer = document.getElementById(`${field.id}-error`);
    
    if (!field.validity.valid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        let errorMessage = '';
        if (field.validity.valueMissing) {
            errorMessage = `${field.labels[0].textContent.replace('*', '').trim()} is required.`;
        } else if (field.validity.typeMismatch) {
            errorMessage = `Please enter a valid ${field.type}.`;
        } else if (field.validity.tooShort) {
            errorMessage = `Please enter at least ${field.minLength} characters.`;
        }
        
        errorContainer.textContent = errorMessage;
        announceToScreenReader(errorMessage);
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        errorContainer.textContent = '';
    }
}

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
    // CV Form Handler
    const cvForm = document.getElementById('cv-form');
    if (cvForm) {
        cvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCVGeneration();
        });
    }
    
    // Cover Letter Form Handler
    const coverLetterForm = document.getElementById('cover-letter-form');
    if (coverLetterForm) {
        coverLetterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCoverLetterGeneration();
        });
    }
    
    // Add form auto-save functionality
    initializeAutoSave();
}

/**
 * Handle CV generation
 */
function handleCVGeneration() {
    const form = document.getElementById('cv-form');
    
    // Validate form
    if (!validateForm(form)) {
        announceToScreenReader('Please correct the errors in the form before submitting.');
        return;
    }
    
    // Show loading modal
    showLoadingModal('Generating your professional CV...');
    
    // Collect form data
    const formData = new FormData(form);
    const cvData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        experience: formData.get('experience'),
        skills: formData.get('skills')
    };
    
    // Simulate AI processing
    setTimeout(() => {
        hideLoadingModal();
        displayCVResult(cvData);
        announceToScreenReader('Your CV has been successfully generated.');
    }, 3000);
}

/**
 * Handle Cover Letter generation
 */
function handleCoverLetterGeneration() {
    const form = document.getElementById('cover-letter-form');
    
    // Validate form
    if (!validateForm(form)) {
        announceToScreenReader('Please correct the errors in the form before submitting.');
        return;
    }
    
    // Show loading modal
    showLoadingModal('Generating your personalized cover letter...');
    
    // Collect form data
    const formData = new FormData(form);
    const coverLetterData = {
        name: formData.get('clFirstName'),
        companyName: formData.get('companyName'),
        jobTitle: formData.get('jobTitle'),
        jobDescription: formData.get('jobDescription')
    };
    
    // Simulate AI processing
    setTimeout(() => {
        hideLoadingModal();
        displayCoverLetterResult(coverLetterData);
        announceToScreenReader('Your cover letter has been successfully generated.');
    }, 3000);
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        validateField(field);
        if (!field.validity.valid) {
            isValid = false;
        }
    });
    
    // Focus on first invalid field
    if (!isValid) {
        const firstInvalidField = form.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }
    
    return isValid;
}

/**
 * Show loading modal
 * @param {string} message - Loading message to display
 */
function showLoadingModal(message = 'Processing...') {
    const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
    document.querySelector('#loadingModal h5').textContent = message;
    modal.show();
}

/**
 * Hide loading modal
 */
function hideLoadingModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
    if (modal) {
        modal.hide();
    }
}

/**
 * Display CV generation result
 * @param {Object} cvData - The CV data object
 */
function displayCVResult(cvData) {
    const resultHTML = `
        <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">CV Generated Successfully!</h4>
            <p>Your professional CV for <strong>${cvData.firstName} ${cvData.lastName}</strong> has been created.</p>
            <hr>
            <p class="mb-0">You can now download or share your CV. <a href="#" class="alert-link">Download PDF</a></p>
        </div>
    `;
    
    insertResult('cv-generator', resultHTML);
}

/**
 * Display Cover Letter generation result
 * @param {Object} coverLetterData - The cover letter data object
 */
function displayCoverLetterResult(coverLetterData) {
    const resultHTML = `
        <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Cover Letter Generated Successfully!</h4>
            <p>Your personalized cover letter for the <strong>${coverLetterData.jobTitle}</strong> position at <strong>${coverLetterData.companyName}</strong> has been created.</p>
            <hr>
            <p class="mb-0">You can now download or share your cover letter. <a href="#" class="alert-link">Download PDF</a></p>
        </div>
    `;
    
    insertResult('cover-letter-generator', resultHTML);
}

/**
 * Insert result into the page
 * @param {string} sectionId - The section to insert the result into
 * @param {string} resultHTML - The HTML content to insert
 */
function insertResult(sectionId, resultHTML) {
    const section = document.getElementById(sectionId);
    const existingResult = section.querySelector('.alert');
    
    if (existingResult) {
        existingResult.remove();
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultHTML;
    const resultElement = tempDiv.firstElementChild;
    
    // Insert after the card
    const card = section.querySelector('.card');
    card.parentNode.insertBefore(resultElement, card.nextSibling);
    
    // Scroll to result
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus on result for accessibility
    resultElement.setAttribute('tabindex', '-1');
    resultElement.focus();
}

/**
 * Initialize auto-save functionality
 */
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Load saved data
            const savedValue = localStorage.getItem(`autosave_${input.id}`);
            if (savedValue && input.type !== 'email') {
                input.value = savedValue;
            }
            
            // Save data on input
            input.addEventListener('input', function() {
                localStorage.setItem(`autosave_${input.id}`, input.value);
            });
        });
        
        // Clear auto-save on successful submission
        form.addEventListener('submit', function() {
            inputs.forEach(input => {
                localStorage.removeItem(`autosave_${input.id}`);
            });
        });
    });
}

/**
 * Initialize responsive features
 */
function initializeResponsiveFeatures() {
    // Handle viewport changes
    window.addEventListener('resize', debounce(handleViewportChange, 250));
    
    // Initial viewport setup
    handleViewportChange();
    
    // Touch device optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        optimizeForTouch();
    }
}

/**
 * Handle viewport changes for responsive design
 */
function handleViewportChange() {
    const width = window.innerWidth;
    
    // Update CSS custom property for JavaScript access
    document.documentElement.style.setProperty('--viewport-width', `${width}px`);
    
    // Adjust layout based on viewport size
    if (width < 768) {
        // Mobile optimizations
        adjustForMobile();
    } else if (width < 992) {
        // Tablet optimizations
        adjustForTablet();
    } else {
        // Desktop optimizations
        adjustForDesktop();
    }
}

/**
 * Adjust layout for mobile devices
 */
function adjustForMobile() {
    // Ensure form controls are properly sized for mobile
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.style.fontSize = '16px'; // Prevent zoom on iOS
    });
    
    // Adjust button spacing
    const buttonGroups = document.querySelectorAll('.d-flex.gap-3');
    buttonGroups.forEach(group => {
        group.classList.add('flex-column');
        group.classList.remove('flex-sm-row');
    });
}

/**
 * Adjust layout for tablet devices
 */
function adjustForTablet() {
    // Reset any mobile-specific adjustments
    const buttonGroups = document.querySelectorAll('.d-flex.gap-3');
    buttonGroups.forEach(group => {
        group.classList.remove('flex-column');
        group.classList.add('flex-sm-row');
    });
}

/**
 * Adjust layout for desktop devices
 */
function adjustForDesktop() {
    // Ensure optimal desktop layout
    adjustForTablet(); // Desktop uses same adjustments as tablet
}

/**
 * Optimize interface for touch devices
 */
function optimizeForTouch() {
    // Increase touch target sizes
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
    });
    
    // Add touch-friendly hover states
    document.addEventListener('touchstart', function() {}, { passive: true });
}

/**
 * Initialize keyboard navigation enhancements
 */
function initializeKeyboardNavigation() {
    // Add escape key handling for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modal = bootstrap.Modal.getInstance(openModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    });
    
    // Improve focus management
    document.addEventListener('keydown', function(e) {
        // Handle Tab navigation in forms
        if (e.key === 'Tab') {
            const activeElement = document.activeElement;
            const form = activeElement.closest('form');
            
            if (form) {
                const formElements = form.querySelectorAll('input, textarea, button, select');
                const firstElement = formElements[0];
                const lastElement = formElements[formElements.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
    
    // Add skip navigation functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

// Export functions for testing (if in a module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        announceToScreenReader,
        debounce
    };
}