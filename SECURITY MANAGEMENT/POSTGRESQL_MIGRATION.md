# PostgreSQL Migration - Complete

## Changes Made

### 1. ✅ Updated package.json

**Removed:**
- `sqlite3`

**Added:**
- `pg` (PostgreSQL driver)
- `pg-hstore` (PostgreSQL data types)

**Current Dependencies:**
```json
{
  "bcrypt": "^6.0.0",
  "cloudinary": "^2.8.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "multer": "^2.0.2",
  "pg": "^8.16.3",
  "pg-hstore": "^2.3.4",
  "qrcode": "^1.5.4",
  "sequelize": "^6.37.7",
  "validator": "^13.15.23"
}
```

### 2. ✅ Updated config/db.js

**Before (SQLite):**
```javascript
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false
});
```

**After (PostgreSQL):**
```javascript
const sequelize = new Sequelize(
    process.env.DB_NAME || "security_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false
    }
);
```

### 3. ✅ Updated .env

**Before (SQLite):**
```env
DB_DIALECT="sqlite"
DB_STORAGE="./database.sqlite"
```

**After (PostgreSQL):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## Setup Steps

### 1. Install PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Run installer
- Remember password

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE security_db;
\q
```

### 3. Update .env

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Clean & Reinstall

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Database Schema

Sequelize will auto-create these tables:

### Device
```sql
CREATE TABLE "Devices" (
  "deviceId" VARCHAR(255) PRIMARY KEY,
  "ownerId" VARCHAR(255) NOT NULL,
  "ownerName" VARCHAR(255),
  "deviceType" VARCHAR(255),
  "serialNumber" VARCHAR(255) UNIQUE NOT NULL,
  "status" VARCHAR(255) DEFAULT 'login',
  "isBlocked" BOOLEAN DEFAULT false,
  "isLoggedOut" BOOLEAN DEFAULT false,
  "qrEncrypted" TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Student
```sql
CREATE TABLE "Students" (
  "studentId" VARCHAR(255) PRIMARY KEY,
  "imageUrl" TEXT NOT NULL,
  "fullName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "deviceId" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "department" VARCHAR(255),
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  FOREIGN KEY ("deviceId") REFERENCES "Devices"("deviceId")
);
```

### SecurityOfficer
```sql
CREATE TABLE "SecurityOfficers" (
  "officerId" VARCHAR(255) PRIMARY KEY,
  "fullName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) DEFAULT 'SECURITY',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

---

## Verification

### Check Connection

```bash
psql -U postgres -d security_db
```

### List Tables

```bash
psql -U postgres -d security_db -c "\dt"
```

### Check Backend Logs

When backend starts, you should see:
```
[nodemon] starting `node server.js`
Server running on port 5000
```

---

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Start PostgreSQL service

### Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution**: Check DB_PASSWORD in .env matches PostgreSQL password

### Database Does Not Exist
```
Error: database "security_db" does not exist
```
**Solution**: Create database with `CREATE DATABASE security_db;`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5432
```
**Solution**: PostgreSQL already running or change port in .env

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d security_db

# List all databases
\l

# Connect to database
\c security_db

# List all tables
\dt

# Describe table
\d "Devices"

# Run SQL query
SELECT * FROM "Devices";

# Exit
\q

# Backup database
pg_dump -U postgres security_db > backup.sql

# Restore database
psql -U postgres security_db < backup.sql

# Drop database
DROP DATABASE security_db;

# Create user
CREATE USER security_user WITH PASSWORD 'password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE security_db TO security_user;
```

---

## Benefits of PostgreSQL

✅ Production-ready database
✅ Scalable for large datasets
✅ Advanced features (JSON, arrays, etc.)
✅ Better performance than SQLite
✅ Multi-user support
✅ Transaction support
✅ Backup and recovery tools
✅ Replication support
✅ Security features

---

## Migration Complete

All files have been updated to use PostgreSQL with Sequelize.

**Status**: Ready to Setup ✅

---

## Next Steps

1. Install PostgreSQL
2. Create database
3. Update .env
4. Run `npm install`
5. Run `npm run dev`
6. Start frontends
7. Access http://localhost:5173

---

**Documentation:**
- POSTGRESQL_SETUP.md - Complete setup guide
- POSTGRESQL_QUICK_START.md - 10-minute quick start
- SETUP_POSTGRESQL.txt - Quick reference

---

**Status**: MIGRATION COMPLETE ✅
