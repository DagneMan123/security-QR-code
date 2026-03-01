# PostgreSQL Setup Guide

## Prerequisites

- PostgreSQL installed on your system
- pgAdmin (optional, for GUI management)

---

## Installation

### Windows

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Follow the installation wizard
4. Remember the password you set for the `postgres` user
5. Default port is 5432

### macOS

```bash
# Using Homebrew
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

## Create Database

### Using Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE security_db;

# Create user (optional, if you want a different user)
CREATE USER security_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE security_db TO security_user;

# Exit
\q
```

### Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click on "Databases"
3. Click "Create" → "Database"
4. Name: `security_db`
5. Click "Save"

---

## Update .env File

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

**Replace:**
- `DB_PASSWORD` with your PostgreSQL password
- `DB_USER` with your PostgreSQL username (default: postgres)

---

## Verify Connection

### Test Connection

```bash
# Connect to database
psql -U postgres -d security_db -h localhost

# You should see:
# psql (15.0)
# Type "help" for help.
# security_db=#

# Exit
\q
```

### Check Tables

```bash
psql -U postgres -d security_db

# List tables
\dt

# Exit
\q
```

---

## Start Backend

```bash
cd backend
npm install
npm run dev
```

The backend will:
1. Connect to PostgreSQL
2. Auto-create tables using Sequelize
3. Start on port 5000

---

## Troubleshooting

### Connection Refused

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**: 
- Make sure PostgreSQL is running
- Check port 5432 is correct
- Verify DB_HOST is correct

### Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solution**:
- Check DB_PASSWORD in .env
- Verify PostgreSQL password
- Reset password if needed:

```bash
psql -U postgres

ALTER USER postgres WITH PASSWORD 'new_password';

\q
```

### Database Does Not Exist

**Error**: `database "security_db" does not exist`

**Solution**:
- Create database: `CREATE DATABASE security_db;`
- Or use pgAdmin to create it

### Port Already in Use

**Error**: `listen EADDRINUSE: address already in use :::5432`

**Solution**:
- PostgreSQL is already running
- Or another service is using port 5432
- Change port in .env if needed

---

## Useful Commands

### Start PostgreSQL

```bash
# Windows
# Use Services app or:
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Stop PostgreSQL

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" stop

# macOS
brew services stop postgresql@15

# Linux
sudo systemctl stop postgresql
```

### Connect to Database

```bash
psql -U postgres -d security_db
```

### List Databases

```bash
psql -U postgres -l
```

### List Tables

```bash
psql -U postgres -d security_db -c "\dt"
```

### Backup Database

```bash
pg_dump -U postgres security_db > backup.sql
```

### Restore Database

```bash
psql -U postgres security_db < backup.sql
```

---

## pgAdmin (GUI Tool)

### Installation

1. Download from: https://www.pgadmin.org/download/
2. Install and run
3. Access at: http://localhost:5050

### Connect to Server

1. Right-click "Servers"
2. Click "Register" → "Server"
3. Name: `Local`
4. Host: `localhost`
5. Port: `5432`
6. Username: `postgres`
7. Password: (your password)
8. Click "Save"

---

## Database Schema

The system will auto-create these tables:

### Device
- deviceId (PK)
- ownerId
- ownerName
- deviceType
- serialNumber (unique)
- status
- isBlocked
- qrEncrypted
- timestamps

### Student
- studentId (PK)
- fullName
- email (unique)
- deviceId (FK)
- phone
- password
- department
- imageUrl
- timestamps

### SecurityOfficer
- officerId (PK)
- fullName
- email (unique)
- phone
- password
- role
- isActive
- timestamps

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Update .env file
4. ✅ Run `npm install` in backend
5. ✅ Run `npm run dev` in backend
6. ✅ Backend will auto-create tables
7. ✅ Start frontends
8. ✅ Access http://localhost:5173

---

## Support

For PostgreSQL help:
- Official Docs: https://www.postgresql.org/docs/
- pgAdmin Docs: https://www.pgadmin.org/docs/
- Stack Overflow: Tag `postgresql`

---

**Status**: Ready to Setup ✅
