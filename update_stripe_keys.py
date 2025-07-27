#!/usr/bin/env python3
"""
Stripe Configuration Helper Script
This script helps you update your Stripe API keys and price IDs.
"""

import os
import re

def update_env_file():
    """Update .env file with Stripe keys"""
    print("🔧 UPDATING STRIPE CONFIGURATION")
    print("=" * 50)
    
    # Get user input
    print("\n📝 Please enter your Stripe API keys:")
    publishable_key = input("Publishable Key (pk_test_...): ").strip()
    secret_key = input("Secret Key (sk_test_...): ").strip()
    
    if not publishable_key or not secret_key:
        print("❌ Keys cannot be empty!")
        return False
    
    # Read current .env file
    env_path = '.env'
    if not os.path.exists(env_path):
        print(f"❌ {env_path} file not found!")
        return False
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    # Update Stripe keys
    content = re.sub(
        r'STRIPE_PUBLISHABLE_KEY=.*',
        f'STRIPE_PUBLISHABLE_KEY={publishable_key}',
        content
    )
    content = re.sub(
        r'STRIPE_SECRET_KEY=.*',
        f'STRIPE_SECRET_KEY={secret_key}',
        content
    )
    
    # Write updated content
    with open(env_path, 'w') as f:
        f.write(content)
    
    print("✅ Stripe keys updated in .env file!")
    return True

def update_price_ids():
    """Update price IDs in payments/views.py"""
    print("\n💰 UPDATING STRIPE PRICE IDs")
    print("=" * 50)
    
    # Get user input
    print("\n📝 Please enter your Stripe Price IDs:")
    premium_price_id = input("Premium Price ID (price_...): ").strip()
    enterprise_price_id = input("Enterprise Price ID (price_...): ").strip()
    
    if not premium_price_id or not enterprise_price_id:
        print("❌ Price IDs cannot be empty!")
        return False
    
    # Read current views.py file
    views_path = 'payments/views.py'
    if not os.path.exists(views_path):
        print(f"❌ {views_path} file not found!")
        return False
    
    with open(views_path, 'r') as f:
        content = f.read()
    
    # Update price IDs
    content = re.sub(
        r"'stripe_price_id': 'price_1QSjp7P1Y8V5LMJ1VYRJLXVr'.*",
        f"'stripe_price_id': '{premium_price_id}',  # Premium",
        content
    )
    content = re.sub(
        r"'stripe_price_id': 'price_1QSjp7P1Y8V5LMJ1VYRJLXVs'.*",
        f"'stripe_price_id': '{enterprise_price_id}',  # Enterprise",
        content
    )
    
    # Write updated content
    with open(views_path, 'w') as f:
        f.write(content)
    
    print("✅ Price IDs updated in payments/views.py!")
    return True

def test_stripe_connection():
    """Test Stripe connection"""
    print("\n🧪 TESTING STRIPE CONNECTION")
    print("=" * 50)
    
    try:
        import stripe
        from django.conf import settings
        
        # Set API key
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        # Test connection
        products = stripe.Product.list(limit=1)
        print("✅ Stripe connection successful!")
        print(f"✅ Found {len(products.data)} products in your account")
        return True
        
    except Exception as e:
        print(f"❌ Stripe connection failed: {e}")
        return False

def main():
    """Main function"""
    print("🚀 STRIPE CONFIGURATION HELPER")
    print("=" * 50)
    
    # Update .env file
    if not update_env_file():
        return
    
    # Update price IDs
    if not update_price_ids():
        return
    
    print("\n✅ Configuration updated!")
    print("\n📋 NEXT STEPS:")
    print("1. Restart your Django server: python manage.py runserver")
    print("2. Test payments at: http://127.0.0.1:8000/payments/subscription-plans/")
    print("3. Use test card: 4242424242424242")
    
    # Test connection
    print("\n🧪 Testing connection...")
    test_stripe_connection()

if __name__ == "__main__":
    main() 