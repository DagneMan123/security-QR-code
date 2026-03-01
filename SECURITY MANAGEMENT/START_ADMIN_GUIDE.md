# How to Start Admin Frontend - Complete Guide

## Prerequisites
- Node.js installed
- Backend running on port 5000
- PostgreSQL database running

---

## STEP 1: Start Backend Server

Open a terminal and run:

```bash
cd "SECURITY MANAGEMENT/backend"
npm install
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

---

## STEP 2: Start Admin Frontend

Open a NEW terminal and run:

```bash
cd "SECURITY MANAGEMENT/admin"
npm install
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## STEP 3: Access Admin Dashboard

1. Open your browser
2. Go to: **http://localhost:5173/**
3. You should see the Login page

---

## LOGIN CREDENTIALS

### Admin Login
- **Email**: admin@example.com
- **Password**: admin123

(Or use your own admin credentials if you've created different ones)

---

## TROUBLESHOOTING

### Issue: "Cannot GET /"
**Solution**: Make sure you're accessing `http://localhost:5173/` (not 5000)

### Issue: "Backend not responding"
**Solution**: 
- Check if backend is running on port 5000
- Check `.env` file has correct `VITE_BACKEND_URL`
- Verify database connection

### Issue: "Port 5173 already in use"
**Solution**: 
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: "npm install fails"
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## ENVIRONMENT SETUP

### Check Admin .env file
**Location**: `SECURITY MANAGEMENT/admin/.env`

Should contain:
```
VITE_BACKEND_URL=http://localhost:5000
```

### Check Backend .env file
**Location**: `SECURITY MANAGEMENT/backend/.env`

Should contain:
```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=security_management
JWT_SECRET=your_secret_key
```

---

## QUICK START COMMANDS

### Terminal 1 - Backend
```bash
cd "SECURITY MANAGEMENT/backend"
npm run dev
```

### Terminal 2 - Admin Frontend
```bash
cd "SECURITY MANAGEMENT/admin"
npm run dev
```

### Terminal 3 - Security Frontend (Optional)
```bash
cd "SECURITY MANAGEMENT/security-fronend"
npm run dev
```

---

## WHAT YOU'LL SEE

### Login Page
- Email input field
- Password input field
- Login button
- Remember me checkbox

### After Login - Dashboard
- Sidebar with navigation menu
- Main dashboard with statistics
- Device management options
- Security officer management
- Student management
- Today's login/logout records

---

## ADMIN FEATURES AVAILABLE

✓ Dashboard with statistics
✓ Device management (add, edit, delete, block)
✓ Student management
✓ Security officer management (add, edit, delete, disable)
✓ Today's login/logout records
✓ Blocked devices list
✓ Export to PDF/Excel
✓ Search and filter
✓ Dark mode toggle
✓ Responsive design

---

## PORTS USED

- **Backend**: http://localhost:5000
- **Admin Frontend**: http://localhost:5173
- **Security Frontend**: http://localhost:5174 (if running)
- **Student Frontend**: http://localhost:5175 (if running)

---

## COMMON PAGES

After login, you can access:

- `/` - Dashboard
- `/list-device` - Device list
- `/device/:deviceId` - Device details
- `/register-pc` - Register new device
- `/manage-security-officer` - Manage security officers
- `/add/security` - Add new security officer
- `/security-officer/:officerId/edit` - Edit security officer
- `/manage-students` - Manage students
- `/register-student` - Register new student
- `/today-logins` - Today's login records
- `/today-logouts` - Today's logout records
- `/blocked-devices` - Blocked devices

---

## STILL NOT WORKING?

1. **Check if backend is running**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check browser console for errors**
   - Press F12 to open developer tools
   - Go to Console tab
   - Look for red error messages

3. **Check network tab**
   - Go to Network tab in developer tools
   - Try to login
   - Look for failed requests
   - Check response status and error messages

4. **Check backend logs**
   - Look at terminal where backend is running
   - Check for error messages

---

## NEXT STEPS

Once admin is running:

1. Login with admin credentials
2. Navigate to "Security Officers"
3. Click on an officer ID to edit
4. Update officer information
5. Test all features

---

## NEED HELP?

Check these files for more information:
- `SECURITY MANAGEMENT/README_COMPLETE.md`
- `SECURITY MANAGEMENT/SETUP_GUIDE.md`
- `SECURITY MANAGEMENT/backend/API_DOCUMENTATION.md`
