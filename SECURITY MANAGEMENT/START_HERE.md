# START HERE - Complete Fix & Run Guide

## 🚨 Current Issue
Old PostgreSQL packages still in `node_modules`. Need to clean and reinstall.

## ✅ Solution (5 Minutes)

### Step 1: Delete Old Files (2 minutes)

**Windows Command Prompt:**
```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
```

**Windows PowerShell:**
```powershell
cd backend
Remove-Item -Recurse -Force "node_modules"
Remove-Item "package-lock.json"
```

**macOS/Linux:**
```bash
cd backend
rm -rf node_modules package-lock.json
```

### Step 2: Reinstall Dependencies (2 minutes)

```bash
npm install
```

Wait for it to complete. You should see:
```
added 209 packages in 2s
```

### Step 3: Start Backend (1 minute)

```bash
npm run dev
```

You should see:
```
[nodemon] starting `node server.js`
Server running on port 5000
```

✅ **Backend is now running!**

---

## 🎯 Next: Start Frontends

### Terminal 2 - Admin Frontend

```bash
cd admin
npm install
npm run dev
```

Access: http://localhost:5173

### Terminal 3 - Security/Student Frontend

```bash
cd security-fronend
npm install
npm run dev
```

Access: http://localhost:5174

---

## 🔑 Login Credentials

### Admin Dashboard
- **Email**: security@gmail.com
- **Password**: security

### Security Officer
- Create in admin dashboard
- Officer ID = default password

### Student
- Create during device registration
- Student ID = default password

---

## 📋 What's Included

✅ Complete Backend API (25+ endpoints)
✅ Admin Dashboard with Analytics
✅ Security Officer Portal
✅ Student Portal with Check-in/Out
✅ QR Code System with Encryption
✅ JWT Authentication
✅ Rate Limiting
✅ Audit Logging
✅ SQLite Database (Auto-created)
✅ Full Documentation

---

## 🗄️ Database

**Type**: SQLite (No setup needed!)
**File**: `backend/database.sqlite`
**Auto-created**: On first run

---

## 🐛 Troubleshooting

### Still Getting PostgreSQL Error?
1. Make sure you deleted `node_modules` folder
2. Make sure you deleted `package-lock.json`
3. Run `npm install` again
4. Check `.env` has `DB_DIALECT="sqlite"`

### Port Already in Use?
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### npm install Fails?
```bash
npm cache clean --force
npm install
```

---

## 📁 File Structure

```
backend/
├── config/db.js          ✅ SQLite configured
├── package.json          ✅ SQLite in dependencies
├── .env                  ✅ SQLite settings
├── server.js             ✅ Express server
├── controllers/          ✅ API logic
├── routes/               ✅ API endpoints
├── models/               ✅ Database models
└── database.sqlite       ✅ Auto-created

admin/
├── src/
├── package.json
└── .env

security-fronend/
├── src/
├── package.json
└── .env
```

---

## ✨ Features Ready to Use

### Admin Dashboard
- Device management
- Student management
- Officer management
- QR code generation
- Analytics & reports
- Device blocking

### Security Officer Portal
- View all devices
- View all students
- Block devices
- Scan QR codes
- Today's activity
- Profile management

### Student Portal
- Check-in device
- Check-out device
- View device status
- Scan QR code
- Profile information

---

## 🚀 Quick Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Admin Frontend
cd admin
npm install
npm run dev

# Security/Student Frontend
cd security-fronend
npm install
npm run dev
```

---

## 📊 Expected Output

### Backend
```
[nodemon] 3.1.11
[nodemon] starting `node server.js`
[dotenv@17.2.3] injecting env (8) from .env
Server running on port 5000
```

### Frontend
```
VITE v5.0.0 ready in 500 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 🎓 Documentation

- `FIX_NOW.md` - Detailed fix instructions
- `INSTALL_AND_RUN.md` - Installation guide
- `API_DOCUMENTATION.md` - API reference
- `QUICK_REFERENCE.md` - Quick commands
- `SETUP_GUIDE.md` - Complete setup
- `COMPLETE_README.md` - Full documentation

---

## ⏱️ Time to Run

- Clean old files: 1 minute
- Install dependencies: 2 minutes
- Start backend: 30 seconds
- Start frontends: 1 minute
- **Total: ~5 minutes**

---

## ✅ Checklist

- [ ] Deleted `node_modules` folder
- [ ] Deleted `package-lock.json`
- [ ] Ran `npm install`
- [ ] Backend running on port 5000
- [ ] Admin frontend running on port 5173
- [ ] Security frontend running on port 5174
- [ ] Logged in as admin
- [ ] Created test data
- [ ] Tested all features

---

## 🎯 Next Steps

1. ✅ Follow steps above
2. ✅ Access http://localhost:5173
3. ✅ Login with admin credentials
4. ✅ Create test device
5. ✅ Generate QR code
6. ✅ Test student check-in/out
7. ✅ Explore all features

---

## 💡 Tips

- Keep all 3 terminals open while developing
- Use `rs` in nodemon to restart server
- Check browser console for frontend errors
- Check terminal for backend errors
- Database auto-syncs on startup

---

## 🆘 Still Having Issues?

1. Check `FIX_NOW.md` for detailed troubleshooting
2. Verify all files are in correct location
3. Check `.env` file has correct settings
4. Try clearing npm cache: `npm cache clean --force`
5. Restart all terminals

---

**Status**: Ready to Run ✅
**Time to Setup**: ~5 minutes
**Difficulty**: Easy

---

**Let's Go! 🚀**
