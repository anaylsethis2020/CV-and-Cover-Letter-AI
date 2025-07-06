from flask import Flask, render_template, request, jsonify, make_response
import stripe
import weasyprint
from config import Config
import json
from io import BytesIO

app = Flask(__name__)
app.config.from_object(Config)

# Configure Stripe
stripe.api_key = app.config['STRIPE_SECRET_KEY']

@app.route('/')
def index():
    """Main page with CV and cover letter forms"""
    return render_template('index.html', 
                         stripe_publishable_key=app.config['STRIPE_PUBLISHABLE_KEY'])

@app.route('/generate_cv_pdf', methods=['POST'])
def generate_cv_pdf():
    """Generate CV PDF from form data"""
    cv_data = request.json
    
    # Render HTML template with CV data
    html_content = render_template('cv_template.html', **cv_data)
    
    # Generate PDF using WeasyPrint
    pdf_buffer = BytesIO()
    weasyprint.HTML(string=html_content).write_pdf(pdf_buffer)
    pdf_buffer.seek(0)
    
    # Create response
    response = make_response(pdf_buffer.read())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=cv.pdf'
    
    return response

@app.route('/generate_cover_letter_pdf', methods=['POST'])
def generate_cover_letter_pdf():
    """Generate cover letter PDF from form data"""
    letter_data = request.json
    
    # Render HTML template with cover letter data
    html_content = render_template('cover_letter_template.html', **letter_data)
    
    # Generate PDF using WeasyPrint
    pdf_buffer = BytesIO()
    weasyprint.HTML(string=html_content).write_pdf(pdf_buffer)
    pdf_buffer.seek(0)
    
    # Create response
    response = make_response(pdf_buffer.read())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=cover_letter.pdf'
    
    return response

@app.route('/create_payment_intent', methods=['POST'])
def create_payment_intent():
    """Create Stripe payment intent for premium features"""
    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=999,  # $9.99 in cents
            currency='usd',
            metadata={'feature': 'pdf_export'}
        )
        
        return jsonify({
            'client_secret': intent.client_secret
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/confirm_payment', methods=['POST'])
def confirm_payment():
    """Confirm payment and enable PDF export"""
    try:
        payment_intent_id = request.json.get('payment_intent_id')
        
        # Retrieve the payment intent to verify it was successful
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == 'succeeded':
            return jsonify({'success': True, 'message': 'Payment successful! You can now download PDFs.'})
        else:
            return jsonify({'success': False, 'message': 'Payment not completed.'})
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)