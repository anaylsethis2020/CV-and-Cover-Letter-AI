// CV and Cover Letter AI - Main JavaScript File

// DOM Elements
const elements = {
    documentType: null,
    personalInfo: null,
    jobDescription: null,
    generateBtn: null,
    previewContent: null,
    btnText: null,
    btnLoader: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    attachEventListeners();
    setupAccessibility();
    console.log('CV & Cover Letter AI initialized successfully');
});

// Initialize DOM elements
function initializeElements() {
    elements.documentType = document.getElementById('document-type');
    elements.personalInfo = document.getElementById('personal-info');
    elements.jobDescription = document.getElementById('job-description');
    elements.generateBtn = document.querySelector('.btn-primary.btn-full');
    elements.previewContent = document.getElementById('preview-content');
    elements.btnText = document.querySelector('.btn-text');
    elements.btnLoader = document.querySelector('.btn-loader');
}

// Attach event listeners
function attachEventListeners() {
    // Form validation on input
    if (elements.personalInfo) {
        elements.personalInfo.addEventListener('input', validateForm);
    }
    
    if (elements.documentType) {
        elements.documentType.addEventListener('change', validateForm);
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Form submission prevention
    document.addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

// Setup accessibility features
function setupAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main';
    }
    
    // Keyboard navigation for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

// Navigation click handler
function handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const target = document.querySelector(href);
    
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Smooth scroll functions for buttons
function scrollToGenerator() {
    const target = document.getElementById('generator');
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToFeatures() {
    const target = document.getElementById('features');
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Form validation
function validateForm() {
    const isValid = elements.documentType?.value && 
                   elements.personalInfo?.value.trim().length > 10;
    
    if (elements.generateBtn) {
        elements.generateBtn.disabled = !isValid;
        elements.generateBtn.style.opacity = isValid ? '1' : '0.6';
    }
    
    return isValid;
}

// Main document generation function
async function generateDocument() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        setLoadingState(true);
        
        const formData = {
            documentType: elements.documentType.value,
            personalInfo: elements.personalInfo.value.trim(),
            jobDescription: elements.jobDescription.value.trim()
        };
        
        // Simulate AI processing with realistic delay
        await simulateAIProcessing();
        
        // Generate the document based on type
        const generatedContent = await generateDocumentContent(formData);
        
        // Display the result
        displayGeneratedDocument(generatedContent);
        
        showNotification('Document generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating document:', error);
        showNotification('Failed to generate document. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Simulate AI processing with realistic timing
function simulateAIProcessing() {
    return new Promise(resolve => {
        // Simulate realistic processing time (2-4 seconds)
        const processingTime = 2000 + Math.random() * 2000;
        setTimeout(resolve, processingTime);
    });
}

// Generate document content based on form data
async function generateDocumentContent(formData) {
    const { documentType, personalInfo, jobDescription } = formData;
    
    // Parse personal information
    const personalData = parsePersonalInfo(personalInfo);
    
    // Analyze job description if provided
    const jobAnalysis = jobDescription ? analyzeJobDescription(jobDescription) : null;
    
    // Generate content based on document type
    switch (documentType) {
        case 'cv':
            return generateCV(personalData, jobAnalysis);
        case 'cover-letter':
            return generateCoverLetter(personalData, jobAnalysis);
        case 'both':
            return {
                cv: generateCV(personalData, jobAnalysis),
                coverLetter: generateCoverLetter(personalData, jobAnalysis)
            };
        default:
            throw new Error('Invalid document type');
    }
}

// Parse personal information from text
function parsePersonalInfo(info) {
    const lines = info.split('\n').filter(line => line.trim());
    
    return {
        name: extractName(info),
        contact: extractContact(info),
        summary: extractSummary(info),
        skills: extractSkills(info),
        experience: extractExperience(info),
        education: extractEducation(info),
        rawText: info
    };
}

// Extract name from personal info
function extractName(info) {
    const lines = info.split('\n');
    // Usually the first line or first few words contain the name
    const firstLine = lines[0]?.trim();
    if (firstLine && firstLine.split(' ').length >= 2 && firstLine.split(' ').length <= 4) {
        return firstLine;
    }
    return 'Your Name';
}

// Extract contact information
function extractContact(info) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const phoneRegex = /[\+]?[\d\s\-\(\)]{10,}/g;
    
    const emails = info.match(emailRegex) || [];
    const phones = info.match(phoneRegex) || [];
    
    return {
        email: emails[0] || 'your.email@example.com',
        phone: phones[0] || '+1 (555) 123-4567',
        location: extractLocation(info)
    };
}

// Extract location from text
function extractLocation(info) {
    const locationWords = ['city', 'state', 'country', 'address', 'location'];
    const lines = info.toLowerCase().split('\n');
    
    for (const line of lines) {
        if (locationWords.some(word => line.includes(word))) {
            return line.trim();
        }
    }
    
    return 'Your City, State';
}

// Extract professional summary
function extractSummary(info) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    const lines = info.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (summaryKeywords.some(keyword => line.includes(keyword))) {
            // Return the next few lines as summary
            return lines.slice(i + 1, i + 4).join(' ').trim() || 
                   'Experienced professional with a strong background in delivering high-quality results.';
        }
    }
    
    return 'Experienced professional with a strong background in delivering high-quality results.';
}

// Extract skills
function extractSkills(info) {
    const skillsKeywords = ['skills', 'technologies', 'expertise'];
    const lines = info.toLowerCase().split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        if (skillsKeywords.some(keyword => lines[i].includes(keyword))) {
            const skillsText = lines.slice(i + 1, i + 3).join(' ');
            return skillsText.split(/[,;]/).map(skill => skill.trim()).filter(Boolean) ||
                   ['Problem Solving', 'Communication', 'Leadership', 'Technical Skills'];
        }
    }
    
    return ['Problem Solving', 'Communication', 'Leadership', 'Technical Skills'];
}

// Extract experience
function extractExperience(info) {
    const expKeywords = ['experience', 'work', 'employment', 'career'];
    const lines = info.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (expKeywords.some(keyword => line.includes(keyword))) {
            return lines.slice(i + 1, i + 5).join('\n').trim() ||
                   'Professional experience in various roles with increasing responsibilities.';
        }
    }
    
    return 'Professional experience in various roles with increasing responsibilities.';
}

// Extract education
function extractEducation(info) {
    const eduKeywords = ['education', 'degree', 'university', 'college', 'school'];
    const lines = info.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (eduKeywords.some(keyword => line.includes(keyword))) {
            return lines.slice(i + 1, i + 3).join('\n').trim() ||
                   'Bachelor\'s Degree in relevant field';
        }
    }
    
    return 'Bachelor\'s Degree in relevant field';
}

// Analyze job description
function analyzeJobDescription(jobDesc) {
    const requirements = extractRequirements(jobDesc);
    const skills = extractJobSkills(jobDesc);
    const company = extractCompanyInfo(jobDesc);
    
    return {
        requirements,
        skills,
        company,
        keywords: extractKeywords(jobDesc)
    };
}

// Extract requirements from job description
function extractRequirements(jobDesc) {
    const reqKeywords = ['requirements', 'qualifications', 'must have', 'required'];
    const lines = jobDesc.toLowerCase().split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        if (reqKeywords.some(keyword => lines[i].includes(keyword))) {
            return jobDesc.split('\n').slice(i + 1, i + 5).join('\n').trim();
        }
    }
    
    return '';
}

// Extract skills from job description
function extractJobSkills(jobDesc) {
    const commonSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git',
        'Leadership', 'Communication', 'Problem Solving', 'Project Management',
        'Agile', 'Scrum', 'AWS', 'Docker', 'Kubernetes'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
        jobDesc.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills.length > 0 ? foundSkills : ['Relevant Technical Skills'];
}

// Extract company information
function extractCompanyInfo(jobDesc) {
    const lines = jobDesc.split('\n');
    return {
        name: 'Target Company',
        industry: 'Technology'
    };
}

// Extract keywords from job description
function extractKeywords(jobDesc) {
    const words = jobDesc.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3);
    
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);
}

// Generate CV content
function generateCV(personalData, jobAnalysis) {
    const skills = jobAnalysis ? 
        [...new Set([...personalData.skills, ...jobAnalysis.skills])].slice(0, 8) :
        personalData.skills;
    
    return {
        type: 'cv',
        content: `
            <div class="document-content">
                <div class="document-header">
                    <h1>${personalData.name}</h1>
                    <div class="contact-info">
                        <span>${personalData.contact.email}</span> • 
                        <span>${personalData.contact.phone}</span> • 
                        <span>${personalData.contact.location}</span>
                    </div>
                </div>
                
                <section class="document-section">
                    <h2>Professional Summary</h2>
                    <p>${personalData.summary}</p>
                </section>
                
                <section class="document-section">
                    <h2>Key Skills</h2>
                    <div class="skills-grid">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </section>
                
                <section class="document-section">
                    <h2>Experience</h2>
                    <div class="experience-content">
                        ${personalData.experience}
                    </div>
                </section>
                
                <section class="document-section">
                    <h2>Education</h2>
                    <div class="education-content">
                        ${personalData.education}
                    </div>
                </section>
            </div>
        `
    };
}

// Generate cover letter content
function generateCoverLetter(personalData, jobAnalysis) {
    const companyName = jobAnalysis?.company.name || 'Hiring Manager';
    
    return {
        type: 'cover-letter',
        content: `
            <div class="document-content">
                <div class="document-header">
                    <div class="sender-info">
                        <strong>${personalData.name}</strong><br>
                        ${personalData.contact.email}<br>
                        ${personalData.contact.phone}<br>
                        ${personalData.contact.location}
                    </div>
                    <div class="date">
                        ${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
                
                <div class="recipient-info">
                    <strong>Dear ${companyName},</strong>
                </div>
                
                <div class="letter-body">
                    <p>I am writing to express my strong interest in the position at your organization. With my background and experience, I am confident that I would be a valuable addition to your team.</p>
                    
                    <p>${personalData.summary} I am particularly drawn to this opportunity because it aligns perfectly with my career goals and expertise.</p>
                    
                    <p>In my previous roles, I have successfully demonstrated my ability to deliver results and contribute to team success. I am excited about the possibility of bringing my skills and enthusiasm to your organization.</p>
                    
                    <p>Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team's success.</p>
                    
                    <p>Sincerely,<br>
                    <strong>${personalData.name}</strong></p>
                </div>
            </div>
        `
    };
}

// Display generated document
function displayGeneratedDocument(content) {
    if (!elements.previewContent) return;
    
    if (content.type) {
        // Single document
        elements.previewContent.innerHTML = content.content;
    } else {
        // Both documents
        elements.previewContent.innerHTML = `
            <div class="document-tabs">
                <button class="tab-btn active" onclick="showDocument('cv')">CV/Resume</button>
                <button class="tab-btn" onclick="showDocument('cover-letter')">Cover Letter</button>
            </div>
            <div id="cv-document" class="document-tab-content">${content.cv.content}</div>
            <div id="cover-letter-document" class="document-tab-content" style="display: none;">${content.coverLetter.content}</div>
            <div class="document-actions">
                <button class="btn btn-primary" onclick="downloadDocument('cv')">Download CV</button>
                <button class="btn btn-secondary" onclick="downloadDocument('cover-letter')">Download Cover Letter</button>
            </div>
        `;
    }
    
    // Add document styles
    addDocumentStyles();
    
    // Scroll to preview
    elements.previewContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add styles for generated documents
function addDocumentStyles() {
    if (document.getElementById('document-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'document-styles';
    styles.textContent = `
        .document-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
        }
        
        .document-header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 0.5rem;
        }
        
        .contact-info {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 1.5rem;
        }
        
        .document-section {
            margin-bottom: 1.5rem;
        }
        
        .document-section h2 {
            font-size: 1.2rem;
            color: #2563eb;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.25rem;
        }
        
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill-tag {
            background: #f3f4f6;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            color: #374151;
            border: 1px solid #d1d5db;
        }
        
        .sender-info, .recipient-info {
            margin-bottom: 1rem;
        }
        
        .date {
            text-align: right;
            margin-bottom: 1rem;
        }
        
        .letter-body p {
            margin-bottom: 1rem;
        }
        
        .document-tabs {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .tab-btn {
            padding: 0.5rem 1rem;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .tab-btn.active {
            border-bottom-color: #2563eb;
            color: #2563eb;
            font-weight: 500;
        }
        
        .document-actions {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 1rem;
        }
        
        @media (max-width: 768px) {
            .document-content {
                padding: 1rem;
            }
            
            .document-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Tab switching for both documents
function showDocument(type) {
    const cvDoc = document.getElementById('cv-document');
    const coverLetterDoc = document.getElementById('cover-letter-document');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (type === 'cv') {
        cvDoc.style.display = 'block';
        coverLetterDoc.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        cvDoc.style.display = 'none';
        coverLetterDoc.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Set loading state
function setLoadingState(loading) {
    if (!elements.generateBtn || !elements.btnText || !elements.btnLoader) return;
    
    elements.generateBtn.disabled = loading;
    
    if (loading) {
        elements.btnText.style.display = 'none';
        elements.btnLoader.style.display = 'flex';
    } else {
        elements.btnText.style.display = 'block';
        elements.btnLoader.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
    };
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    styles.backgroundColor = colors[type] || colors.info;
    
    Object.assign(notification.style, styles);
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Download document (placeholder function)
function downloadDocument(type) {
    showNotification(`${type === 'cv' ? 'CV' : 'Cover Letter'} download feature coming soon!`, 'info');
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
            
            console.log('Page load performance:', {
                loadTime: loadTime + 'ms',
                domContentLoaded: (perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms'
            });
        }, 0);
    });
}

// Export functions for global access
window.scrollToGenerator = scrollToGenerator;
window.scrollToFeatures = scrollToFeatures;
window.generateDocument = generateDocument;
window.showDocument = showDocument;
window.downloadDocument = downloadDocument;