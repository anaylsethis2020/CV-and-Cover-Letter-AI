# CV AI Builder

A comprehensive Django full-stack application for creating professional CVs and generating AI-powered cover letters. Built with modern web technologies and integrated with OpenAI and Stripe for advanced functionality.

## 🚀 Features

### Core Features
- **User Authentication & Profile Management**: Secure registration, login, and profile customization
- **Professional CV Builder**: Intuitive interface for creating comprehensive CVs
- **AI-Powered Cover Letter Generator**: OpenAI integration for personalized cover letters
- **PDF Export**: Professional PDF generation for CVs and cover letters
- **Stripe Payment Integration**: Secure subscription management
- **Responsive Bootstrap UI**: Modern, mobile-friendly design

### Advanced Features
- **Multiple CV Templates**: Professional templates for different industries
- **Real-time Preview**: Live preview of CV changes
- **Auto-save Functionality**: Automatic form data saving
- **Experience & Education Management**: Easy addition of work experience and education
- **Project Portfolio**: Showcase your projects and achievements
- **Subscription Tiers**: Free, Premium, and Enterprise plans

## 🛠️ Technology Stack

### Backend
- **Django 4.2.7**: Python web framework
- **PostgreSQL**: Primary database
- **Django REST Framework**: API development
- **OpenAI API**: AI-powered cover letter generation
- **Stripe API**: Payment processing
- **ReportLab**: PDF generation

### Frontend
- **Bootstrap 5**: Responsive UI framework
- **Font Awesome**: Icon library
- **Vanilla JavaScript**: Interactive functionality
- **HTML5/CSS3**: Modern markup and styling

### Development Tools
- **Python 3.8+**: Programming language
- **pip**: Package management
- **Git**: Version control

## 📋 Prerequisites

Before running this application, ensure you have:

- Python 3.8 or higher
- PostgreSQL database
- OpenAI API key
- Stripe account and API keys
- Git (for version control)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cv-ai-builder-final
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=cv_builder_db
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=your-openai-api-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 5. Database Setup
```bash
# Create PostgreSQL database
createdb cv_builder_db

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 6. Collect Static Files
```bash
python manage.py collectstatic
```

### 7. Run the Development Server
```bash
python manage.py runserver
```

Visit `http://localhost:8000` to access the application.

## 📁 Project Structure

```
cv-ai-builder-final/
├── cv_builder/                 # Main Django project
│   ├── settings.py            # Django settings
│   ├── urls.py               # Main URL configuration
│   └── wsgi.py               # WSGI configuration
├── users/                     # User authentication app
│   ├── models.py             # User profile models
│   ├── views.py              # Authentication views
│   ├── forms.py              # User forms
│   └── urls.py               # User URLs
├── cv_generator/             # CV building app
│   ├── models.py             # CV and cover letter models
│   ├── views.py              # CV building views
│   ├── services.py           # OpenAI and PDF services
│   ├── forms.py              # CV forms
│   └── urls.py               # CV URLs
├── payments/                  # Payment processing app
│   ├── models.py             # Subscription models
│   ├── views.py              # Stripe integration
│   └── urls.py               # Payment URLs
├── templates/                 # HTML templates
│   ├── base.html             # Base template
│   ├── cv_generator/         # CV templates
│   ├── users/                # User templates
│   └── payments/             # Payment templates
├── static/                    # Static files
│   ├── css/                  # Custom CSS
│   └── js/                   # JavaScript files
├── media/                     # User uploads
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management
└── README.md                 # Project documentation
```

## 🔧 Configuration

### OpenAI Setup
1. Create an account at [OpenAI](https://openai.com)
2. Generate an API key
3. Add the key to your `.env` file

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Set up webhook endpoints for subscription management
4. Add keys to your `.env` file

### Database Configuration
The application uses PostgreSQL by default. Update the database settings in `settings.py` if using a different database.

## 🎯 Usage

### For Users
1. **Registration**: Create an account with email and password
2. **Profile Setup**: Complete your profile with contact information
3. **CV Building**: Use the intuitive builder to create your CV
4. **Cover Letters**: Generate AI-powered cover letters for specific jobs
5. **Export**: Download professional PDFs for applications

### For Developers
1. **Development**: Use `python manage.py runserver` for local development
2. **Testing**: Run `python manage.py test` for unit tests
3. **Admin**: Access Django admin at `/admin/` for data management
4. **API**: REST API endpoints available for integration

## 🔒 Security Features

- **CSRF Protection**: Built-in Django CSRF protection
- **Password Validation**: Strong password requirements
- **SQL Injection Protection**: Django ORM protection
- **XSS Protection**: Template auto-escaping
- **Secure File Uploads**: Validated file uploads
- **HTTPS Enforcement**: Production security headers

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in settings
- [ ] Configure production database
- [ ] Set up static file serving (nginx/Apache)
- [ ] Configure HTTPS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Heroku Deployment
```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create heroku-postgresql
heroku config:set SECRET_KEY=your-secret-key
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set STRIPE_SECRET_KEY=your-stripe-key
git push heroku main
heroku run python manage.py migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Django community for the excellent framework
- OpenAI for AI capabilities
- Stripe for payment processing
- Bootstrap team for the UI framework
- All contributors and users

## 📊 Project Status

- ✅ User Authentication
- ✅ CV Builder
- ✅ Cover Letter Generator
- ✅ PDF Export
- ✅ Stripe Integration
- ✅ Responsive Design
- 🔄 Advanced Templates
- 🔄 Analytics Dashboard
- 🔄 Team Collaboration

---

**Built with ❤️ for job seekers and career professionals** 