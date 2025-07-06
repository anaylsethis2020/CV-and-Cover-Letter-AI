#!/usr/bin/env python3
"""
Test script for CV and Cover Letter AI API endpoints
"""

import requests
import json
import sys

def test_health_endpoint():
    """Test the health check endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get('http://localhost:5000/api/health')
        data = response.json()
        
        assert response.status_code == 200
        assert data['status'] == 'healthy'
        assert 'api_key_configured' in data
        
        print("✓ Health endpoint working correctly")
        print(f"  API Key Configured: {data['api_key_configured']}")
        return True
    except Exception as e:
        print(f"✗ Health endpoint failed: {e}")
        return False

def test_generate_endpoint_without_api_key():
    """Test the generate endpoint without API key (should fail gracefully)"""
    print("\nTesting generate endpoint without API key...")
    try:
        payload = {
            "prompt": "Create a professional summary for a software engineer",
            "content_type": "cv"
        }
        
        response = requests.post(
            'http://localhost:5000/api/generate',
            headers={'Content-Type': 'application/json'},
            json=payload
        )
        
        data = response.json()
        
        # Should return an error due to missing API key
        assert response.status_code == 500
        assert data['status'] == 'error'
        assert 'API key not configured' in data['error']
        
        print("✓ Generate endpoint correctly handles missing API key")
        return True
    except Exception as e:
        print(f"✗ Generate endpoint test failed: {e}")
        return False

def test_generate_endpoint_invalid_input():
    """Test the generate endpoint with invalid input"""
    print("\nTesting generate endpoint with invalid input...")
    try:
        # Test with empty prompt
        payload = {
            "prompt": "",
            "content_type": "cv"
        }
        
        response = requests.post(
            'http://localhost:5000/api/generate',
            headers={'Content-Type': 'application/json'},
            json=payload
        )
        
        data = response.json()
        
        assert response.status_code == 400
        assert data['status'] == 'error'
        assert 'Prompt is required' in data['error']
        
        print("✓ Generate endpoint correctly validates empty prompts")
        
        # Test with invalid content type
        payload = {
            "prompt": "Test prompt",
            "content_type": "invalid_type"
        }
        
        response = requests.post(
            'http://localhost:5000/api/generate',
            headers={'Content-Type': 'application/json'},
            json=payload
        )
        
        data = response.json()
        
        assert response.status_code == 400
        assert data['status'] == 'error'
        assert 'Invalid content_type' in data['error']
        
        print("✓ Generate endpoint correctly validates content types")
        return True
    except Exception as e:
        print(f"✗ Invalid input test failed: {e}")
        return False

def test_generate_endpoint_no_json():
    """Test the generate endpoint without JSON data"""
    print("\nTesting generate endpoint without JSON data...")
    try:
        response = requests.post('http://localhost:5000/api/generate')
        data = response.json()
        
        assert response.status_code == 500
        assert data['status'] == 'error'
        # The error could be about Content-Type or JSON data
        assert ('No JSON data provided' in data['error'] or 
                'Content-Type' in data['error'] or 
                'JSON' in data['error'])
        
        print("✓ Generate endpoint correctly handles missing JSON data")
        return True
    except Exception as e:
        print(f"✗ No JSON test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("CV and Cover Letter AI - API Test Suite")
    print("=" * 50)
    
    # Start the Flask app in the background for testing
    import subprocess
    import time
    import os
    
    # Change to the app directory
    app_dir = '/home/runner/work/CV-and-Cover-Letter-AI/CV-and-Cover-Letter-AI'
    
    print(f"Starting Flask app from {app_dir}...")
    
    # Start Flask app
    flask_process = subprocess.Popen(
        ['python3', 'app.py'],
        cwd=app_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for the app to start
    time.sleep(3)
    
    try:
        # Run tests
        tests = [
            test_health_endpoint,
            test_generate_endpoint_without_api_key,
            test_generate_endpoint_invalid_input,
            test_generate_endpoint_no_json
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            if test():
                passed += 1
            else:
                failed += 1
        
        print(f"\n" + "=" * 50)
        print(f"Test Results: {passed} passed, {failed} failed")
        
        if failed == 0:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1
            
    finally:
        # Clean up: terminate Flask process
        flask_process.terminate()
        flask_process.wait()
        print("\nFlask app stopped.")

if __name__ == '__main__':
    sys.exit(main())