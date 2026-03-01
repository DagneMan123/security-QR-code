# Run Everything - Quick Start

## Prerequisites Check
Before running, make sure:
- ✅ Node.js installed: `node --version` (should be v18+)
- ✅ npm installed: `npm --version`
- ✅ PostgreSQL running (if using local) or Supabase accessible
- ✅ All `.env` files configured (see SETUP_COMPLETE_GUIDE.md)

---

## Option 1: Run All Services (Recommended)

Open **4 separate terminal windows** and run these commands:

### Terminal 1: Backend API
```bash
cd "SECURITY MANAGEMENT/backend"
npm install
npm run dev
```

**Wait for:** `Server running on port 5000`

### Terminal 2: Admin Dashboard
```bash
cd "SECURITY MANAGEMENT/admin"
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

### Terminal 3: Security Officer Portal
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5174/`

### Terminal 4: Monitor (Optional)
```bash
# Just keep this open to monitor logs
# Or use it to run tests/commands
```

---

## Option 2: Run Services One by One

If you only have one terminal, run them sequentially:

### Step 1: Start Backend
```bash
cd "SECURITY MANAGEMENT/backend"
npm install
npm run dev
```

Keep this running. Open a new terminal for the next step.

### Step 2: Start Admin Dashboard
```bash
cd "SECURITY MANAGEMENT/admin"
npm install
npm run dev
```

Keep this running. Open a new terminal for the next step.

### Step 3: Start Security Portal
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm install
npm run dev
```

---

## Access the Applications

Once all services are running:

### Admin Dashboard
- **URL:** http://localhost:5173/
- **Login:**
  - Email: `security@gmail.com`
  - Password: `security`
- **Features:**
  - Register devices
  - Manage students
  - Manage security officers
  - View analytics
  - Block devices

### Security Officer Portal
- **URL:** http://localhost:5174/
- **Features:**
  - Student check-in/check-out
  - Scan QR codes
  - View today's activity
  - Student registration

### Backend API
- **URL:** http://localhost:5000/
- **Test:** `curl http://localhost:5000/`
- **Expected:** `Backend working!`

---

## First Time Setup

### 1. Install All Dependencies
```bash
# Backend
cd "SECURITY MANAGEMENT/backend"
npm install

# Admin Dashboard
cd "SECURITY MANAGEMENT/admin"
npm install

# Security Portal
cd "SECURITY MANAGEMENT/security-fronend"
npm install
```

### 2. Verify Database Connection
```bash
cd "SECURITY MANAGEMENT/backend"
npm run dev
```

Look for:
- ✅ No connection errors
- ✅ "Server running on port 5000"

If you see database errors, check SETUP_COMPLETE_GUIDE.md → Troubleshooting

### 3. Test Admin Login
1. Open http://localhost:5173/
2. Login with:
   - Email: `security@gmail.com`
   - Password: `security`
3. Should see dashboard

### 4. Test Device Registration
1. In Admin Dashboard, go to "Register Device"
2. Fill in all fields
3. Upload a student photo
4. Click "Register"
5. Check Cloudinary: https://cloudinary.com/console/media_library
6. Photo should appear in `security_management/students` folder

---

## Stopping Services

### To Stop a Service
Press `Ctrl + C` in the terminal where it's running

### To Stop All Services
Press `Ctrl + C` in each terminal window

---

## Restarting Services

### If Backend Crashes
```bash
cd "SECURITY MANAGEMENT/backend"
npm run dev
```

### If Frontend Won't Load
```bash
# Stop the frontend (Ctrl + C)
# Then restart
npm run dev
```

### If You Get "Port Already in Use"
```bash
# Find process using port 5000 (backend)
lsof -i :5000
# Kill it
kill -9 <PID>

# Or change PORT in .env and restart
```

---

## Troubleshooting Quick Fixes

### Backend won't start - Database error
```bash
# Check if PostgreSQL is running
# If using Supabase, check internet connection
# If using local PostgreSQL:
psql -U postgres
CREATE DATABASE security_db;
\q
```

### Backend won't start - Missing package
```bash
cd "SECURITY MANAGEMENT/backend"
npm install
npm run dev
```

### Frontend won't load
```bash
# Clear cache and reinstall
cd "SECURITY MANAGEMENT/admin"
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Images not uploading to Cloudinary
1. Verify Cloudinary credentials in `.env`
2. Restart backend: `npm run dev`
3. Try uploading a new device photo
4. Check Cloudinary dashboard

### Can't connect frontend to backend
1. Verify backend is running: `curl http://localhost:5000/`
2. Check `VITE_API_URL` in frontend `.env`
3. Restart frontend: `npm run dev`

---

## Testing Workflow

### 1. Register a Device
1. Open Admin Dashboard: http://localhost:5173/
2. Login: `security@gmail.com` / `security`
3. Go to "Register Device"
4. Fill in:
   - Device ID: `DEV001`
   - Owner ID: `STU001`
   - Student Name: `John Doe`
   - Student Email: `john@example.com`
   - PC Type: `Laptop`
   - Serial Number: `SN123456`
   - Department: `IT`
   - Phone: `1234567890`
5. Upload a photo
6. Click "Register"

### 2. Verify Cloudinary Upload
1. Go to https://cloudinary.com/console/media_library
2. Check folder: `security_management/students`
3. Your photo should be there

### 3. Test QR Code
1. In Admin Dashboard, go to "Device List"
2. Click on the device you just registered
3. QR code should display
4. Scan it with your phone

### 4. Test Student Check-In
1. Open Security Portal: http://localhost:5174/
2. Go to "Check In/Out"
3. Scan the QR code
4. Should show device and student info
5. Click "Check In"

### 5. Verify Database
```bash
# Connect to database
psql "postgresql://postgres.hivoyfmrydfzrelpzufp:MYlove8@1@@1@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"

# Or local:
psql -U postgres -d security_db

# Check students table
SELECT studentId, fullName, imageUrl FROM "Students" LIMIT 1;

# Check devices table
SELECT deviceId, ownerId, qrEncrypted FROM "Devices" LIMIT 1;
```

---

## Performance Tips

### Reduce Logs
In `backend/config/db.js`, logging is already set to `false`

### Optimize Images
Cloudinary automatically optimizes images. No action needed.

### Clear Cache
```bash
# If frontend is slow
cd "SECURITY MANAGEMENT/admin"
rm -rf node_modules/.vite
npm run dev
```

---

## Production Deployment

When ready to deploy:

1. **Update .env for production:**
   ```
   NODE_ENV=production
   DATABASE_URL=<production-database-url>
   ```

2. **Build frontend:**
   ```bash
   cd "SECURITY MANAGEMENT/admin"
   npm run build
   ```

3. **Deploy to hosting service** (Vercel, Netlify, Heroku, etc.)

---

## Support

If you encounter issues:
1. Check SETUP_COMPLETE_GUIDE.md → Troubleshooting
2. Check VERIFY_SETUP.md → Common Issues
3. Check browser console for frontend errors
4. Check terminal output for backend errors
5. Verify all services are running on correct ports

---

## Summary

✅ Backend: http://localhost:5000
✅ Admin Dashboard: http://localhost:5173
✅ Security Portal: http://localhost:5174
✅ Database: PostgreSQL (Supabase or local)
✅ Images: Cloudinary
✅ QR Codes: Encrypted with AES-128-CBC
✅ Authentication: JWT with role-based access

**You're all set! Start the services and enjoy the system.**
