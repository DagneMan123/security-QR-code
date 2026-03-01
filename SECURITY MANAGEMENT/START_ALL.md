# Start All Services - Quick Guide

## Prerequisites
- Node.js installed
- PostgreSQL running
- All dependencies installed

---

## Step 1: Install Dependencies (First Time Only)

### Backend
```bash
cd backend
npm install
```

### Admin Frontend
```bash
cd admin
npm install
```

### Security/Student Frontend
```bash
cd security-fronend
npm install
```

---

## Step 2: Configure Environment Variables

### Backend (.env)
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
QR_SECRET=your_qr_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Admin Frontend (.env)
Create `admin/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Security Frontend (.env)
Create `security-fronend/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## Step 3: Start Services

### Option A: Start Each in Separate Terminal

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# or
npm start
```
✅ Runs on http://localhost:5000

**Terminal 2 - Admin Frontend**
```bash
cd admin
npm run dev
```
✅ Runs on http://localhost:5173

**Terminal 3 - Security/Student Frontend**
```bash
cd security-fronend
npm run dev
```
✅ Runs on http://localhost:5174

---

## Step 4: Access the Applications

### Admin Dashboard
- URL: http://localhost:5173
- Email: admin@example.com
- Password: admin123

### Security Officer Portal
- URL: http://localhost:5174
- Login as security officer (created by admin)

### Student Portal
- URL: http://localhost:5174
- Login as student (created during device registration)

---

## Troubleshooting

### Port Already in Use
```bash
# Find process on port
lsof -i :5000    # Backend
lsof -i :5173    # Admin
lsof -i :5174    # Security

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

### Dependencies Missing
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found
```bash
# Make sure you're in the correct directory
cd backend  # or admin or security-fronend
npm install
```

---

## Available Scripts

### Backend
```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-reload)
npm run server # Same as dev
npm test       # Run tests
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run linter
```

---

## Quick Test

### Test Backend
```bash
curl http://localhost:5000
# Should return: "Backend working!"
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/user/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Test Device List
```bash
curl http://localhost:5000/api/devices/list
```

---

## Common Commands

### Backend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Database Setup

### Create Database
```bash
createdb security_db
```

### Connect to Database
```bash
psql -U postgres -d security_db
```

### View Tables
```sql
\dt
```

---

## Default Credentials

### Admin
- Email: admin@example.com
- Password: admin123

### Security Officer
- Officer ID: (created by admin)
- Password: (same as Officer ID initially)

### Student
- Student ID: (from device registration)
- Password: (same as Student ID initially)

---

## File Structure

```
SECURITY MANAGEMENT/
├── backend/              # Node.js API
├── admin/                # Admin React App
├── security-fronend/     # Security/Student React App
├── SETUP_GUIDE.md        # Installation guide
├── API_DOCUMENTATION.md  # API reference
├── QUICK_REFERENCE.md    # Quick guide
└── START_ALL.md          # This file
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start all services
4. ✅ Access applications
5. ✅ Test functionality
6. ✅ Create test data
7. ✅ Deploy to production

---

## Support

- Check SETUP_GUIDE.md for detailed setup
- Check API_DOCUMENTATION.md for API reference
- Check QUICK_REFERENCE.md for quick commands
- Check error logs in terminal

---

**Last Updated**: February 2026
**Version**: 1.0.0
