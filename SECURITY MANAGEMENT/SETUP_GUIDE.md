# Security Management System - Complete Setup Guide

## Project Overview
A comprehensive security management system for device tracking and access control with QR code integration.

### Features
- ✅ Admin Dashboard with analytics
- ✅ Device registration and management
- ✅ Student authentication and check-in/out
- ✅ Security officer management
- ✅ QR code generation and scanning
- ✅ Real-time device status tracking
- ✅ Audit logging
- ✅ Rate limiting and security middleware

---

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

---

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here

# QR Code
QR_SECRET=your_qr_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Cloudinary (optional)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup
```bash
# Create database
createdb security_db

# Run migrations (models auto-sync)
npm start
```

### 4. Start Backend Server
```bash
npm start
```
Server runs on `http://localhost:5000`

---

## Admin Frontend Setup

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
Access at `http://localhost:5173`

### 4. Admin Login
- Email: `admin@example.com`
- Password: `admin123`

---

## Security Officer Frontend Setup

### 1. Install Dependencies
```bash
cd security-fronend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
Access at `http://localhost:5174`

---

## Key Features Implementation

### QR Code System
1. **Generation**: QR codes are automatically generated during device registration
2. **Encryption**: Uses AES-128-CBC encryption
3. **Scanning**: Real-time QR scanning with html5-qrcode
4. **Validation**: QR validation ensures device authenticity

### Authentication Flow
```
Admin Login → JWT Token → Admin Dashboard
Officer Login → JWT Token → Officer Dashboard
Student Login → JWT Token → Check-in/Out Portal
```

### Device Status Tracking
- **Login**: Device checked in
- **Logout**: Device checked out
- **Blocked**: Device access restricted

### Security Features
- JWT-based authentication
- Role-based access control (Admin, Officer, Student)
- Rate limiting on login endpoints
- Audit logging for all actions
- Password hashing with bcrypt
- QR code encryption

---

## API Endpoints Summary

### Authentication
- `POST /api/user/admin` - Admin login
- `POST /api/user/officer` - Officer login
- `POST /api/student/login` - Student login

### Devices
- `POST /api/devices/add` - Register device
- `GET /api/devices/list` - List all devices
- `PATCH /api/devices/update/:deviceId/status` - Update status
- `PATCH /api/devices/update/:deviceId/block` - Block device

### QR Codes
- `GET /api/qr/generate/:deviceId` - Generate QR code
- `POST /api/qr/validate` - Validate QR code
- `POST /api/devices/decrypt` - Decrypt QR data

### Officers
- `GET /api/officer/list` - List officers (admin)
- `POST /api/officer/add` - Add officer (admin)
- `GET /api/officer/profile` - Get profile (officer)

### Students
- `GET /api/student/list` - List students
- `POST /api/student/check-in` - Check in device
- `POST /api/student/check-out` - Check out device

### Dashboard
- `GET /api/dashboard/list` - Get dashboard stats

---

## Database Schema

### Device Table
```
- deviceId (PK)
- ownerId
- ownerName
- deviceType
- serialNumber (unique)
- status (login/logout)
- isBlocked
- qrEncrypted
- timestamps
```

### Student Table
```
- studentId (PK)
- fullName
- email (unique)
- deviceId (FK)
- phone
- password (hashed)
- department
- imageUrl (base64)
- timestamps
```

### SecurityOfficer Table
```
- officerId (PK)
- fullName
- email (unique)
- phone
- password (hashed)
- role (SECURITY)
- isActive
- timestamps
```

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill process
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### QR Code Not Generating
- Ensure `qrcode` package is installed
- Check QR_SECRET in .env
- Verify device exists in database

### Authentication Failing
- Check JWT_SECRET matches across all services
- Verify token is being sent in Authorization header
- Check token expiration (24 hours)

---

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET and QR_SECRET
3. Configure database with production credentials
4. Enable HTTPS
5. Set up proper CORS origins
6. Use environment variables for sensitive data

### Frontend
1. Build for production:
```bash
npm run build
```
2. Deploy dist folder to hosting service
3. Update VITE_BACKEND_URL to production API

### Database
1. Use managed PostgreSQL service
2. Enable backups
3. Set up monitoring
4. Use connection pooling

---

## Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/user/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Test Device List
```bash
curl -X GET http://localhost:5000/api/devices/list
```

### Test QR Generation
```bash
curl -X GET http://localhost:5000/api/qr/generate/DEV001
```

---

## Support & Documentation
- API Documentation: See `backend/API_DOCUMENTATION.md`
- Frontend Components: Check component files for usage
- Database Models: See `backend/models/`

---

## License
Proprietary - All rights reserved
