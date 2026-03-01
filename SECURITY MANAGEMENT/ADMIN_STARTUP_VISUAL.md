# Admin Dashboard - Visual Startup Guide

## 🚀 QUICK START (3 STEPS)

### Step 1️⃣: Start Backend
```
Open Terminal 1
↓
cd "SECURITY MANAGEMENT/backend"
↓
npm run dev
↓
✅ Wait for: "Server running on port 5000"
```

### Step 2️⃣: Start Admin Frontend
```
Open Terminal 2
↓
cd "SECURITY MANAGEMENT/admin"
↓
npm run dev
↓
✅ Wait for: "Local: http://localhost:5173/"
```

### Step 3️⃣: Open Browser
```
Open Browser
↓
Go to: http://localhost:5173
↓
✅ You should see Login Page
```

---

## 📋 LOGIN PAGE

When you open http://localhost:5173, you'll see:

```
┌─────────────────────────────────────┐
│                                     │
│     SECURITY MANAGEMENT SYSTEM      │
│                                     │
│     Admin Login                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  │ admin@example.com           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │
│  │ ••••••••                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ☐ Remember me                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      LOGIN BUTTON           │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Login Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 🎯 AFTER LOGIN - DASHBOARD

You'll see the main dashboard:

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR                    │  MAIN CONTENT              │
│                             │                            │
│  📊 Dashboard               │  Dashboard                 │
│  🖥️  Devices                │  ┌──────────────────────┐  │
│  👥 Students                │  │ Total Devices: 45    │  │
│  👮 Security Officers       │  │ Active: 40           │  │
│  📅 Today's Login           │  │ Blocked: 5           │  │
│  📅 Today's Logout          │  │ Logged Out: 3        │  │
│  🚫 Blocked Devices         │  └──────────────────────┘  │
│  ⚙️  Settings               │                            │
│  🌙 Dark Mode               │  [Charts and Stats]        │
│  🚪 Logout                  │                            │
│                             │                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 MANAGE SECURITY OFFICERS

Click "Security Officers" in sidebar:

```
┌──────────────────────────────────────────────────────────┐
│  Security Officers                                       │
│                                                          │
│  Search: [_______________]  Status: [All ▼]             │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Officer ID │ Name    │ Email      │ Phone │ Status │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ SEC001     │ John    │ john@...   │ 1234  │ Active │ │
│  │ SEC002     │ Jane    │ jane@...   │ 5678  │ Active │ │
│  │ SEC003     │ Bob     │ bob@...    │ 9012  │ Inactive│ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [PDF] [Excel] [Add Security Officer]                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✏️ EDIT SECURITY OFFICER

Click on Officer ID (e.g., "SEC001"):

```
┌──────────────────────────────────────────────────────────┐
│  Edit Security Officer                                   │
│                                                          │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │ Officer Profile │  │ Update Information          │  │
│  │                 │  │                              │  │
│  │ [Avatar]        │  │ Full Name:                   │  │
│  │ John Doe        │  │ [John Doe_____________]      │  │
│  │ Security Officer│  │                              │  │
│  │                 │  │ Email:                       │  │
│  │ ID: SEC001      │  │ [john@example.com_______]    │  │
│  │ Status: Active  │  │                              │  │
│  │ Created: 2026   │  │ Phone:                       │  │
│  │                 │  │ [1234567890_____________]    │  │
│  └─────────────────┘  │                              │  │
│                       │ Officer ID: SEC001 (Read-only)│  │
│                       │                              │  │
│                       │ [Save Changes] [Cancel]      │  │
│                       └──────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📱 RESPONSIVE DESIGN

### Mobile View
```
┌─────────────────┐
│ ☰ Dashboard     │
├─────────────────┤
│                 │
│ [Statistics]    │
│                 │
│ [Menu Items]    │
│                 │
│ 📊 Dashboard    │
│ 🖥️  Devices     │
│ 👥 Students     │
│ 👮 Officers     │
│                 │
└─────────────────┘
```

---

## 🌙 DARK MODE

Toggle dark mode with the moon icon in navbar:

```
Light Mode              Dark Mode
┌──────────────┐       ┌──────────────┐
│ White bg     │  ☀️→🌙 │ Dark bg      │
│ Dark text    │       │ Light text   │
│ Light cards  │       │ Dark cards   │
└──────────────┘       └──────────────┘
```

---

## ⚠️ TROUBLESHOOTING

### Problem: "Cannot connect to backend"
```
❌ Error: Network Error
✅ Solution: 
   1. Check backend is running (Terminal 1)
   2. Check port 5000 is open
   3. Check .env file has correct URL
```

### Problem: "Port 5173 already in use"
```
❌ Error: EADDRINUSE: address already in use :::5173
✅ Solution:
   1. Kill process on port 5173
   2. Or use different port: npm run dev -- --port 5174
```

### Problem: "npm install fails"
```
❌ Error: npm ERR!
✅ Solution:
   1. npm cache clean --force
   2. Delete node_modules folder
   3. npm install again
```

---

## 📊 FEATURES YOU CAN TEST

After login, try these:

✅ **Dashboard**
- View statistics
- See charts
- Check device status

✅ **Devices**
- View all devices
- Edit device info
- Block/unblock devices
- Delete devices
- Set all to logout

✅ **Security Officers**
- View all officers
- Edit officer info
- Enable/disable officers
- Delete officers
- Export to PDF/Excel

✅ **Students**
- View all students
- Register new student
- Edit student info

✅ **Reports**
- Today's logins
- Today's logouts
- Blocked devices

---

## 🎓 NEXT STEPS

1. ✅ Start backend
2. ✅ Start admin frontend
3. ✅ Login with credentials
4. ✅ Explore dashboard
5. ✅ Test edit officer page
6. ✅ Try other features

---

## 📞 NEED HELP?

Check these files:
- `START_ADMIN_GUIDE.md` - Detailed setup
- `README_COMPLETE.md` - Full documentation
- `backend/API_DOCUMENTATION.md` - API details

---

## ✨ YOU'RE ALL SET!

Your admin dashboard is ready to use. Enjoy! 🚀
