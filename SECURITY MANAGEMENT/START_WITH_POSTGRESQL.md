# Start With PostgreSQL - Complete Guide

## 🎯 System Now Uses PostgreSQL + Sequelize

The system has been updated to use PostgreSQL database with Sequelize ORM.

---

## ⏱️ Total Setup Time: ~15 Minutes

- PostgreSQL Installation: 5 min
- Database Creation: 2 min
- Configuration: 2 min
- Backend Setup: 3 min
- Frontend Setup: 3 min

---

## 📋 Prerequisites

- Node.js installed
- npm installed
- Administrator access (for PostgreSQL installation)

---

## Step 1: Install PostgreSQL (5 minutes)

### Windows

1. Download: https://www.postgresql.org/download/windows/
2. Run the installer
3. Follow the wizard:
   - Accept license
   - Choose installation directory
   - Select components (default is fine)
   - Set password for `postgres` user (remember this!)
   - Port: 5432 (default)
   - Locale: [your locale]
4. Click "Finish"
5. PostgreSQL is now installed

### macOS

```bash
# Using Homebrew (recommended)
brew install postgresql@15
brew services start postgresql@15

# Or download from: https://www.postgresql.org/download/macosx/
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Step 2: Create Database (2 minutes)

Open Command Prompt/Terminal and run:

```bash
psql -U postgres
```

You'll be prompted for password. Enter the password you set during installation.

Then run:

```sql
CREATE DATABASE security_db;
```

Exit:

```sql
\q
```

---

## Step 3: Update Configuration (2 minutes)

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=smart_security_jwt_secret_key_12345

# Admin Credentials
ADMIN_EMAIL=security@gmail.com
ADMIN_PASSWORD=security

# QR Code Configuration
QR_SECRET=smart_security_key_123
```

**Important**: Change `DB_PASSWORD` to the password you set for PostgreSQL!

---

## Step 4: Setup Backend (3 minutes)

```bash
cd backend
npm install
npm run dev
```

Wait for installation to complete. You should see:

```
[nodemon] 3.1.11
[nodemon] starting `node server.js`
Server running on port 5000
```

✅ **Backend is running!**

---

## Step 5: Setup Admin Frontend (3 minutes)

Open a **NEW** Command Prompt/Terminal:

```bash
cd admin
npm install
npm run dev
```

You should see:

```
VITE v5.0.0 ready in 500 ms
➜  Local:   http://localhost:5173/
```

✅ **Admin frontend is running!**

---

## Step 6: Setup Security/Student Frontend (3 minutes)

Open a **THIRD** Command Prompt/Terminal:

```bash
cd security-fronend
npm install
npm run dev
```

You should see:

```
VITE v5.0.0 ready in 500 ms
➜  Local:   http://localhost:5174/
```

✅ **Security/Student frontend is running!**

---

## Step 7: Access Applications

### Admin Dashboard
- URL: http://localhost:5173
- Email: security@gmail.com
- Password: security

### Security Officer Portal
- URL: http://localhost:5174
- Create officer in admin dashboard

### Student Portal
- URL: http://localhost:5174
- Create student during device registration

---

## ✅ You're Done!

All three services are running:
- Backend: http://localhost:5000 ✅
- Admin: http://localhost:5173 ✅
- Security: http://localhost:5174 ✅

---

## 🐛 Troubleshooting

### PostgreSQL Not Running?

**Windows:**
```bash
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

**macOS:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Connection Error?

Check `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=postgres
```

Make sure `DB_PASSWORD` matches your PostgreSQL password!

### Database Not Found?

Create it:
```bash
psql -U postgres
CREATE DATABASE security_db;
\q
```

### npm install Fails?

```bash
npm cache clean --force
npm install
```

### Port Already in Use?

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

---

## 📊 Database

### Type
PostgreSQL (Production-ready)

### Tables (Auto-created)
- Device
- Student
- SecurityOfficer

### Connection
- Host: localhost
- Port: 5432
- Database: security_db
- User: postgres

---

## 🔑 Default Credentials

| Role | Email/ID | Password |
|------|----------|----------|
| Admin | security@gmail.com | security |
| Officer | (create in admin) | Officer ID |
| Student | (create in admin) | Student ID |

---

## 📚 Documentation

- **POSTGRESQL_SETUP.md** - Complete PostgreSQL setup
- **POSTGRESQL_QUICK_START.md** - 10-minute quick start
- **SETUP_POSTGRESQL.txt** - Quick reference
- **POSTGRESQL_MIGRATION.md** - Migration details
- **API_DOCUMENTATION.md** - API reference
- **QUICK_REFERENCE.md** - Quick commands

---

## 🎯 Next Steps

1. ✅ Create test device
2. ✅ Generate QR code
3. ✅ Test student check-in/out
4. ✅ Explore all features
5. ✅ Deploy to production

---

## 💡 Tips

- Keep all 3 terminals open while developing
- Use `rs` in nodemon to restart server
- Check browser console for frontend errors
- Check terminal for backend errors
- Database auto-syncs on startup

---

## 🆘 Need Help?

1. Check POSTGRESQL_SETUP.md
2. Check POSTGRESQL_QUICK_START.md
3. Check error messages carefully
4. Check .env file configuration

---

## ✨ Features Ready

✅ Admin Dashboard with Analytics
✅ Device Management
✅ Student Management
✅ Officer Management
✅ QR Code Generation & Scanning
✅ Device Check-in/Check-out
✅ JWT Authentication
✅ Rate Limiting
✅ Audit Logging
✅ Complete Documentation

---

## 🚀 You're Ready!

Everything is set up and ready to go.

**Follow the steps above and you'll be running in 15 minutes!**

---

**Status**: PRODUCTION READY ✅

**Good luck! 🚀**
