"""
Script to view all user data stored in Supabase database
"""

from backend.config import supabase
import json
from datetime import datetime

print("=" * 80)
print("VIEWING BACKEND DATABASE - School Uniform Business")
print("=" * 80)

try:
    # Fetch all users from database
    response = supabase.table("users").select("*").execute()
    
    users_data = response.data
    
    print(f"\n✅ Connected to Supabase Database successfully!")
    print(f"📊 Total Users in Database: {len(users_data)}\n")
    
    if len(users_data) == 0:
        print("❌ No users found in database yet.")
        print("👤 Start by signing up on the website to add users.")
    else:
        print("=" * 80)
        print("USER DATA IN DATABASE")
        print("=" * 80)
        
        for idx, user in enumerate(users_data, 1):
            print(f"\n👤 User #{idx}")
            print("-" * 80)
            print(f"   ID:          {user.get('id', 'N/A')}")
            print(f"   Name:        {user.get('name', 'N/A')}")
            print(f"   Email:       {user.get('email', 'N/A')}")
            print(f"   Role:        {user.get('role', 'N/A')}")
            print(f"   Password:    {user.get('password', 'N/A')[:30]}... (hashed)")
            print(f"   Created At:  {user.get('created_at', 'N/A')}")
        
        print("\n" + "=" * 80)
        print("DETAILED VIEW (JSON Format)")
        print("=" * 80)
        print(json.dumps(users_data, indent=2, default=str))
        
        print("\n" + "=" * 80)
        print("DATABASE STATISTICS")
        print("=" * 80)
        roles = {}
        for user in users_data:
            role = user.get('role', 'unknown')
            roles[role] = roles.get(role, 0) + 1
        
        print(f"\n📈 Users by Role:")
        for role, count in roles.items():
            print(f"   - {role}: {count} user(s)")
        
        print(f"\n📊 Total Users: {len(users_data)}")
        print(f"📅 Database: Supabase (PostgreSQL)")
        print(f"🔐 Passwords: Hashed with bcrypt")

except Exception as e:
    print(f"\n❌ Error connecting to database:")
    print(f"   {str(e)}")
    print(f"\n💡 Make sure:")
    print(f"   1. Supabase credentials are correct in backend/config.py")
    print(f"   2. Internet connection is available")
    print(f"   3. Supabase table 'users' exists")

print("\n" + "=" * 80)
print("HOW TO VIEW DATA IN DIFFERENT WAYS")
print("=" * 80)
print("""
✅ Option 1: Run this script (Current)
   Command: python view_database.py

✅ Option 2: Supabase Web Console
   1. Go to: https://app.supabase.com/
   2. Login with your credentials
   3. Select project: "luvvqlmrswllwsrfwdeg"
   4. Go to: Table Editor → users
   5. View all user records

✅ Option 3: View in Frontend (After Login)
   1. Open index.html in browser
   2. Click "Sign Up" and create account
   3. Login with your credentials
   4. View your profile data

✅ Option 4: API Test Script
   Command: python test_backend_api.py
   
   Shows all API transactions with responses
""")

print("\n" + "=" * 80)
print("EXAMPLE OUTPUT WHEN DATA EXISTS")
print("=" * 80)
print("""
{
  "id": "854ce245-518f-49a1-af67-a48d4de63b15",
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "$2b$12$N9qo8uLOickgX2ZMRZoMye...",  ← hashed with bcrypt
  "role": "clothes_admin",
  "created_at": "2026-02-05T10:30:45.123456+00:00"
}
""")

print("\n" + "=" * 80)
