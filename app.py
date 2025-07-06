import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

def generate_ai_content(prompt, content_type="general"):
    """
    Generate AI content using OpenAI API
    
    Args:
        prompt (str): The user's input prompt
        content_type (str): Type of content to generate (cv, cover_letter, general)
    
    Returns:
        dict: Response containing generated content or error
    """
    try:
        # Validate API key
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return {
                'error': 'API key not configured. Please set OPENAI_API_KEY environment variable.',
                'status': 'error'
            }
        
        # Create a more specific prompt based on content type
        system_prompts = {
            'cv': 'You are a professional CV writer. Help create compelling CV content that highlights skills and experience.',
            'cover_letter': 'You are a professional cover letter writer. Help create personalized cover letters that match job requirements.',
            'general': 'You are a helpful assistant for creating professional documents.'
        }
        
        system_prompt = system_prompts.get(content_type, system_prompts['general'])
        
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        generated_text = response.choices[0].message.content.strip()
        
        return {
            'content': generated_text,
            'status': 'success',
            'tokens_used': response.usage.total_tokens
        }
        
    except openai.RateLimitError:
        return {
            'error': 'Rate limit exceeded. Please try again later.',
            'status': 'rate_limit_error'
        }
    except openai.AuthenticationError:
        return {
            'error': 'Invalid API key. Please check your OpenAI API key.',
            'status': 'auth_error'
        }
    except openai.APIError as e:
        return {
            'error': f'OpenAI API error: {str(e)}',
            'status': 'api_error'
        }
    except Exception as e:
        return {
            'error': f'Unexpected error: {str(e)}',
            'status': 'error'
        }

@app.route('/')
def index():
    """Serve the main application page"""
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_content():
    """
    API endpoint to generate AI content
    
    Expected JSON payload:
    {
        "prompt": "User's input text",
        "content_type": "cv" | "cover_letter" | "general"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided',
                'status': 'error'
            }), 400
        
        prompt = data.get('prompt', '').strip()
        content_type = data.get('content_type', 'general')
        
        if not prompt:
            return jsonify({
                'error': 'Prompt is required',
                'status': 'error'
            }), 400
        
        if content_type not in ['cv', 'cover_letter', 'general']:
            return jsonify({
                'error': 'Invalid content_type. Must be one of: cv, cover_letter, general',
                'status': 'error'
            }), 400
        
        # Generate AI content
        result = generate_ai_content(prompt, content_type)
        
        if result['status'] == 'success':
            return jsonify(result)
        else:
            # Return appropriate HTTP status code based on error type
            status_codes = {
                'rate_limit_error': 429,
                'auth_error': 401,
                'api_error': 502,
                'error': 500
            }
            return jsonify(result), status_codes.get(result['status'], 500)
            
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    api_key = os.getenv('OPENAI_API_KEY')
    return jsonify({
        'status': 'healthy',
        'service': 'CV and Cover Letter AI',
        'api_key_configured': bool(api_key)
    })

if __name__ == '__main__':
    # Check if API key is configured
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Warning: OPENAI_API_KEY environment variable not set!")
        print("Please copy .env.example to .env and add your OpenAI API key.")
    
    app.run(debug=True, host='0.0.0.0', port=5000)