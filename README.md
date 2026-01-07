# 🚀 IAAP Frontend - Complete Setup & Fixes Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Important Fixes Applied](#important-fixes-applied)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

This is a professional SaaS application for RPA (Robotic Process Automation) workflow analysis. It includes:
- **Landing Page** with pricing and features
- **User Authentication** (Login/Signup)
- **Dashboard** with API key management
- **Workflow Analyzer** for UiPath files
- **Subscription Management** (Basic, Pro, Enterprise)
- **API Keys Management**

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- PostgreSQL database
- Backend running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

---

## 🔧 Backend Setup

### 1. Start Backend

```bash
cd C:\Users\Prasanna\Downloads\backend\backend
python -m uvicorn app.main:app --reload
```

### 2. CORS Configuration (CRITICAL)

**File:** `C:\Users\Prasanna\Downloads\backend\backend\app\main.py`

**Required CORS settings:**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

⚠️ **Important:** Restart backend after changing CORS settings!

### 3. Database Setup

Run these SQL commands in PostgreSQL:

```sql
-- Create subscription plans
INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111'::uuid, 'Trial', 'Free trial for 30 days', 0.00, 'MONTHLY', 100, 10, 50, '{"support": "community", "api_access": true}'::json, true, NOW()),
('22222222-2222-2222-2222-222222222222'::uuid, 'Basic', 'Perfect for individuals', 29.00, 'MONTHLY', 500, 50, 100, '{"support": "email", "api_access": true}'::json, true, NOW()),
('33333333-3333-3333-3333-333333333333'::uuid, 'Professional', 'For growing teams', 99.00, 'MONTHLY', 5000, 100, -1, '{"support": "priority", "api_access": true}'::json, true, NOW());

-- Create trial subscription for user (replace user_id with your actual user_id)
INSERT INTO subscriptions (subscription_id, user_id, plan_id, status, start_date, end_date, auto_renew, created_at, updated_at)
VALUES (gen_random_uuid(), 'YOUR_USER_ID_HERE'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'TRIAL', NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW());
```

---

## 💻 Frontend Setup

### 1. Environment Variables

**File:** `.env`

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Enable API logging
VITE_API_DEBUG=true
```

⚠️ **Important:** Restart frontend (`npm run dev`) after changing `.env`!

### 2. API Key Setup

**Option A: Auto-create on Login (Recommended)**
- API keys are automatically created when you log in
- Stored in localStorage
- Displayed in dashboard

**Option B: Manual Creation via Swagger**
1. Go to `http://localhost:8000/docs`
2. Login to get token
3. Click "Authorize" and enter: `Bearer YOUR_TOKEN`
4. Use `POST /api/v1/api_key` to create key
5. Save the key in browser console:
   ```javascript
   localStorage.setItem('apiKey', 'YOUR_API_KEY_HERE');
   ```

---

## ✅ Important Fixes Applied

### 1. CORS Issue Fix
**Problem:** Requests blocked by CORS policy  
**Solution:** Updated backend `main.py` to explicitly allow localhost ports

### 2. API Key Authentication
**Problem:** Backend expects API key in `Authorization: Bearer` header  
**Solution:** Updated frontend to send API key correctly

**Before:**
```javascript
headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'X-API-Key': apiKey,
}
```

**After:**
```javascript
headers: {
    'Authorization': `Bearer ${apiKey}`,
}
```

### 3. Subscription Setup
**Problem:** API key creation requires active subscription  
**Solution:** Created SQL scripts to set up plans and trial subscription

### 4. Environment Variables
**Problem:** Frontend using wrong backend URL  
**Solution:** Updated `.env` to use `localhost` instead of `127.0.0.1`

### 5. Landing Page Navigation
**Problem:** Login button navigating to wrong route  
**Solution:** Updated to navigate to `/login` instead of `/`

---

## 🎨 Features

### Pages

1. **Landing Page** (`/`)
   - Hero section with CTA
   - Features showcase
   - Pricing plans
   - Professional design

2. **Login** (`/login`)
   - Email/password authentication
   - Auto-creates API key on login
   - Stores user data in localStorage

3. **Signup** (`/signup`)
   - User registration
   - Form validation
   - Automatic redirect to login

4. **Dashboard** (`/dashboard`)
   - API key display with copy functionality
   - Project creation
   - Quick access to features

5. **Workspace** (`/workspace`)
   - File upload for workflow analysis
   - Drag-and-drop support
   - Real-time analysis status

6. **Pricing** (`/pricing`)
   - Three tiers: Basic, Pro, Enterprise
   - Backend integration for subscriptions
   - Feature comparison

7. **My Subscription** (`/subscription`)
   - Current plan details
   - Usage statistics
   - Upgrade/cancel options

8. **API Keys** (`/api-keys`)
   - Create new API keys
   - View existing keys
   - Delete keys
   - Copy to clipboard

### Key Features

- ✅ **Auto API Key Creation** - Keys created automatically on login
- ✅ **Subscription Management** - Full subscription lifecycle
- ✅ **File Upload** - Support for .xaml workflow files
- ✅ **Real-time Analysis** - Background processing with status updates
- ✅ **Responsive Design** - Works on all devices
- ✅ **Professional UI** - Modern, clean interface

---

## 🔍 Troubleshooting

### Issue: "Failed to fetch" Error

**Causes:**
1. Backend not running
2. CORS not configured
3. Wrong API URL

**Solutions:**
1. Check backend is running: `http://localhost:8000/docs`
2. Verify CORS settings in `main.py`
3. Check `.env` has correct URL
4. Restart both frontend and backend

### Issue: "Invalid or inactive API key"

**Causes:**
1. No API key in localStorage
2. API key not in database
3. No active subscription

**Solutions:**
1. Login again (auto-creates key)
2. Create key via Swagger UI
3. Check subscription exists in database

### Issue: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:8000/...' from origin 'http://localhost:5174' 
has been blocked by CORS policy
```

**Solution:**
1. Update `main.py` CORS settings (see Backend Setup)
2. **Restart backend** (critical!)
3. Clear browser cache
4. Use same origin (localhost for both)

### Issue: Port Already in Use

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solution:**
- Note the new port (e.g., 5174)
- Access app at new port
- Or kill process using the port

---

## 📚 API Documentation

### Authentication

**Login:**
```
POST /api/v1/auth/login
Body: { email, password }
Response: { access_token, token_type, user }
```

**Signup:**
```
POST /api/v1/auth/signup
Body: { email, password, full_name }
Response: { message }
```

### API Keys

**Create:**
```
POST /api/v1/api_key?name=My+Key
Headers: Authorization: Bearer {jwt_token}
Response: { api_key, name }
```

**List:**
```
GET /api/v1/api_key
Headers: Authorization: Bearer {jwt_token}
Response: [{ api_key_id, name, created_at, is_active }]
```

### Workflow Analysis

**Upload & Analyze:**
```
POST /api/v1/analyze/uipath
Headers: Authorization: Bearer {api_key}
Body: FormData with 'file'
Response: { analysis_id, status, message }
```

### Subscriptions

**Get Plans:**
```
GET /api/v1/subscription/plans
Response: [{ plan_id, name, price, features }]
```

**Current Subscription:**
```
GET /api/v1/subscription/current
Headers: Authorization: Bearer {jwt_token}
Response: { subscription_id, plan_name, status, start_date, end_date }
```

---

## 🎯 Common Workflows

### First Time Setup

1. **Start Backend:**
   ```bash
   cd C:\Users\Prasanna\Downloads\backend\backend
   python -m uvicorn app.main:app --reload
   ```

2. **Setup Database:**
   - Run SQL scripts to create plans
   - Create trial subscription for user

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

4. **Access App:**
   - Go to `http://localhost:5173`
   - Click "Get Started" or "Login"

5. **Login:**
   - Enter credentials
   - API key auto-created
   - Redirected to dashboard

6. **Upload Workflow:**
   - Go to workspace
   - Upload .xaml file
   - Click "Upload and Analyze"

### Daily Development

1. Start backend
2. Start frontend
3. Access at `http://localhost:5173`
4. Changes auto-reload

---

## 📝 Notes

### localStorage Keys

After login, these are stored:
- `authToken` - JWT token
- `apiKey` - API key for analysis
- `currentUser` - User object
- `userId` - User UUID
- `userEmail` - User email
- `userFullName` - User name

### Important URLs

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:8000`
- **Swagger UI:** `http://localhost:8000/docs`
- **API Base:** `http://localhost:8000/api/v1`

### File Structure

```
src/
├── components/          # React components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── LandingPage.jsx
│   ├── ProjectWorkspace.jsx
│   ├── PricingPage.jsx
│   ├── MySubscription.jsx
│   └── APIKeysManagement.jsx
├── services/
│   └── api.js          # API service layer
└── utils/
    └── dummyData.js    # Mock data

.env                    # Environment variables
```

---

## 🆘 Support

If you encounter issues:

1. **Check browser console** (F12) for errors
2. **Check backend logs** for API errors
3. **Verify database** has required data
4. **Restart both** frontend and backend
5. **Clear localStorage** and try again

---

## 🎉 Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173/5174
- [ ] Can access Swagger UI
- [ ] Database has subscription plans
- [ ] User has trial subscription
- [ ] Can login successfully
- [ ] API key visible in dashboard
- [ ] Can upload workflow files
- [ ] No CORS errors in console

---

**Built with ❤️ using React, FastAPI, and PostgreSQL**
# Frontend_V1_IAAP
# Frontend_V1_IAAP
# Fronted-V1
#   F r o n t e d - V 1  
 # Fronted-V1
