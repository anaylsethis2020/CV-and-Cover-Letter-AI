# CV and Cover Letter AI

A professional web application for generating CVs and cover letters with AI assistance, featuring PDF export and Stripe payment integration.

## Features

- **Interactive Forms**: User-friendly forms for CV and cover letter creation
- **Live Preview**: Real-time preview of documents before export
- **Professional PDF Export**: High-quality PDF generation using WeasyPrint
- **Payment Integration**: Stripe-powered payment system for premium features
- **Responsive Design**: Works on desktop and mobile devices
- **Professional Templates**: Clean, modern document layouts

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anaylsethis2020/CV-and-Cover-Letter-AI.git
cd CV-and-Cover-Letter-AI
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Copy `.env` file and update with your Stripe keys
   - Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/)
   - For testing, use test keys (they start with `pk_test_` and `sk_test_`)

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Create CV/Cover Letter**: Fill out the forms with your information
2. **Preview**: Use the preview function to see how your document looks
3. **Export to PDF**: Click "Download PDF" and complete payment to export
4. **Payment**: Uses Stripe test mode - use test card `4242424242424242`

## Tech Stack

- **Backend**: Python Flask
- **PDF Generation**: WeasyPrint
- **Payment**: Stripe API
- **Frontend**: HTML5, CSS3, JavaScript
- **Templates**: Jinja2

## Development

The application is structured as follows:
- `app.py` - Main Flask application
- `templates/` - HTML templates
- `static/` - CSS and JavaScript files
- `config.py` - Configuration settings

## Payment Testing

Use these test card numbers in Stripe test mode:
- Success: `4242424242424242`
- Decline: `4000000000000002`
- Insufficient funds: `4000000000009995`

## License

MIT License - see LICENSE file for details.