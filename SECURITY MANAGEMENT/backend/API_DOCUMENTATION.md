# Security Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Authentication

### Admin Login
**POST** `/user/admin`
```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "data": {
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Officer Login
**POST** `/user/officer`
```json
{
  "email": "officer@example.com",
  "password": "password"
}
```

### Student Login
**POST** `/student/login`
```json
{
  "studentId": "STU001",
  "password": "password"
}
```

---

## Device Management

### Register Device
**POST** `/devices/add`
- Multipart form data with photo
```
deviceId: "DEV001"
ownerId: "STU001"
studentName: "John Doe"
studentEmail: "john@example.com"
pcType: "laptop"
serialNumber: "SN123456"
department: "Computer Science"
phone: "1234567890"
ownerPhoto: <file>
```

### List All Devices
**GET** `/devices/list`
**Response:**
```json
{
  "success": true,
  "devices": [
    {
      "deviceId": "DEV001",
      "ownerId": "STU001",
      "ownerName": "John Doe",
      "deviceType": "laptop",
      "serialNumber": "SN123456",
      "status": "login",
      "isBlocked": false,
      "Student": { ... }
    }
  ]
}
```

### Get Single Device
**GET** `/devices/single`
```json
{
  "deviceId": "DEV001"
}
```

### Get Device by Owner
**GET** `/devices/by-owner/:ownerId`

### Update Device Status
**PATCH** `/devices/update/:deviceId/status`
```json
{
  "status": "login" // or "logout"
}
```

### Toggle Device Block Status
**PATCH** `/devices/update/:deviceId/block`
```json
{
  "isBlocked": true
}
```

### Block Device (Officer)
**PATCH** `/devices/officer/:deviceId/block`
- Requires security officer role

### Update Device Info
**PUT** `/devices/update/:deviceId`
```json
{
  "ownerId": "STU001",
  "ownerName": "John Doe",
  "serialNumber": "SN123456",
  "pcType": "laptop",
  "status": "login",
  "phone": "1234567890",
  "email": "john@example.com",
  "department": "CS"
}
```

### Delete Device
**DELETE** `/devices/:deviceId`
- Requires admin role

### Decrypt QR Code
**POST** `/devices/decrypt`
```json
{
  "qrData": "encrypted_qr_data"
}
```

### Get Today's Info
**GET** `/devices/today-info`
- Returns today's login/logout counts

### Get Blocked Devices
**GET** `/devices/block-info`

---

## QR Code Management

### Generate QR Code
**GET** `/qr/generate/:deviceId`
**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "DEV001",
    "qrCode": "data:image/png;base64,...",
    "qrEncrypted": "encrypted_data"
  }
}
```

### Validate QR Code
**POST** `/qr/validate`
```json
{
  "qrData": "encrypted_qr_data",
  "deviceId": "DEV001"
}
```

---

## Security Officer Management

### List Officers
**GET** `/officer/list`
- Requires admin role

### Add Officer
**POST** `/officer/add`
- Requires admin role
```json
{
  "officerId": "OFF001",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210"
}
```

### Get Officer Profile
**GET** `/officer/profile`
- Requires security officer role

### Update Officer Status
**PATCH** `/officer/:officerId/status`
- Requires admin role
```json
{
  "isActive": true
}
```

### Update Officer Info
**PUT** `/officer/:officerId`
- Requires admin role
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210"
}
```

### Change Password
**PATCH** `/officer/change-password`
- Requires security officer role
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Update Profile
**PATCH** `/officer/update-profile`
- Requires security officer role
```json
{
  "fullName": "Jane Smith",
  "phone": "9876543210",
  "officerId": "OFF001"
}
```

### Delete Officer
**DELETE** `/officer/:officerId`
- Requires admin role

---

## Student Management

### List Students
**GET** `/student/list`

### Student Profile
**GET** `/student/profile`
- Requires student authentication

### Check In Device
**POST** `/student/check-in`
- Requires student authentication
```json
{
  "qrData": "optional_qr_data"
}
```

### Check Out Device
**POST** `/student/check-out`
- Requires student authentication

---

## Dashboard

### Get Dashboard Stats
**GET** `/dashboard/list`
**Response:**
```json
{
  "success": true,
  "data": {
    "totalDevices": 50,
    "totalStudents": 50,
    "blockedDevices": 5,
    "activeDevices": 45,
    "loginsToday": 40,
    "logoutsToday": 35,
    "recentActivity": [...],
    "labels": ["2024-01-01", ...],
    "loginsData": [10, 15, 20, ...],
    "logoutsData": [8, 12, 18, ...]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Rate Limiting
- Login endpoints: 5 attempts per 15 minutes
- API endpoints: 100 requests per 15 minutes

---

## Environment Variables Required
```
PORT=5000
JWT_SECRET=your_secret_key
QR_SECRET=your_qr_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=password
```
