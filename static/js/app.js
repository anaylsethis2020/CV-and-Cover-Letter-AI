// CV and Cover Letter AI JavaScript

// API base URL
const API_BASE = '/api';

// Check API health on page load
document.addEventListener('DOMContentLoaded', function() {
    checkApiHealth();
});

/**
 * Check API health and update status
 */
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        const statusElement = document.getElementById('health-status');
        
        if (data.status === 'healthy' && data.api_key_configured) {
            statusElement.textContent = 'API Ready';
            statusElement.className = 'health-status healthy';
        } else if (data.status === 'healthy' && !data.api_key_configured) {
            statusElement.textContent = 'API Key Not Configured';
            statusElement.className = 'health-status error';
        } else {
            statusElement.textContent = 'API Error';
            statusElement.className = 'health-status error';
        }
    } catch (error) {
        const statusElement = document.getElementById('health-status');
        statusElement.textContent = 'API Unavailable';
        statusElement.className = 'health-status error';
    }
}

/**
 * Generate AI content based on user input
 */
async function generateContent() {
    const prompt = document.getElementById('prompt').value.trim();
    const contentType = document.getElementById('content-type').value;
    
    if (!prompt) {
        showError('Please enter a prompt describing what you need.');
        return;
    }
    
    // Clear previous results
    clearOutput();
    clearError();
    
    // Show loading state
    showLoading(true);
    setGenerateButtonState(false);
    
    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                content_type: contentType
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showOutput(data.content, data.tokens_used);
        } else {
            showError(data.error, data.status);
        }
        
    } catch (error) {
        showError('Network error: Could not connect to the server.');
    } finally {
        showLoading(false);
        setGenerateButtonState(true);
    }
}

/**
 * Show loading state
 */
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = show ? 'block' : 'none';
}

/**
 * Enable/disable generate button
 */
function setGenerateButtonState(enabled) {
    const button = document.getElementById('generate-btn');
    button.disabled = !enabled;
    button.textContent = enabled ? 'Generate Content' : 'Generating...';
}

/**
 * Show generated output
 */
function showOutput(content, tokensUsed) {
    const outputSection = document.getElementById('output-section');
    const outputContent = document.getElementById('output');
    
    outputContent.textContent = content;
    outputSection.style.display = 'block';
    
    // Add token usage info if available
    if (tokensUsed) {
        const tokenInfo = document.createElement('div');
        tokenInfo.style.fontSize = '0.9rem';
        tokenInfo.style.color = '#666';
        tokenInfo.style.marginTop = '10px';
        tokenInfo.textContent = `Tokens used: ${tokensUsed}`;
        outputContent.appendChild(tokenInfo);
    }
}

/**
 * Show error message
 */
function showError(message, errorType = null) {
    const errorSection = document.getElementById('error-section');
    const errorContent = document.getElementById('error-content');
    
    let displayMessage = message;
    
    // Provide user-friendly error messages
    if (errorType === 'rate_limit_error') {
        displayMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    } else if (errorType === 'auth_error') {
        displayMessage = 'API authentication failed. Please check the API key configuration.';
    } else if (errorType === 'api_error') {
        displayMessage = 'OpenAI API error. Please try again later.';
    }
    
    errorContent.textContent = displayMessage;
    errorSection.style.display = 'block';
}

/**
 * Clear output section
 */
function clearOutput() {
    const outputSection = document.getElementById('output-section');
    outputSection.style.display = 'none';
}

/**
 * Clear error section
 */
function clearError() {
    const errorSection = document.getElementById('error-section');
    errorSection.style.display = 'none';
}

/**
 * Copy generated content to clipboard
 */
async function copyToClipboard() {
    const outputContent = document.getElementById('output');
    const textToCopy = outputContent.textContent;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Show temporary feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
        
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Content copied to clipboard!');
    }
}

/**
 * Handle Enter key in textarea (Ctrl+Enter to generate)
 */
document.getElementById('prompt').addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        generateContent();
    }
});

/**
 * Auto-resize textarea based on content
 */
document.getElementById('prompt').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(120, this.scrollHeight) + 'px';
});