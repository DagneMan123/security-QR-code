# Quick Reference Guide

## 🚀 Start All Services

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Terminal 2 - Admin Frontend
```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:5173
```

### Terminal 3 - Security/Student Frontend
```bash
cd security-fronend
npm install
npm run dev
# Runs on http://localhost:5174
```

---

## 🔑 Default Credentials

### Admin
- **Email**: admin@example.com
- **Password**: admin123

### Security Officer
- **Officer ID**: (created by admin)
- **Password**: (same as Officer ID initially)

### Student
- **Student ID**: (from device registration)
- **Password**: (same as Student ID initially)

---

## 📋 Common Tasks

### Register a Device
1. Login as Admin
2. Go to "Register Device"
3. Fill in device details
4. Upload owner photo
5. Submit

### Create Security Officer
1. Login as Admin
2. Go to "Manage Security Officers"
3. Click "Add Officer"
4. Fill in officer details
5. Officer ID becomes default password

### Student Check-in
1. Login as Student
2. Click "Check In Device"
3. Or scan QR code
4. Device status updates to "CHECKED IN"

### View QR Code
1. Login as Admin
2. Go to Device List
3. Click device
4. Click "Generate QR"
5. Download or Print

---

## 🔌 API Quick Test

### Admin Login
```bash
curl -X POST http://localhost:5000/api/user/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### List Devices
```bash
curl -X GET http://localhost:5000/api/devices/list
```

### Generate QR Code
```bash
curl -X GET http://localhost:5000/api/qr/generate/DEV001
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/list
```

---

## 📁 Important Files

### Backend
- `server.js` - Main server file
- `routes/` - API endpoints
- `controllers/` - Business logic
- `models/` - Database models
- `middleware/` - Auth, errors, rate limiting
- `utils/` - Crypto, validation, logging

### Admin Frontend
- `App.jsx` - Main app component
- `pages/` - Page components
- `components/` - Reusable components
- `context/` - React context

### Security Frontend
- `App.jsx` - Main app component
- `pages/` - Page components
- `components/` - Reusable components

---

## 🔐 Security Checklist

- ✅ JWT authentication enabled
- ✅ Password hashing with bcrypt
- ✅ Rate limiting active
- ✅ CORS configured
- ✅ Input validation enabled
- ✅ Audit logging active
- ✅ QR encryption enabled
- ✅ Error handling middleware

---

## 📊 Database

### Connect to PostgreSQL
```bash
psql -U postgres -d security_db
```

### View Tables
```sql
\dt
```

### Check Devices
```sql
SELECT * FROM "Devices";
```

### Check Students
```sql
SELECT * FROM "Students";
```

### Check Officers
```sql
SELECT * FROM "SecurityOfficers";
```

---

## 🐛 Common Issues

### Port 5000 in use
```bash
# Find process
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Database connection error
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Features by Role

### Admin
- ✅ Dashboard with analytics
- ✅ Device management
- ✅ Student management
- ✅ Officer management
- ✅ QR code generation
- ✅ Device blocking
- ✅ View reports

### Security Officer
- ✅ Dashboard
- ✅ View all devices
- ✅ View all students
- ✅ Block devices
- ✅ Scan QR codes
- ✅ View today's activity
- ✅ Profile management

### Student
- ✅ Check-in device
- ✅ Check-out device
- ✅ View device status
- ✅ Scan QR code
- ✅ View profile
- ✅ Change password

---

## 🎯 Workflow

### Device Registration Flow
```
Admin → Register Device → Upload Photo → Generate QR → Device Active
```

### Student Check-in Flow
```
Student Login → Check-in → Device Status: LOGIN → Confirmed
```

### Officer Monitoring Flow
```
Officer Login → View Devices → Monitor Status → Block if needed
```

---

## 📞 Support Resources

1. **API_DOCUMENTATION.md** - API reference
2. **SETUP_GUIDE.md** - Installation guide
3. **FEATURES_IMPLEMENTED.md** - Feature list
4. **COMPLETE_README.md** - Full documentation

---

## ⚡ Performance Tips

- Use pagination for large datasets
- Cache frequently accessed data
- Optimize database queries
- Use indexes on common fields
- Monitor rate limiting

---

## 🔄 Update Workflow

1. Make changes to code
2. Test locally
3. Commit to git
4. Deploy to production
5. Monitor logs

---

## 📈 Monitoring

### Check Backend Logs
```bash
# Terminal where backend is running
# Look for errors and warnings
```

### Check Frontend Console
```
Browser DevTools → Console tab
```

### Database Monitoring
```bash
# Connect to database
psql -U postgres -d security_db
# Run queries to check data
```

---

## 🎓 Learning Resources

- **JWT**: https://jwt.io
- **Sequelize**: https://sequelize.org
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Express**: https://expressjs.com

---

## 📝 Notes

- Default password for new officers is their Officer ID
- Default password for students is their Student ID
- QR codes are encrypted with AES-128-CBC
- Tokens expire after 24 hours
- Rate limiting: 5 login attempts per 15 minutes

---

**Last Updated**: February 2026
**Version**: 1.0.0
