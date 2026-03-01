# Install and Run - Complete Setup

## Quick Start (3 Steps)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

**Admin Frontend:**
```bash
cd admin
npm install
```

**Security/Student Frontend:**
```bash
cd security-fronend
npm install
```

### Step 3: Start All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Runs on http://localhost:5000

**Terminal 2 - Admin Frontend:**
```bash
cd admin
npm run dev
```
✅ Runs on http://localhost:5173

**Terminal 3 - Security/Student Frontend:**
```bash
cd security-fronend
npm run dev
```
✅ Runs on http://localhost:5174

---

## Access Applications

### Admin Dashboard
- **URL**: http://localhost:5173
- **Email**: security@gmail.com
- **Password**: security

### Security Officer Portal
- **URL**: http://localhost:5174
- **Login as**: Security Officer (created by admin)

### Student Portal
- **URL**: http://localhost:5174
- **Login as**: Student (created during device registration)

---

## Database

The system now uses **SQLite** (no PostgreSQL needed!)

- Database file: `backend/database.sqlite`
- Auto-created on first run
- No setup required

---

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found
```bash
# Make sure you're in correct directory
cd backend  # or admin or security-fronend
npm install
```

### Server Won't Start
1. Check `.env` file exists
2. Check port 5000 is free
3. Check Node.js is installed: `node --version`

---

## What's Included

✅ Complete backend API (25+ endpoints)
✅ Admin dashboard with analytics
✅ Security officer portal
✅ Student portal with check-in/out
✅ QR code system with encryption
✅ JWT authentication
✅ Rate limiting
✅ Audit logging
✅ SQLite database (no setup needed)
✅ Comprehensive documentation

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start all services
3. ✅ Access admin dashboard
4. ✅ Create test data
5. ✅ Test functionality
6. ✅ Deploy to production

---

## Support

- Check `SETUP_GUIDE.md` for detailed setup
- Check `API_DOCUMENTATION.md` for API reference
- Check `QUICK_REFERENCE.md` for quick commands

---

**Status**: Ready to Run ✅
