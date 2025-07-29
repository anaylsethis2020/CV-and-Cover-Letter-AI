// CV Builder Script for Live Preview
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the CV preview
    initializeCV();
    
    // Add event listeners for all form inputs
    addFormListeners();
    
    // Set up export button
    setupExportButton();
});

function initializeCV() {
    updateCVPreview();
}

function addFormListeners() {
    // Get all form inputs and textareas
    const inputs = document.querySelectorAll('#cvForm input, #cvForm textarea');
    
    // Add event listeners for real-time updates
    inputs.forEach(input => {
        input.addEventListener('input', updateCVPreview);
        input.addEventListener('blur', updateCVPreview);
    });
    
    // Special handling for experience sections
    document.addEventListener('input', function(e) {
        if (e.target.closest('.experience-item')) {
            updateCVPreview();
        }
    });
}

function updateCVPreview() {
    const preview = document.getElementById('cvPreview');
    
    // Get form data
    const formData = getFormData();
    
    // Generate CV HTML
    const cvHTML = generateCVHTML(formData);
    
    // Update preview
    preview.innerHTML = cvHTML;
}

function getFormData() {
    return {
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        jobTitle: getValue('jobTitle'),
        email: getValue('email'),
        phone: getValue('phone'),
        location: getValue('location'),
        linkedin: getValue('linkedin'),
        summary: getValue('summary'),
        degree: getValue('degree'),
        field: getValue('field'),
        school: getValue('school'),
        gradYear: getValue('gradYear'),
        skills: getValue('skills'),
        experience: getExperienceData()
    };
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function getExperienceData() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experiences = [];
    
    experienceItems.forEach(item => {
        const company = item.querySelector('.experience-company')?.value.trim() || '';
        const position = item.querySelector('.experience-position')?.value.trim() || '';
        const startDate = item.querySelector('.experience-start')?.value.trim() || '';
        const endDate = item.querySelector('.experience-end')?.value.trim() || '';
        const description = item.querySelector('.experience-description')?.value.trim() || '';
        
        if (company || position || startDate || endDate || description) {
            experiences.push({
                company,
                position,
                startDate,
                endDate,
                description
            });
        }
    });
    
    return experiences;
}

function generateCVHTML(data) {
    return `
        <div class="cv-header">
            <div class="cv-name">
                ${data.firstName || data.lastName ? 
                    `${data.firstName} ${data.lastName}`.trim() : 
                    '<span class="cv-placeholder">Your Name</span>'
                }
            </div>
            <div class="cv-title">
                ${data.jobTitle || '<span class="cv-placeholder">Job Title</span>'}
            </div>
            <div class="cv-contact">
                ${generateContactInfo(data)}
            </div>
        </div>

        <div class="cv-content">
            <div class="cv-left-column">
                ${generateSummarySection(data.summary)}
                ${generateExperienceSection(data.experience)}
            </div>
            <div class="cv-right-column">
                ${generateEducationSection(data)}
                ${generateSkillsSection(data.skills)}
            </div>
        </div>
    `;
}

function generateContactInfo(data) {
    const contactItems = [];
    
    if (data.email) {
        contactItems.push(`
            <div class="cv-contact-item">
                <i class="fas fa-envelope"></i>
                <span>${data.email}</span>
            </div>
        `);
    }
    
    if (data.phone) {
        contactItems.push(`
            <div class="cv-contact-item">
                <i class="fas fa-phone"></i>
                <span>${data.phone}</span>
            </div>
        `);
    }
    
    if (data.location) {
        contactItems.push(`
            <div class="cv-contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${data.location}</span>
            </div>
        `);
    }
    
    if (data.linkedin) {
        contactItems.push(`
            <div class="cv-contact-item">
                <i class="fab fa-linkedin"></i>
                <span>${data.linkedin}</span>
            </div>
        `);
    }
    
    if (contactItems.length === 0) {
        return '<span class="cv-placeholder">Contact information will appear here</span>';
    }
    
    return contactItems.join('');
}

function generateSummarySection(summary) {
    return `
        <div class="cv-section">
            <div class="cv-section-title">Professional Summary</div>
            <div class="cv-section-content">
                <div class="cv-summary">
                    ${summary || '<span class="cv-placeholder">Your professional summary will appear here. Highlight your key achievements, skills, and career objectives.</span>'}
                </div>
            </div>
        </div>
    `;
}

function generateExperienceSection(experiences) {
    let experienceHTML = `
        <div class="cv-section">
            <div class="cv-section-title">Professional Experience</div>
            <div class="cv-section-content">
    `;
    
    if (experiences.length === 0) {
        experienceHTML += '<span class="cv-placeholder">Your work experience will appear here</span>';
    } else {
        experiences.forEach(exp => {
            experienceHTML += `
                <div class="cv-experience-item">
                    <div class="cv-experience-header">
                        <div>
                            <div class="cv-experience-position">${exp.position || 'Position'}</div>
                            <div class="cv-experience-company">${exp.company || 'Company'}</div>
                        </div>
                        <div class="cv-experience-dates">
                            ${exp.startDate || 'Start'} - ${exp.endDate || 'End'}
                        </div>
                    </div>
                    ${exp.description ? `<div class="cv-experience-description">${exp.description}</div>` : ''}
                </div>
            `;
        });
    }
    
    experienceHTML += `
            </div>
        </div>
    `;
    
    return experienceHTML;
}

function generateEducationSection(data) {
    return `
        <div class="cv-section">
            <div class="cv-section-title">Education</div>
            <div class="cv-section-content">
                <div class="cv-education">
                    <div class="cv-education-left">
                        <div class="cv-education-degree">
                            ${data.degree || '<span class="cv-placeholder">Degree</span>'}
                        </div>
                        <div class="cv-education-field">
                            ${data.field || '<span class="cv-placeholder">Field of Study</span>'}
                        </div>
                        <div class="cv-education-school">
                            ${data.school || '<span class="cv-placeholder">School/University</span>'}
                        </div>
                    </div>
                    <div class="cv-education-year">
                        ${data.gradYear || '<span class="cv-placeholder">Year</span>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateSkillsSection(skills) {
    let skillsHTML = `
        <div class="cv-section">
            <div class="cv-section-title">Skills</div>
            <div class="cv-section-content">
                <div class="cv-skills">
    `;
    
    if (!skills) {
        skillsHTML += '<span class="cv-placeholder">Your skills will appear here as tags</span>';
    } else {
        const skillArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        if (skillArray.length === 0) {
            skillsHTML += '<span class="cv-placeholder">Your skills will appear here as tags</span>';
        } else {
            skillArray.forEach(skill => {
                skillsHTML += `<span class="cv-skill-tag">${skill}</span>`;
            });
        }
    }
    
    skillsHTML += `
                </div>
            </div>
        </div>
    `;
    
    return skillsHTML;
}

function addExperience() {
    const container = document.getElementById('experienceContainer');
    const experienceCount = container.children.length;
    
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item border rounded p-3 mb-3';
    newExperience.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <small class="text-muted">Experience ${experienceCount + 1}</small>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeExperience(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Company</label>
                <input type="text" class="form-control experience-company" placeholder="Tech Corp">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">Position</label>
                <input type="text" class="form-control experience-position" placeholder="Senior Developer">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-2">
                <label class="form-label">Start Date</label>
                <input type="text" class="form-control experience-start" placeholder="Jan 2020">
            </div>
            <div class="col-md-6 mb-2">
                <label class="form-label">End Date</label>
                <input type="text" class="form-control experience-end" placeholder="Present">
            </div>
        </div>
        <div class="mb-2">
            <label class="form-label">Description</label>
            <textarea class="form-control experience-description" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
        </div>
    `;
    
    container.appendChild(newExperience);
    
    // Add event listeners to new inputs
    const newInputs = newExperience.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updateCVPreview);
        input.addEventListener('blur', updateCVPreview);
    });
    
    // Update preview
    updateCVPreview();
}

function removeExperience(button) {
    const experienceItem = button.closest('.experience-item');
    experienceItem.remove();
    updateCVPreview();
}

function setupExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', function() {
        // Placeholder for export functionality
        alert('Export functionality will be implemented here.\n\nFeatures to include:\n• PDF generation\n• Downloadable file\n• Print optimization');
    });
}

// Initialize sample data for demonstration
function loadSampleData() {
    document.getElementById('firstName').value = 'John';
    document.getElementById('lastName').value = 'Doe';
    document.getElementById('jobTitle').value = 'Senior Software Developer';
    document.getElementById('email').value = 'john.doe@email.com';
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('location').value = 'New York, NY';
    document.getElementById('linkedin').value = 'linkedin.com/in/johndoe';
    document.getElementById('summary').value = 'Experienced software developer with 5+ years of expertise in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve project goals.';
    document.getElementById('degree').value = 'Bachelor of Science';
    document.getElementById('field').value = 'Computer Science';
    document.getElementById('school').value = 'University of Technology';
    document.getElementById('gradYear').value = '2018';
    document.getElementById('skills').value = 'JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker';
    
    // Add sample experience
    const companyField = document.querySelector('.experience-company');
    const positionField = document.querySelector('.experience-position');
    const startField = document.querySelector('.experience-start');
    const endField = document.querySelector('.experience-end');
    const descField = document.querySelector('.experience-description');
    
    if (companyField) companyField.value = 'Tech Solutions Inc.';
    if (positionField) positionField.value = 'Senior Software Developer';
    if (startField) startField.value = 'Jan 2020';
    if (endField) endField.value = 'Present';
    if (descField) descField.value = 'Led development of customer-facing web applications using React and Node.js. Improved application performance by 40% and reduced load times by implementing efficient caching strategies.';
    
    updateCVPreview();
}

// Add a button to load sample data for testing
document.addEventListener('DOMContentLoaded', function() {
    // Create a sample data button for testing
    const header = document.querySelector('.card-header h5');
    if (header) {
        const sampleBtn = document.createElement('button');
        sampleBtn.className = 'btn btn-outline-secondary btn-sm ms-2';
        sampleBtn.innerHTML = '<i class="fas fa-magic me-1"></i>Sample';
        sampleBtn.onclick = loadSampleData;
        header.parentNode.appendChild(sampleBtn);
    }
});