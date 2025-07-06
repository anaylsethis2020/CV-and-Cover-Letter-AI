// Global variables
let stripe;
let elements;
let card;
let currentDocumentType = '';

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Add experience item
function addExperience() {
    const container = document.getElementById('experience-container');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Job Title" class="job-title">
        <input type="text" placeholder="Company Name" class="company">
        <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" class="duration">
        <textarea placeholder="Key responsibilities and achievements..." class="description" rows="3"></textarea>
        <button type="button" onclick="removeItem(this)" style="background-color: #e74c3c;">Remove</button>
    `;
    container.appendChild(newItem);
}

// Add education item
function addEducation() {
    const container = document.getElementById('education-container');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Degree" class="degree">
        <input type="text" placeholder="Institution" class="institution">
        <input type="text" placeholder="Year" class="year">
        <button type="button" onclick="removeItem(this)" style="background-color: #e74c3c;">Remove</button>
    `;
    container.appendChild(newItem);
}

// Remove item
function removeItem(button) {
    button.parentElement.remove();
}

// Collect CV form data
function collectCVData() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experience = Array.from(experienceItems).map(item => ({
        job_title: item.querySelector('.job-title').value,
        company: item.querySelector('.company').value,
        duration: item.querySelector('.duration').value,
        description: item.querySelector('.description').value
    }));

    const educationItems = document.querySelectorAll('.education-item');
    const education = Array.from(educationItems).map(item => ({
        degree: item.querySelector('.degree').value,
        institution: item.querySelector('.institution').value,
        year: item.querySelector('.year').value
    }));

    return {
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        experience: experience,
        education: education,
        skills: document.getElementById('skills').value
    };
}

// Collect cover letter form data
function collectCoverLetterData() {
    return {
        cl_full_name: document.getElementById('cl_full_name').value,
        cl_email: document.getElementById('cl_email').value,
        cl_phone: document.getElementById('cl_phone').value,
        cl_address: document.getElementById('cl_address').value,
        hiring_manager: document.getElementById('hiring_manager').value,
        company_name: document.getElementById('company_name').value,
        position: document.getElementById('position').value,
        date: document.getElementById('date').value || new Date().toLocaleDateString(),
        opening_paragraph: document.getElementById('opening_paragraph').value,
        body_paragraph: document.getElementById('body_paragraph').value,
        closing_paragraph: document.getElementById('closing_paragraph').value
    };
}

// Preview CV
function previewCV() {
    const data = collectCVData();
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    
    let html = `
        <div style="text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 24pt; margin: 0; color: #2c3e50;">${data.full_name || 'Your Name'}</h1>
            <div style="margin-top: 10px; font-size: 10pt;">
                ${data.email ? `📧 ${data.email}` : ''} 
                ${data.phone ? `📞 ${data.phone}` : ''} 
                ${data.location ? `📍 ${data.location}` : ''}
            </div>
        </div>
    `;
    
    if (data.summary) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: #2c3e50; border-bottom: 1px solid #3498db;">Professional Summary</h2>
                <p style="font-style: italic; background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db;">${data.summary}</p>
            </div>
        `;
    }
    
    if (data.experience.length > 0) {
        html += `<div style="margin-bottom: 25px;"><h2 style="color: #2c3e50; border-bottom: 1px solid #3498db;">Work Experience</h2>`;
        data.experience.forEach(job => {
            if (job.job_title || job.company) {
                html += `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <div style="font-weight: bold;">${job.job_title || 'Job Title'}</div>
                                <div style="font-style: italic; color: #555;">${job.company || 'Company'}</div>
                            </div>
                            <div style="color: #666;">${job.duration || 'Duration'}</div>
                        </div>
                        ${job.description ? `<div style="margin-top: 5px;">${job.description}</div>` : ''}
                    </div>
                `;
            }
        });
        html += `</div>`;
    }
    
    previewContent.innerHTML = html;
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

// Preview cover letter
function previewCoverLetter() {
    const data = collectCoverLetterData();
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    
    let html = `
        <div style="text-align: right; margin-bottom: 30px;">
            <div style="font-weight: bold;">${data.cl_full_name || 'Your Name'}</div>
            ${data.cl_address ? `<div>${data.cl_address}</div>` : ''}
            ${data.cl_phone ? `<div>${data.cl_phone}</div>` : ''}
            ${data.cl_email ? `<div>${data.cl_email}</div>` : ''}
        </div>
        
        <div style="text-align: right; margin-bottom: 30px;">
            ${data.date}
        </div>
        
        <div style="margin-bottom: 30px;">
            ${data.hiring_manager ? `<div>${data.hiring_manager}</div><div>Hiring Manager</div>` : ''}
            ${data.company_name ? `<div style="font-weight: bold;">${data.company_name}</div>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong>Subject: Application for ${data.position || 'Position'}</strong>
        </div>
        
        <div style="margin-bottom: 20px;">
            Dear ${data.hiring_manager || 'Hiring Manager'},
        </div>
        
        <div style="text-align: justify;">
            ${data.opening_paragraph ? `<p>${data.opening_paragraph}</p>` : '<p>Opening paragraph...</p>'}
            ${data.body_paragraph ? `<p>${data.body_paragraph}</p>` : '<p>Body paragraph...</p>'}
            ${data.closing_paragraph ? `<p>${data.closing_paragraph}</p>` : '<p>Closing paragraph...</p>'}
        </div>
        
        <div style="margin-top: 30px;">
            <div>Sincerely,</div>
            <div style="font-weight: bold; margin-top: 20px;">${data.cl_full_name || 'Your Name'}</div>
        </div>
    `;
    
    previewContent.innerHTML = html;
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

// Close preview
function closePreview() {
    document.getElementById('preview-section').style.display = 'none';
}

// Setup Stripe Elements
function setupStripeElements() {
    if (!stripe) {
        console.error('Stripe not initialized');
        return;
    }
    
    elements = stripe.elements();
    
    // Create card element
    card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
        },
    });
    
    // Mount card element
    card.mount('#card-element');
    
    // Handle real-time validation errors from the card Element
    card.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    // Handle form submission
    document.getElementById('submit-payment').addEventListener('click', handlePayment);
}

// Initiate payment process
function initiatePayment(documentType) {
    currentDocumentType = documentType;
    document.getElementById('payment-modal').style.display = 'flex';
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

// Handle payment
async function handlePayment() {
    const submitButton = document.getElementById('submit-payment');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        // Create payment intent
        const response = await fetch('/create_payment_intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const { client_secret } = await response.json();
        
        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: card,
            }
        });
        
        if (error) {
            // Show error to customer
            document.getElementById('card-errors').textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = 'Pay $9.99';
        } else {
            // Payment succeeded
            closePaymentModal();
            
            // Confirm payment on server and download PDF
            await confirmPaymentAndDownload(paymentIntent.id);
        }
    } catch (error) {
        console.error('Payment error:', error);
        document.getElementById('card-errors').textContent = 'An unexpected error occurred.';
        submitButton.disabled = false;
        submitButton.textContent = 'Pay $9.99';
    }
}

// Confirm payment and download PDF
async function confirmPaymentAndDownload(paymentIntentId) {
    try {
        // Confirm payment on server
        const confirmResponse = await fetch('/confirm_payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_intent_id: paymentIntentId
            })
        });
        
        const confirmResult = await confirmResponse.json();
        
        if (confirmResult.success) {
            // Payment confirmed, now download PDF
            await downloadPDF();
            alert('Payment successful! Your PDF is downloading.');
        } else {
            alert('Payment verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Confirmation error:', error);
        alert('Error confirming payment. Please contact support.');
    }
}

// Download PDF
async function downloadPDF() {
    try {
        let data, endpoint;
        
        if (currentDocumentType === 'cv') {
            data = collectCVData();
            endpoint = '/generate_cv_pdf';
        } else {
            data = collectCoverLetterData();
            endpoint = '/generate_cover_letter_pdf';
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = currentDocumentType === 'cv' ? 'cv.pdf' : 'cover_letter.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('Error generating PDF. Please try again.');
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading PDF. Please try again.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set current date for cover letter
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Setup Stripe if available
    if (typeof Stripe !== 'undefined') {
        // Stripe will be initialized from the HTML template
    }
});