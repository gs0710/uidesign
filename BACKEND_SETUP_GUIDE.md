# Backend & Frontend Integration Guide

## Overview
This guide explains how to set up and run your school uniform business application with backend integration.

---

## Backend Setup

### Step 1: Install Dependencies
Navigate to the backend folder and install required packages:

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run the Backend Server
Start the Flask backend (it will run on `http://localhost:5000`):

```bash
python app.py
```

You should see:
```
 * Running on http://localhost:5000
 * Debug mode: on
```

---

## Frontend Setup

### Step 1: Open Frontend in Browser
Simply open any HTML file in a web browser (e.g., `index.html`). 

The frontend will automatically connect to the backend at `http://localhost:5000` (configured in `js/script.js`).

---

## How Authentication Works

### Sign Up Flow
1. User clicks "Sign Up" button 
2. User enters: Name, Email, Password, and Role (Admin or Cloths)
3. Frontend sends POST request to `http://localhost:5000/register`
4. Backend checks if email already exists:
   - **If exists**: Shows error "You already signed up - now sign in"
   - **If new**: Creates account and shows success message
5. After successful signup, user is redirected to login page

### Sign In Flow
1. User clicks "Sign In" button
2. User enters: Email and Password
3. Frontend sends POST request to `http://localhost:5000/login`
4. Backend validates credentials:
   - **If user not found**: Shows error "First sign up - user not found"
   - **If password wrong**: Shows error "Invalid password"
   - **If correct**: Returns JWT token - user is logged in
5. After login, user can access protected pages (billing, inventory, students, schools, profile)

---

## Testing the Application

### Test Case 1: New User Signup
1. Go to `login.html` or click "Sign Up" on any page
2. Click "Sign Up" in the modal
3. Enter:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
   - **Role**: Cloths Admin
4. Click "Register"
5. **Expected**: Success message, redirected to login page

### Test Case 2: Duplicate Signup (Error Case)
1. Try to signup with same email again (john@example.com)
2. **Expected Error**: "You already signed up - now sign in"
3. Click "Sign In" link in the error message

### Test Case 3: Login Without Signup (Error Case)
1. Open `login.html`
2. Click "Sign In"
3. Enter email: fake@example.com
4. Enter password: anything
5. **Expected Error**: "First sign up - user not found"

### Test Case 4: Successful Login
1. Enter the email you signed up with (john@example.com)
2. Enter the correct password (password123)
3. **Expected**: 
   - User logs in successfully
   - See username in navbar
   - Can access protected pages (billing, inventory, etc.)

### Test Case 5: Logout
1. After logging in, click your username in the navbar
2. Click "Logout" button
3. **Expected**: Logged out, redirected to home page

### Test Case 6: Protected Pages
1. Without logging in, try to access `billing.html` or `inventory.html`
2. **Expected**: Dashboard shows login message and opens signup modal
3. Cannot access the page until logged in

---

## Database Setup (Supabase)

The backend is connected to a **Supabase** database with a `users` table.

**Table Schema** (`users` table):
```
id          : UUID (primary key, auto)
name        : Text
email       : Text (unique)
password    : Text (hashed with bcrypt)
role        : Text (super_admin or clothes_admin)
created_at  : Timestamp (auto)
```

Your backend already has Supabase credentials configured in `backend/config.py`.

---

## Troubleshooting

### Error: "Connection error - make sure backend is running on http://localhost:5000"
- **Solution**: Start the Flask backend with `python app.py` in the backend folder
- Make sure port 5000 is available (not used by another application)

### Error: "CORS error" or "request blocked"
- **Solution**: Make sure you have `flask-cors` installed
  ```bash
  pip install flask-cors
  ```
- The backend has CORS enabled for all origins

### Users can't see their name after login
- **Solution**: Check browser console (F12) for errors
- Make sure JWT token is being stored properly in localStorage
- Refresh the page if needed

### Can't access protected pages
- **Solution**: Must be logged in first
- Check if you have a valid JWT token in localStorage
- Try logging out and logging back in

### Backend doesn't start
- **Solution**:
  1. Make sure Python is installed
  2. Install dependencies: `pip install -r requirements.txt`
  3. Check if port 5000 is available
  4. Look for error messages in console

---

## API Endpoints

### 1. Register (Signup)
```
POST /register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "clothes_admin"  // or "super_admin"
}

Response (201):
{
  "msg": "User registered successfully"
}

Error Response (400):
{
  "msg": "Email already exists - you already signed up now sign in"
}
```

### 2. Login
```
POST /login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "role": "clothes_admin"
}

Error Response (401):
{
  "msg": "User not found - first sign up"
}

or

{
  "msg": "Invalid password"
}
```

---

## File Structure Reference

```
project-root/
├── backend/
│   ├── app.py              # Flask app with CORS
│   ├── auth.py             # Login/Register endpoints (UPDATED)
│   ├── config.py           # Supabase config
│   ├── roles.py            # Role decorator
│   └── requirements.txt     # Dependencies (UPDATED)
├── js/
│   └── script.js           # Frontend auth logic (UPDATED)
├── signup.html             # Signup page (UPDATED)
├── login.html              # Login modal
├── dashboard.html          # Protected page
├── inventory.html          # Protected page
├── billing.html            # Protected page
└── [other pages...]
```

---

## Next Steps

1. **Test the complete flow** using test cases above
2. **Customize error messages** in `js/script.js` and `backend/auth.py` as needed
3. **Add more protected pages** by checking for `authToken` in localStorage
4. **Implement Google OAuth** (currently mocked in signup.html and script.js)
5. **Add password recovery** functionality
6. **Implement user dashboard** with profile editing

---

## Key Features Implemented

✅ User signup with validation
✅ Check for duplicate emails (prevent re-signup)
✅ User login with JWT token
✅ Specific error messages:
   - "First sign up - user not found" when logging in without signup
   - "You already signed up - now sign in" when trying to signup with existing email
✅ Protected pages (require login)
✅ Logout functionality
✅ Role-based access (clothes_admin, super_admin)
✅ Password hashing with bcrypt
✅ CORS enabled for frontend-backend communication

---

## Security Notes

⚠️ **Important**: This setup uses HTTP for development. For production:
- Use HTTPS
- Store JWT secret in environment variables
- Use secure cookie flags
- Implement rate limiting
- Add input validation
- Use environment variables for sensitive data (Supabase keys)

