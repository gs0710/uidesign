# 🏗️ Architecture: How Your App Works (Local vs Production)

## LOCAL DEVELOPMENT (Right Now)

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │  Browser/Client  │          │   Flask Backend  │         │
│  │  (Frontend)      │◄────────►│   localhost:5000 │         │
│  │                  │          │                  │         │
│  │  - HTML/CSS/JS   │  HTTP    │  - Register API  │         │
│  │  - index.html    │ POST/GET │  - Login API     │         │
│  │  - login.html    │          │  - Dashboard     │         │
│  │  - signup.html   │          │  - Get Users API │         │
│  │  - billing.html  │          │                  │         │
│  └──────────────────┘          └────────┬─────────┘         │
│                                         │                   │
│                                         │ Supabase Client   │
│                                         │                   │
│                    ┌────────────────────▼──────────┐        │
│                    │   Internet Connection         │        │
│                    │   (API calls to Supabase)     │        │
│                    └────────────────────┬──────────┘        │
│                                         │                   │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                        ┌─────────────────▼──────────────┐
                        │   SUPABASE CLOUD              │
                        │   Database (PostgreSQL)       │
                        │   - users table               │
                        │   - Stores all user data      │
                        │   - Remote URL                │
                        └──────────────────────────────┘

Localhost URLs:
- Frontend:  http://localhost/
- Backend:   http://localhost:5000/
```

---

## PRODUCTION DEPLOYMENT

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERNET (Cloud)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐                                        │
│  │  User's Browser  │                                        │
│  │  (Client)        │                                        │
│  └────────┬─────────┘                                        │
│           │                                                   │
│           │ Opens URL                                        │
│           │                                                   │
│    ┌──────▼───────────────────────────┐                      │
│    │  VERCEL / NETLIFY               │                      │
│    │  Frontend CDN                   │                      │
│    │  https://yourproject.vercel.app │                      │
│    │                                 │                      │
│    │  ├─ Serves: HTML/CSS/JS         │                      │
│    │  ├─ Sends: Login requests       │                      │
│    │  │  to ↓                         │                      │
│    │  └─ API_BASE_URL updated        │                      │
│    └───────────────────────────────────┘                     │
│                    │                                          │
│                    │ HTTPS Requests                          │
│                    │ /register, /login                       │
│                    │                                          │
│    ┌───────────────▼──────────────────┐                      │
│    │  RAILWAY / RENDER               │                      │
│    │  Backend API Server             │                      │
│    │  https://yourapp.railway.app    │                      │
│    │                                 │                      │
│    │  ├─ API Endpoints:              │                      │
│    │  │  ├─ POST   /register         │                      │
│    │  │  ├─ POST   /login            │                      │
│    │  │  ├─ GET    /api/users        │                      │
│    │  │  └─ GET    /api/status       │                      │
│    │  │                              │                      │
│    │  ├─ Validates user data         │                      │
│    │  ├─ Hashes passwords            │                      │
│    │  └─ Sends to Supabase ↓         │                      │
│    └─────────────────────────────────┘                       │
│                    │                                          │
│                    │ Supabase Client                         │
│                    │ (Python SDK)                            │
│                    │                                          │
│    ┌───────────────▼──────────────────┐                      │
│    │  SUPABASE CLOUD (PostgreSQL)    │                      │
│    │  https://supabase.co            │                      │
│    │                                 │                      │
│    │  Database:                      │                      │
│    │  ├─ users table                 │                      │
│    │  │  ├─ id (UUID)                │                      │
│    │  │  ├─ name                     │                      │
│    │  │  ├─ email (unique)           │                      │
│    │  │  ├─ password (hashed)        │                      │
│    │  │  ├─ role                     │                      │
│    │  │  └─ created_at               │                      │
│    │  │                              │                      │
│    │  └─ All user data stored        │                      │
│    └──────────────────────────────────┘                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Production URLs:
- Frontend:  https://yourproject.vercel.app
- Backend:   https://yourapp.railway.app
- Database:  Supabase (Behind backend)
```

---

## REQUEST FLOW: User Sign Up (Production)

```
User Action → Browser Request → Backend Processing → Database

1️⃣  User opens https://yourproject.vercel.app
    ↓
    [Vercel CDN serves HTML/CSS/JS]

2️⃣  User clicks "Sign Up"
    ↓
    Modal appears with form

3️⃣  User fills: Name, Email, Password, Role
    ↓
    User clicks "Register"

4️⃣  Frontend JavaScript sends:
    ┌─────────────────────────────┐
    │ POST /register              │
    │ Host: yourapp.railway.app   │
    │                             │
    │ Body:                       │
    │ {                           │
    │   "name": "John Doe",       │
    │   "email": "john@...",      │
    │   "password": "pass123",    │
    │   "role": "clothes_admin"   │
    │ }                           │
    └─────────────────────────────┘
    ↓
5️⃣  Backend API (Railway) receives:
    ✓ Checks if email exists
    ✓ Hashes password with bcrypt
    ✓ Inserts into users table
    ↓
6️⃣  Supabase stores data:
    User record created:
    {
      "id": "854ce245...",
      "name": "John Doe",
      "email": "john@...",
      "password": "$2b$12$...",    ← hashed
      "role": "clothes_admin",
      "created_at": "2026-02-05..."
    }
    ↓
7️⃣  Backend returns response:
    ┌──────────────────────────┐
    │ HTTP 201 Created         │
    │ {                       │
    │   "msg": "User         │
    │    registered           │
    │    successfully"        │
    │ }                       │
    └──────────────────────────┘
    ↓
8️⃣  Frontend shows success:
    "Welcome, John Doe! Account created."
    ↓
    Redirects to login page
    ↓
9️⃣  User logs in with credentials
    Backend validates against Supabase
    ↓
    Returns JWT token
    ↓
1️⃣0️⃣  Frontend stores token in localStorage
    User can now access protected pages
```

---

## REQUEST FLOW: User Login (Production)

```
1️⃣  User enters email & password
    
2️⃣  Frontend sends:
    POST https://yourapp.railway.app/login
    {
      "email": "john@gmail.com",
      "password": "pass123"
    }
    
3️⃣  Backend processes:
    ├─ Find user by email in Supabase
    ├─ Compare password with bcrypt
    └─ If valid:
       └─ Generate JWT token
    
4️⃣  Backend returns:
    HTTP 200 OK
    {
      "token": "eyJ0eXAiOiJKV1Q...",
      "role": "clothes_admin"
    }
    
5️⃣  Frontend stores token:
    localStorage.setItem('authToken', token)
    
6️⃣  User can now:
    ✓ Access protected pages
    ✓ See their username in navbar
    ✓ Use the app normally
```

---

## DATA FLOW COMPARISON

### LOCAL DEVELOPMENT
```
Browser (localhost)
    ↓ (direct connection)
    ↓ http://localhost:5000
    ↓
Flask Backend (localhost:5000)
    ↓ (internet)
    ↓
Supabase Database (Cloud)
```

### PRODUCTION
```
User's Browser (anywhere in world)
    ↓ (encrypted HTTPS)
    ↓ https://yourproject.vercel.app
    ↓
Vercel CDN (serves frontend)
    ↓ (encrypted HTTPS)
    ↓ https://yourapp.railway.app
    ↓
Railway Server (backend API)
    ↓ (encrypted, secure)
    ↓
Supabase Database (Cloud, PostgreSQL)
    ↓
Data stored & encrypted
```

---

## BACKEND DATA VISIBILITY

### Local Development
```
View Backend Data:
├─ Terminal: python view_database.py
├─ Browser: http://localhost:5000/
├─ Browser: http://localhost:5000/api/users
└─ Browser: http://localhost:5000/api/status
```

### Production (After Deployment)
```
View Backend Data:
├─ Browser: https://yourapp.railway.app/
├─ Browser: https://yourapp.railway.app/api/users
└─ Browser: https://yourapp.railway.app/api/status

From Anywhere:
- Any computer with internet
- Any phone
- Admin dashboard available 24/7
```

---

## ENVIRONMENT VARIABLES

### Local Development (in code)
```python
# backend/config.py
SUPABASE_URL = "https://luvvqlmrswllwsrfwdeg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5..."
```

### Production (in hosting platform)
```
Railway Settings:
- SUPABASE_URL = "..."
- SUPABASE_KEY = "..."
- FLASK_ENV = "production"

These are kept SECRET and never in code!
```

---

## KEY DIFFERENCES

| Aspect | Local | Production |
|--------|-------|-----------|
| Frontend URL | `localhost` | `vercel.app` |
| Backend URL | `localhost:5000` | `railway.app` |
| Who can access | Only you | Everyone (public) |
| Data visibility | Terminal + Local page | Web dashboard |
| Update code | Instant restart | Redeploy required |
| Database | Same Supabase | Same Supabase |
| Speed | Fastest (local) | Normal (cloud) |
| Always on | No (your PC) | Yes (cloud server) |

---

## FINAL ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION SETUP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PUBLIC INTERNET                                                │
│  └─ https://yourproject.vercel.app  ← Users access this       │
│     └─ Vercel CDN serves HTML/CSS/JS                           │
│     └─ Frontend code calls API at https://yourapp.railway.app  │
│                                                                   │
│  PRIVATE API SERVER (Behind Frontend)                          │
│  └─ https://yourapp.railway.app     ← Admins/API access       │
│     └─ Receives /register, /login requests                     │
│     └─ Processes data & talks to Supabase                      │
│     └─ Provides /api/users & /api/status endpoints             │
│                                                                   │
│  DATABASE (Most Secure)                                        │
│  └─ Supabase PostgreSQL Cloud                                  │
│     └─ Stores all user data                                    │
│     └─ Only backend can access (via credentials)               │
│     └─ Frontend cannot access directly (security!)             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**This is a professional, scalable architecture! 🎉**
