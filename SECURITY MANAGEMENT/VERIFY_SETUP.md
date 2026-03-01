# Verification Checklist

Use this checklist to verify your setup is correct before running the system.

## ✅ Environment Variables

### Backend (.env)
- [ ] `DATABASE_URL` is set (Supabase or local PostgreSQL)
- [ ] `CLOUDINARY_CLOUD_NAME=dm5rf4yzc`
- [ ] `CLOUDINARY_API_KEY=815842898446983`
- [ ] `CLOUDINARY_API_SECRET=boT09_AFnNUMrNW_LrO2qfLad7g`
- [ ] `JWT_SECRET=smart_security_jwt_secret_key_12345`
- [ ] `PORT=5000`

### Admin Dashboard (.env)
- [ ] `VITE_API_URL=http://localhost:5000/api`

### Security Portal (.env)
- [ ] `VITE_API_URL=http://localhost:5000/api`

---

## ✅ Dependencies Installed

### Backend
```bash
cd "SECURITY MANAGEMENT/backend"
npm list | grep -E "express|sequelize|cloudinary|multer|qrcode"
```
Should show:
- [ ] express
- [ ] sequelize
- [ ] pg
- [ ] cloudinary
- [ ] multer
- [ ] multer-storage-cloudinary
- [ ] qrcode

### Admin Dashboard
```bash
cd "SECURITY MANAGEMENT/admin"
npm list | grep -E "react|axios|vite"
```

### Security Portal
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm list | grep -E "react|axios|vite"
```

---

## ✅ Database Connection

### Test Supabase Connection
```bash
cd "SECURITY MANAGEMENT/backend"
npm run dev
```

Look for:
- [ ] No connection errors
- [ ] "Server running on port 5000"

### Test Local PostgreSQL Connection
```bash
psql -U postgres -d security_db -c "SELECT 1;"
```

Should return:
```
 ?column?
----------
        1
(1 row)
```

---

## ✅ Cloudinary Configuration

1. Go to https://cloudinary.com/console/media_library
2. Login with your account
3. Verify:
   - [ ] Cloud name matches: `dm5rf4yzc`
   - [ ] API key matches: `815842898446983`
   - [ ] Folder `security_management/students` exists (or will be created on first upload)

---

## ✅ Backend API Test

### Start Backend
```bash
cd "SECURITY MANAGEMENT/backend"
npm run dev
```

### Test API Endpoint
```bash
curl http://localhost:5000/
```

Expected response:
```
Backend working!
```

---

## ✅ Frontend Connectivity

### Start Admin Dashboard
```bash
cd "SECURITY MANAGEMENT/admin"
npm run dev
```

Open http://localhost:5173/ and check:
- [ ] Page loads without errors
- [ ] No CORS errors in browser console
- [ ] Can see login form

### Start Security Portal
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm run dev
```

Open http://localhost:5174/ and check:
- [ ] Page loads without errors
- [ ] No CORS errors in browser console
- [ ] Can see login/register form

---

## ✅ Image Upload Test

### Step 1: Register a Device with Photo
1. Open Admin Dashboard: http://localhost:5173/
2. Login: `security@gmail.com` / `security`
3. Go to "Register Device"
4. Fill in all fields
5. Upload a student photo
6. Click "Register"

### Step 2: Verify Cloudinary Upload
1. Go to https://cloudinary.com/console/media_library
2. Check folder: `security_management/students`
3. [ ] Your uploaded photo should appear there

### Step 3: Verify Database Storage
1. Connect to your database:
   ```bash
   # Supabase
   psql "postgresql://postgres.hivoyfmrydfzrelpzufp:MYlove8@1@@1@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"
   
   # Or Local PostgreSQL
   psql -U postgres -d security_db
   ```

2. Query the student table:
   ```sql
   SELECT studentId, fullName, imageUrl FROM "Students" LIMIT 1;
   ```

3. Check the `imageUrl` column:
   - [ ] Should start with `https://res.cloudinary.com/...`
   - [ ] Should NOT be base64 (not starting with `data:image/...`)

---

## ✅ QR Code Test

### Step 1: Generate QR Code
1. In Admin Dashboard, go to "Device List"
2. Click on a device
3. [ ] QR code should display

### Step 2: Scan QR Code
1. Open Security Portal: http://localhost:5174/
2. Go to "Check In/Out"
3. Use your phone camera or QR scanner
4. Scan the QR code from Admin Dashboard
5. [ ] Should successfully decode and show device info

---

## ✅ Authentication Test

### Admin Login
- [ ] Email: `security@gmail.com`
- [ ] Password: `security`
- [ ] Should redirect to dashboard

### Student Registration
1. Open Security Portal
2. Go to "Register"
3. Fill in student details
4. [ ] Should successfully register
5. [ ] Should be able to login with new credentials

---

## Common Issues & Solutions

### Issue: "Cannot find package 'qrcode'"
**Solution:**
```bash
cd "SECURITY MANAGEMENT/backend"
npm install qrcode
```

### Issue: "database does not exist"
**Solution:**
```bash
# For local PostgreSQL
psql -U postgres
CREATE DATABASE security_db;
\q

# Then restart backend
npm run dev
```

### Issue: "CORS error" in frontend
**Solution:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Restart frontend: `npm run dev`

### Issue: Images stored as base64
**Solution:**
1. Verify Cloudinary credentials in `.env`
2. Restart backend: `npm run dev`
3. Try uploading a new device photo
4. Check database again

### Issue: "Cannot connect to Supabase"
**Solution:**
- Check internet connection
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Try local PostgreSQL instead

---

## Success Indicators

When everything is working correctly, you should see:

✅ Backend running on port 5000
✅ Admin Dashboard running on port 5173
✅ Security Portal running on port 5174
✅ Can login to Admin Dashboard
✅ Can register devices with photos
✅ Photos appear in Cloudinary
✅ Database stores Cloudinary URLs (not base64)
✅ QR codes generate and scan correctly
✅ Students can check in/out

---

## Next: Run the System

Once all checks pass, follow the Quick Start Commands in SETUP_COMPLETE_GUIDE.md
