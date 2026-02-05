import requests
import json

# Backend API URL
API_URL = "http://localhost:5000"

print("=" * 70)
print("TESTING SCHOOL UNIFORM BUSINESS BACKEND API")
print("=" * 70)
print(f"\n✓ Backend Running at: {API_URL}\n")

# Test Data
test_email = "testuser@example.com"
test_password = "password123"
test_name = "Test User"
test_role = "clothes_admin"

print("\n" + "=" * 70)
print("TEST 1: USER REGISTRATION (SIGNUP)")
print("=" * 70)

signup_data = {
    "name": test_name,
    "email": test_email,
    "password": test_password,
    "role": test_role
}

print(f"\nRequest: POST {API_URL}/register")
print(f"Data: {json.dumps(signup_data, indent=2)}")

try:
    response = requests.post(f"{API_URL}/register", json=signup_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("\n✅ SIGNUP SUCCESS - User registered in database")
    else:
        print(f"\n⚠️ SIGNUP ERROR - {response.json().get('msg', 'Unknown error')}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("Make sure backend is running: python app.py")

# Test 2: Duplicate Registration
print("\n" + "=" * 70)
print("TEST 2: DUPLICATE REGISTRATION (Try signup again)")
print("=" * 70)

print(f"\nRequest: POST {API_URL}/register")
print(f"Data: {json.dumps(signup_data, indent=2)}")

try:
    response = requests.post(f"{API_URL}/register", json=signup_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 400:
        print("\n✅ DUPLICATE CHECK WORKS - Shows error message")
        print(f"   Error: {response.json().get('msg')}")
    else:
        print("\n⚠️ Unexpected response")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

# Test 3: Login with correct credentials
print("\n" + "=" * 70)
print("TEST 3: USER LOGIN (Correct credentials)")
print("=" * 70)

login_data = {
    "email": test_email,
    "password": test_password
}

print(f"\nRequest: POST {API_URL}/login")
print(f"Data: {json.dumps(login_data, indent=2)}")

try:
    response = requests.post(f"{API_URL}/login", json=login_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESS - JWT token generated")
        token = response.json().get('token')
        role = response.json().get('role')
        print(f"   Token: {token[:50]}...")
        print(f"   Role: {role}")
    else:
        print(f"\n⚠️ LOGIN ERROR - {response.json().get('msg')}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

# Test 4: Login with wrong password
print("\n" + "=" * 70)
print("TEST 4: USER LOGIN (Wrong password)")
print("=" * 70)

wrong_password_data = {
    "email": test_email,
    "password": "wrongpassword"
}

print(f"\nRequest: POST {API_URL}/login")
print(f"Data: {json.dumps(wrong_password_data, indent=2)}")

try:
    response = requests.post(f"{API_URL}/login", json=wrong_password_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 401:
        print(f"\n✅ WRONG PASSWORD CHECK WORKS - Error message shown")
        print(f"   Error: {response.json().get('msg')}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

# Test 5: Login without signup
print("\n" + "=" * 70)
print("TEST 5: USER LOGIN (User doesn't exist)")
print("=" * 70)

nonexistent_data = {
    "email": "nonexistent@example.com",
    "password": "anypassword"
}

print(f"\nRequest: POST {API_URL}/login")
print(f"Data: {json.dumps(nonexistent_data, indent=2)}")

try:
    response = requests.post(f"{API_URL}/login", json=nonexistent_data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 401:
        print(f"\n✅ USER NOT FOUND CHECK WORKS")
        print(f"   Error: {response.json().get('msg')}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

print("\n" + "=" * 70)
print("BACKEND API SUMMARY")
print("=" * 70)
print("""
✅ Available Endpoints:

1. POST /register
   - Creates new user account
   - Checks for duplicate emails
   - Hashes password with bcrypt
   - Stores in Supabase database

2. POST /login
   - Validates user credentials
   - Generates JWT token
   - Returns user role
   - Checks if user exists
   - Validates password

3. GET /clothes/dashboard (Protected)
   - Requires valid JWT token
   - Restricted to clothes_admin role

📊 Database: Supabase
   Table: users
   Fields: id, name, email, password (hashed), role, created_at

🔐 Security:
   ✓ Password hashing with bcrypt
   ✓ JWT token authentication
   ✓ CORS enabled for frontend
   ✓ Role-based access control

🧪 Test Data Used:
   - Email: testuser@example.com
   - Password: password123
   - Name: Test User
   - Role: clothes_admin
""")
print("=" * 70)
