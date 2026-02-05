# Frontend & Backend Deployment Guide

## 📌 Important: Frontend and Backend Deploy Separately

**Vercel** is designed for **Frontend only** (HTML, CSS, JS).  
Your **Backend (Python/Flask)** needs a **different hosting service**.

---

## 🏗️ Architecture Overview

```
Your Application:
├── Frontend (HTML/CSS/JS)
│   └── Hosted on: Vercel / Netlify / GitHub Pages
│       URL: https://yoursite.vercel.app
│
└── Backend (Python Flask)
    └── Hosted on: Railway / Render / Heroku / PythonAnywhere
        URL: https://yourapi.railway.app
```

---

## 🚀 Step 1: Deploy Backend (Python/Flask)

### Option A: **Railway.app** (Recommended - Free tier available)

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Create new project** → Select "Deploy from GitHub"
4. **Connect your GitHub repo** (or upload files)
5. **Railway automatically detects** `requirements.txt` and `app.py`
6. **Set environment variables:**
   - `FLASK_ENV=production`
7. **Get your backend URL:** `https://yourapp-prod.railway.app`

**Then update your frontend to use this URL**

---

### Option B: **Render.com** (Free tier available)

1. **Go to:** https://render.com
2. **Create new Web Service**
3. **Connect GitHub repo**
4. **Configuration:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
5. **Get your backend URL:** `https://yourapp.onrender.com`

---

### Option C: **PythonAnywhere.com** (Easiest for Python)

1. **Go to:** https://www.pythonanywhere.com
2. **Sign up** (free tier available)
3. **Upload files** via web interface
4. **Configure Flask app**
5. **Get your backend URL:** `https://yourusername.pythonanywhere.com`

---

## 🎨 Step 2: Deploy Frontend (HTML/CSS/JS)

### Option A: **Vercel** (Recommended)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Import your project** from GitHub
4. **Deploy** - Vercel automatically detects it's static HTML
5. **Get your frontend URL:** `https://yourproject.vercel.app`

---

### Option B: **Netlify**

1. **Go to:** https://netlify.com
2. **Drag & drop your folder** or connect GitHub
3. **Deploy** 
4. **Get your frontend URL:** `https://yourproject.netlify.app`

---

## 🔗 Step 3: Connect Frontend to Production Backend

After deploying backend, update the API URL in your frontend:

### Edit: `js/script.js`

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:5000';

// To this (your deployed backend URL):
const API_BASE_URL = 'https://yourapp.railway.app';  // or .onrender.com or .pythonanywhere.com
```

### Edit: `signup.html`

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:5000';

// To this:
const API_BASE_URL = 'https://yourapp.railway.app';
```

Then **redeploy frontend** with the updated URL.

---

## 📊 View Backend Data in Production

After deploying to production, you can view data 3 ways:

### **Method 1: Backend Dashboard (Easiest)**

Go to: `https://yourapp.railway.app/`

✅ Shows:
- Backend status
- Total users count
- Available endpoints
- All API information

---

### **Method 2: View All Users**

Go to: `https://yourapp.railway.app/api/users`

✅ Shows:
- All registered users in table
- Email addresses
- User roles
- Hashed passwords
- Account creation dates

---

### **Method 3: API Status (JSON)**

Go to: `https://yourapp.railway.app/api/status`

✅ Shows:
```json
{
  "status": "running",
  "backend": "Flask",
  "database": "Supabase",
  "users_count": 9,
  "endpoints": {
    "register": "POST /register",
    "login": "POST /login",
    "get_users": "GET /api/users",
    "status": "GET /api/status",
    "dashboard": "GET /"
  }
}
```

---

## 📝 Production Checklist

Before deploying to production:

```
Backend (Flask):
☐ Update requirements.txt (done)
☐ Add environment variables (FLASK_ENV=production)
☐ Disable debug mode: app.run(debug=False)
☐ Test all API endpoints
☐ Verify Supabase connection
☐ Check CORS settings
☐ Add error logging

Frontend (HTML/CSS/JS):
☐ Update API_BASE_URL to production backend
☐ Test signup/login with production backend
☐ Verify all forms submit correctly
☐ Check console for errors (F12)
☐ Test on multiple devices/browsers
☐ Verify protected pages require login
```

---

## 🔐 Security for Production

⚠️ **Important changes needed:**

### 1. **Backend - Update app.py**

```python
import os

DEBUG = os.getenv('FLASK_ENV') != 'production'

if __name__ == "__main__":
    app.run(debug=DEBUG, host='0.0.0.0')
```

### 2. **Store Secrets in Environment Variables**

**Never commit these to GitHub:**
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `JWT_SECRET_KEY`

**Instead, set them in hosting service:**

**For Railway.app:**
1. Go to project settings
2. Add environment variables
3. Set each secret

**For Render.com:**
1. Go to Environment
2. Add secrets

### 3. **Update config.py for production**

```python
import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "default_url")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "default_key")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
```

---

## 📤 Deployment Steps Summary

### **1. Deploy Backend**
```
Choose: Railway.app / Render.com / PythonAnywhere
Upload: All files from `backend/` folder
Get: Backend URL (e.g., https://yourapp.railway.app)
```

### **2. Update Frontend Code**
```
Edit: js/script.js and signup.html
Change: API_BASE_URL = 'https://yourapp.railway.app'
```

### **3. Deploy Frontend**
```
Choose: Vercel / Netlify
Upload: All HTML/CSS/JS files
Get: Frontend URL (e.g., https://yourproject.vercel.app)
```

### **4. View Backend Data**
```
Dashboard: https://yourapp.railway.app/
All Users: https://yourapp.railway.app/api/users
API Status: https://yourapp.railway.app/api/status
```

---

## 🎯 Example Deployment Workflow

```
1. Login to Railway.app
2. Create "School Uniform Business" project
3. Connect GitHub repo
4. Deploy → Gets https://school-uniform.railway.app
5. Add environment variables (Supabase keys)
6. In frontend code: const API_BASE_URL = 'https://school-uniform.railway.app'
7. Deploy frontend to Vercel
8. Test login/signup
9. View data at https://school-uniform.railway.app/api/users
```

---

## 🔄 After Deployment

### **Frontend URL (Where users visit):**
```
https://yourproject.vercel.app
```

Users can:
- Sign up
- Login
- Access protected pages
- View data

### **Backend URL (Where data is stored):**
```
https://yourapp.railway.app
```

Admins can:
- View dashboard: `/`
- View users: `/api/users`
- Check status: `/api/status`

---

## ✅ Local Development vs Production

| Aspect | Local | Production |
|--------|-------|-----------|
| Frontend URL | `localhost` | `vercel.app` |
| Backend URL | `http://localhost:5000` | `railway.app` or `render.io` |
| Database | Supabase (cloud) | Supabase (cloud) |
| Debug Mode | ON | OFF |
| Environment | Development | Production |
| Secrets | In code (dev only) | Environment variables |

---

## 📞 Quick Links

- **Railway:** https://railway.app
- **Render:** https://render.com
- **PythonAnywhere:** https://www.pythonanywhere.com
- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **Supabase Console:** https://app.supabase.com

---

## 🎓 Example: After Everything is Deployed

**User Journey:**
1. Open: `https://yourproject.vercel.app` (Frontend)
2. Click "Sign Up"
3. Fills form → Sends to `https://yourapp.railway.app/register` (Backend)
4. Backend stores in Supabase database
5. User logs in
6. Login request to `https://yourapp.railway.app/login` (Backend)
7. Backend validates & returns JWT token
8. Frontend stores token & allows access

**Admin/Developer View:**
1. Open: `https://yourapp.railway.app/` (Backend Dashboard)
2. Click "View All Users"
3. See all registered users
4. Monitor API activity

---

**Ready to deploy? Let me know which platform you choose!** 🚀
