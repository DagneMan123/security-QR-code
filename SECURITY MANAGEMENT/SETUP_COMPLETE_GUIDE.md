# Complete Setup Guide - Security Management System

## Prerequisites
- Node.js (v18+) installed
- PostgreSQL installed locally OR Supabase account (already configured)
- npm installed

---

## STEP 1: Database Setup

### Option A: Using Supabase (Recommended - Already Configured)
Your `.env` already has Supabase connection:
```
DATABASE_URL=postgresql://postgres.hivoyfmrydfzrelpzufp:MYlove8@1@@1@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**The database is already set up on Supabase.** You just need to verify the connection works.

### Option B: Using Local PostgreSQL
If you prefer local PostgreSQL:

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - During installation, remember the password you set for `postgres` user

2. **Create the database:**
   ```bash
   psql -U postgres
   ```
   Then in psql:
   ```sql
   CREATE DATABASE security_db;
   \q
   ```

3. **Update `.env` file:**
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/security_db
   ```

---

## STEP 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd "SECURITY MANAGEMENT/backend"
npm install
```

### 2.2 Verify Environment Variables
Check that `backend/.env` has:
- ✅ DATABASE_URL (Supabase or local PostgreSQL)
- ✅ CLOUDINARY_CLOUD_NAME=dm5rf4yzc
- ✅ CLOUDINARY_API_KEY=815842898446983
- ✅ CLOUDINARY_API_SECRET=boT09_AFnNUMrNW_LrO2qfLad7g
- ✅ JWT_SECRET=smart_security_jwt_secret_key_12345
- ✅ PORT=5000

### 2.3 Start Backend
```bash
npm run dev
```

**Expected output:**
```
Server running on port 5000
```

If you see database connection errors, check:
1. PostgreSQL is running (if using local)
2. DATABASE_URL is correct
3. Network connection (if using Supabase)

---

## STEP 3: Admin Dashboard Setup

### 3.1 Install Dependencies
```bash
cd "SECURITY MANAGEMENT/admin"
npm install
```

### 3.2 Check Environment Variables
Verify `admin/.env` has:
```
VITE_API_URL=http://localhost:5000/api
```

### 3.3 Start Admin Dashboard
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## STEP 4: Security Officer Portal Setup

### 4.1 Install Dependencies
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm install
```

### 4.2 Check Environment Variables
Verify `security-fronend/.env` has:
```
VITE_API_URL=http://localhost:5000/api
```

### 4.3 Start Security Portal
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
```

---

## STEP 5: Testing the System

### 5.1 Test Backend API
```bash
curl http://localhost:5000/
```
Expected: `Backend working!`

### 5.2 Test Admin Dashboard
- Open: http://localhost:5173/
- Login with:
  - Email: `security@gmail.com`
  - Password: `security`

### 5.3 Test Security Portal
- Open: http://localhost:5174/
- Register a new student or login

### 5.4 Test Cloudinary Image Upload
1. Go to Admin Dashboard → Register Device
2. Upload a student photo
3. Check database: Image should be stored as Cloudinary URL (not base64)
4. Verify in Cloudinary dashboard: https://cloudinary.com/console/media_library

---

## STEP 6: Troubleshooting

### Backend won't start - Database connection error
```
ConnectionError [SequelizeConnectionError]: database "security_db" does not exist
```
**Solution:**
- If using Supabase: Check internet connection and DATABASE_URL
- If using local PostgreSQL: Create database with `CREATE DATABASE security_db;`

### Backend won't start - Missing package
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'qrcode'
```
**Solution:**
```bash
cd backend
npm install
```

### Images stored as base64 instead of Cloudinary URL
**Solution:**
1. Verify Cloudinary credentials in `.env`
2. Check `backend/middleware/multer.js` has CloudinaryStorage configured
3. Restart backend: `npm run dev`
4. Try uploading a new device photo

### Frontend can't connect to backend
**Solution:**
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Ensure CORS is enabled in backend (it is by default)

---

## Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd "SECURITY MANAGEMENT/backend"
npm install
npm run dev
```

**Terminal 2 - Admin Dashboard:**
```bash
cd "SECURITY MANAGEMENT/admin"
npm install
npm run dev
```

**Terminal 3 - Security Portal:**
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm install
npm run dev
```

Then open:
- Admin: http://localhost:5173/
- Security: http://localhost:5174/

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
├──────────────────────┬──────────────────────────────────┤
│  Admin Dashboard     │  Security Officer Portal         │
│  (React)             │  (React)                         │
│  Port: 5173          │  Port: 5174                      │
└──────────────────────┴──────────────────────────────────┘
                            ↓
                    API Calls (HTTP)
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Backend API Layer (Express)                 │
│              Port: 5000                                  │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                 │
│  - /api/devices (Device management)                      │
│  - /api/student (Student management)                     │
│  - /api/officer (Officer management)                     │
│  - /api/user (Authentication)                            │
│  - /api/qr (QR code operations)                          │
│  - /api/dashboard (Dashboard data)                       │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────┐              ┌──────────────────────┐
│  PostgreSQL DB   │              │  Cloudinary Storage  │
│  (Supabase)      │              │  (Image uploads)     │
└──────────────────┘              └──────────────────────┘
```

---

## Features Implemented

✅ **Authentication**
- JWT-based authentication
- Role-based access control (Admin, Officer, Student)
- Secure password hashing with bcrypt

✅ **Device Management**
- Register devices with QR codes
- Encrypt/decrypt QR data
- Block/unblock devices
- Track device status (login/logout)

✅ **Student Management**
- Register students
- Store student photos on Cloudinary
- Track student check-in/check-out

✅ **Security Officer Portal**
- Scan QR codes
- Record student check-in/check-out
- View today's activity

✅ **Admin Dashboard**
- View all devices and students
- Manage security officers
- View analytics and reports
- Block suspicious devices

✅ **Image Storage**
- Cloudinary integration for student photos
- Automatic image optimization
- Secure URL storage in database

---

## API Endpoints

### Device Management
- `POST /api/devices/register` - Register new device
- `GET /api/devices/list` - Get all devices
- `GET /api/devices/:deviceId` - Get device details
- `PUT /api/devices/:deviceId/status` - Update device status
- `DELETE /api/devices/:deviceId` - Remove device

### Student Management
- `POST /api/student/register` - Register student
- `GET /api/student/list` - Get all students
- `GET /api/student/:studentId` - Get student details

### Authentication
- `POST /api/user/login` - Login
- `POST /api/user/register` - Register admin

### QR Code
- `POST /api/qr/decrypt` - Decrypt QR data

---

## Next Steps

1. ✅ Set up database (Supabase or local PostgreSQL)
2. ✅ Install backend dependencies
3. ✅ Start backend server
4. ✅ Install admin dashboard dependencies
5. ✅ Start admin dashboard
6. ✅ Install security portal dependencies
7. ✅ Start security portal
8. ✅ Test image upload to Cloudinary
9. ✅ Verify all features working

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services are running on correct ports
4. Check browser console for frontend errors
5. Check terminal output for backend errors
