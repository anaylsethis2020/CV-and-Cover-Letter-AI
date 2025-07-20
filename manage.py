#!/usr/bin/env python
"""
manage.py: Django's command-line utility for administrative tasks.

This file is the entry point for running Django management commands, such as:
  - python manage.py runserver (start development server)
  - python manage.py migrate (apply database migrations)
  - python manage.py createsuperuser (create admin user)
  - python manage.py collectstatic (collect static files for deployment)

It sets up the environment and delegates commands to Django's management system.
"""
import os
import sys

def main():
    """
    Main function to run administrative tasks for Django.
    - Sets the default settings module to 'config.settings'.
    - Imports and runs Django's command-line management system.
    - Handles ImportError if Django is not installed or environment is not set up.
    """
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        # Import Django's command-line execution utility
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Raise a helpful error if Django is not installed or environment is not activated
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Run the command-line arguments (e.g., runserver, migrate)
    execute_from_command_line(sys.argv)

# Entry point: only runs if this file is executed directly
if __name__ == '__main__':
    main()
