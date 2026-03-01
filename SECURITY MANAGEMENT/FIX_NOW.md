# Fix Now - Complete Solution

## Problem
Old PostgreSQL packages still in node_modules. Need to clean and reinstall with SQLite.

## Solution - Follow These Steps

### Step 1: Clean Old Dependencies

**Option A: Using Command Prompt**
```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
```

**Option B: Using PowerShell**
```powershell
cd backend
Remove-Item -Recurse -Force "node_modules"
Remove-Item "package-lock.json"
```

**Option C: Using Batch File**
```bash
cd backend
CLEANUP.bat
```

### Step 2: Verify package.json

Make sure your `backend/package.json` has:
- ✅ `sqlite3` in dependencies
- ❌ NO `pg` or `pg-hstore`
- ❌ NO `mongoose`

### Step 3: Verify .env

Make sure your `backend/.env` has:
```env
DB_DIALECT="sqlite"
DB_STORAGE="./database.sqlite"
JWT_SECRET="smart_security_jwt_secret_key_12345"
ADMIN_EMAIL="security@gmail.com"
ADMIN_PASSWORD="security"
QR_SECRET="smart_security_key_123"
PORT=5000
NODE_ENV=development
```

### Step 4: Reinstall Dependencies
```bash
cd backend
npm install
```

### Step 5: Start Backend
```bash
npm run dev
```

You should see:
```
[nodemon] starting `node server.js`
Server running on port 5000
```

---

## Complete Commands (Copy & Paste)

### Windows Command Prompt
```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### Windows PowerShell
```powershell
cd backend
Remove-Item -Recurse -Force "node_modules"
Remove-Item "package-lock.json"
npm install
npm run dev
```

### macOS/Linux
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Verify Installation

After `npm install`, you should see:
- ✅ `sqlite3` installed
- ✅ `qrcode` installed
- ✅ `sequelize` installed
- ❌ NO `pg` or `pg-hstore`

Check with:
```bash
npm list sqlite3
npm list qrcode
```

---

## If Still Having Issues

### Check package.json
```bash
cat package.json
```

Should show:
```json
"dependencies": {
  "sqlite3": "^5.1.6",
  "qrcode": "^1.5.4",
  ...
}
```

### Check .env
```bash
cat .env
```

Should show:
```
DB_DIALECT="sqlite"
DB_STORAGE="./database.sqlite"
```

### Clear npm Cache
```bash
npm cache clean --force
npm install
```

---

## Expected Output

When you run `npm run dev`, you should see:

```
[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
[dotenv@17.2.3] injecting env (8) from .env
Server running on port 5000
```

✅ If you see this, backend is working!

---

## Next Steps

1. ✅ Clean old dependencies
2. ✅ Reinstall with `npm install`
3. ✅ Start backend with `npm run dev`
4. ✅ Start admin frontend
5. ✅ Start security frontend
6. ✅ Access http://localhost:5173

---

## Support

If you still have issues:
1. Check `FIXES_APPLIED.md`
2. Check `INSTALL_AND_RUN.md`
3. Check error message carefully
4. Try clearing npm cache: `npm cache clean --force`

---

**Status**: Ready to Fix ✅
