
"""
Django settings for config project.

This file configures all major aspects of your Django project, including:
  - Security and environment variables
  - Installed apps and middleware
  - Database and static file settings
  - Template directories and context processors
  - Third-party integrations (Stripe, OpenAI)

It is essential for both local development and production deployment (e.g., Heroku).
"""


from pathlib import Path
# BASE_DIR is the root directory of your Django project
BASE_DIR = Path(__file__).resolve().parent.parent



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/
# SECURITY WARNING: keep the secret key used in production secret!



import os
from dotenv import load_dotenv
import dj_database_url

# Load environment variables from .env for secrets and API keys
load_dotenv()  # This loads variables from .env

# Stripe and OpenAI keys for payment and AI integration
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Django secret key for cryptographic signing
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-m8r47tykn#8bw8+*r^crg!3cl@+t5z%*cruvd*q3@@f$n!nf&_')
# Debug mode (should be False in production)
DEBUG = os.getenv('DEBUG', 'True') == 'True'
# Allowed hosts for deployment
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')


# Application definition


# List of Django and third-party apps used in the project
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core'  # Your main app for CV & Cover Letter AI Builder
]


# Middleware handles requests, security, sessions, and more
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# Main URL configuration for the project
ROOT_URLCONF = 'config.urls'


# Template settings: where Django looks for HTML templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'core' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# WSGI application for deployment (Heroku, Gunicorn)
WSGI_APPLICATION = 'config.wsgi.application'



# Database configuration: uses SQLite locally, can be switched to PostgreSQL for Heroku
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}



# Password validation for user accounts
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



# Internationalization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True



# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type for models
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
