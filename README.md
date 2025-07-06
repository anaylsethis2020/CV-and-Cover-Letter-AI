# CV-and-Cover-Letter-AI

A Django web application for creating CVs and cover letters with AI assistance.

## Features

- **User Authentication**: Secure user registration and login system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Protected Dashboard**: User-specific dashboard with account information
- **Modern UI**: Clean, professional interface with gradient design

## Authentication Features

- User registration with email, username, first name, and last name
- Secure login/logout functionality
- Password validation and security
- Protected views that require authentication
- Responsive forms with Bootstrap styling

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CV-and-Cover-Letter-AI
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run the development server**
   ```bash
   python manage.py runserver
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:8000`
   - You'll be redirected to the login page
   - Click "Sign up here" to create a new account

## Testing

Run the test suite to verify functionality:

```bash
python manage.py test authentication
```

## Project Structure

```
CV-and-Cover-Letter-AI/
├── authentication/          # Authentication app
│   ├── templates/           # Authentication templates
│   ├── views.py            # Authentication views
│   ├── urls.py             # Authentication URLs
│   └── tests.py            # Authentication tests
├── cv_app/                 # Main Django project
│   ├── settings.py         # Django settings
│   └── urls.py             # Main URL configuration
├── templates/              # Global templates
│   └── base.html           # Base template
├── static/                 # Static files
│   └── css/
│       └── auth.css        # Authentication styles
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## Authentication URLs

- `/` - Redirects to login page
- `/auth/login/` - User login
- `/auth/signup/` - User registration
- `/auth/logout/` - User logout
- `/auth/dashboard/` - Protected user dashboard

## Technologies Used

- **Django 5.2.4** - Web framework
- **Bootstrap 5.1.3** - CSS framework
- **Font Awesome 6.0** - Icons
- **SQLite** - Database (development)

## Screenshots

The application features a modern, responsive design that works on both desktop and mobile devices.

## Future Enhancements

- CV creation functionality
- Cover letter generation
- AI-powered content suggestions
- PDF export capabilities
- Template customization