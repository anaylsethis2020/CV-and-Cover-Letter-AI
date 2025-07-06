from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse


class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_login_page_loads(self):
        """Test that the login page loads correctly"""
        response = self.client.get(reverse('authentication:login'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Welcome Back')
        self.assertContains(response, 'Sign in to your account')

    def test_signup_page_loads(self):
        """Test that the signup page loads correctly"""
        response = self.client.get(reverse('authentication:signup'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Create Account')
        self.assertContains(response, 'Join us to create your perfect CV')

    def test_user_login(self):
        """Test user can log in with valid credentials"""
        response = self.client.post(reverse('authentication:login'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 302)  # Redirect after successful login
        self.assertRedirects(response, reverse('authentication:dashboard'))

    def test_user_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        response = self.client.post(reverse('authentication:login'), {
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 200)  # Stay on login page
        self.assertContains(response, 'Please enter a correct username and password')

    def test_dashboard_requires_login(self):
        """Test that dashboard redirects to login when not authenticated"""
        response = self.client.get(reverse('authentication:dashboard'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, '/auth/login/?next=/auth/dashboard/')

    def test_dashboard_loads_for_authenticated_user(self):
        """Test that authenticated users can access the dashboard"""
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(reverse('authentication:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Welcome, Test!')
        self.assertContains(response, 'Ready to create your perfect CV')

    def test_user_signup(self):
        """Test user can sign up with valid data"""
        response = self.client.post(reverse('authentication:signup'), {
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'email': 'newuser@example.com',
            'password1': 'complexpass123',
            'password2': 'complexpass123'
        })
        self.assertEqual(response.status_code, 302)  # Redirect after successful signup
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_logout_functionality(self):
        """Test user can logout"""
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(reverse('authentication:logout'))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('authentication:login'))
        
        # Verify user is logged out by trying to access dashboard
        response = self.client.get(reverse('authentication:dashboard'))
        self.assertEqual(response.status_code, 302)  # Should redirect to login
