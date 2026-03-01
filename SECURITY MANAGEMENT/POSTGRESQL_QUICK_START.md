# PostgreSQL Quick Start - 10 Minutes

## Step 1: Install PostgreSQL (5 minutes)

### Windows
- Download: https://www.postgresql.org/download/windows/
- Run installer
- Remember the password for `postgres` user
- Default port: 5432

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Database (2 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE security_db;

# Exit
\q
```

---

## Step 3: Update .env (1 minute)

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=smart_security_jwt_secret_key_12345
ADMIN_EMAIL=security@gmail.com
ADMIN_PASSWORD=security
QR_SECRET=smart_security_key_123
```

**Change `DB_PASSWORD` to your PostgreSQL password**

---

## Step 4: Install & Run Backend (2 minutes)

```bash
cd backend
npm install
npm run dev
```

You should see:
```
[nodemon] starting `node server.js`
Server running on port 5000
```

✅ Backend is running!

---

## Step 5: Start Frontends (New Terminals)

### Admin Frontend
```bash
cd admin
npm install
npm run dev
```

Access: http://localhost:5173

### Security/Student Frontend
```bash
cd security-fronend
npm install
npm run dev
```

Access: http://localhost:5174

---

## Step 6: Login

### Admin Dashboard
- Email: security@gmail.com
- Password: security

---

## ✅ Done!

All three services are running:
- Backend: http://localhost:5000
- Admin: http://localhost:5173
- Security: http://localhost:5174

---

## Troubleshooting

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

Check .env file:
- DB_HOST: localhost
- DB_PORT: 5432
- DB_NAME: security_db
- DB_USER: postgres
- DB_PASSWORD: (your password)

### Database Not Found?

Create it:
```bash
psql -U postgres
CREATE DATABASE security_db;
\q
```

---

## Next Steps

1. ✅ Create test device
2. ✅ Generate QR code
3. ✅ Test student check-in/out
4. ✅ Explore all features
5. ✅ Deploy to production

---

**Status**: Ready to Go ✅
