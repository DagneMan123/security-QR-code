# Quick Deployment Guide - Security Management System

## Your Current Setup
- **Database**: Supabase PostgreSQL ✓
- **Backend**: Node.js + Express
- **Frontends**: React + Vite (Admin, Security, Student)
- **File Storage**: Cloudinary ✓

---

## Step 1: Prepare Backend for Deployment

### 1.1 Update Backend .env for Production

Your current `.env` has sensitive data. Create a production version:

```env
PORT=5000
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://postgres.hivoyfmrydfzrelpzufp:MYlove8@1@@1@aws-1-eu-west-1.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=smart_security_jwt_secret_key_12345

# Cloudinary
CLOUDINARY_CLOUD_NAME=dm5rf4yzc
CLOUDINARY_API_KEY=815842898446983
CLOUDINARY_API_SECRET=boT09_AFnNUMrNW_LrO2qfLad7g

# QR Code
QR_SECRET=smart_security_key_123

# Admin Credentials
ADMIN_EMAIL=security@gmail.com
ADMIN_PASSWORD=security
```

### 1.2 Update Backend CORS for Production

Edit `SECURITY MANAGEMENT/backend/server.js`:

Find the CORS configuration and update it:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://your-admin-frontend.vercel.app',
    'https://your-security-frontend.vercel.app',
    'https://your-student-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

app.use(cors(corsOptions));
```

---

## Step 2: Deploy Backend to Heroku

### 2.1 Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows - Download from https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2.2 Login to Heroku

```bash
heroku login
```

### 2.3 Create Heroku App

```bash
cd "SECURITY MANAGEMENT/backend"
heroku create your-security-backend
```

Replace `your-security-backend` with your desired app name.

### 2.4 Add Heroku Remote to Git

```bash
git remote add heroku https://git.heroku.com/your-security-backend.git
```

### 2.5 Set Environment Variables on Heroku

```bash
heroku config:set PORT=5000 --app your-security-backend
heroku config:set NODE_ENV=production --app your-security-backend
heroku config:set DATABASE_URL="postgresql://postgres.hivoyfmrydfzrelpzufp:MYlove8@1@@1@aws-1-eu-west-1.pooler.supabase.com:6543/postgres" --app your-security-backend
heroku config:set JWT_SECRET="smart_security_jwt_secret_key_12345" --app your-security-backend
heroku config:set CLOUDINARY_CLOUD_NAME="dm5rf4yzc" --app your-security-backend
heroku config:set CLOUDINARY_API_KEY="815842898446983" --app your-security-backend
heroku config:set CLOUDINARY_API_SECRET="boT09_AFnNUMrNW_LrO2qfLad7g" --app your-security-backend
heroku config:set QR_SECRET="smart_security_key_123" --app your-security-backend
heroku config:set ADMIN_EMAIL="security@gmail.com" --app your-security-backend
heroku config:set ADMIN_PASSWORD="security" --app your-security-backend
```

### 2.6 Deploy Backend

```bash
cd "SECURITY MANAGEMENT/backend"
git push heroku main
```

Wait for deployment to complete. You'll see:
```
remote: -----> Build succeeded!
remote: -----> Discovering process types
remote: -----> Compressing...
remote: -----> Launching...
```

### 2.7 Get Backend URL

```bash
heroku apps:info your-security-backend
```

Your backend URL will be: `https://your-security-backend.herokuapp.com`

---

## Step 3: Deploy Admin Frontend to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Deploy Admin Frontend

```bash
cd "SECURITY MANAGEMENT/admin"
vercel
```

Follow the prompts:
- Project name: `security-admin`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 3.4 Set Environment Variables

After deployment, go to Vercel dashboard:
1. Select your project
2. Go to Settings → Environment Variables
3. Add:
   ```
   VITE_BACKEND_URL=https://your-security-backend.herokuapp.com
   ```

### 3.5 Redeploy with Environment Variables

```bash
vercel --prod
```

Your admin frontend URL: `https://security-admin.vercel.app`

---

## Step 4: Deploy Security Frontend to Vercel

### 4.1 Deploy Security Frontend

```bash
cd "SECURITY MANAGEMENT/security-fronend"
vercel
```

Follow the prompts:
- Project name: `security-officer`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 4.2 Set Environment Variables

In Vercel dashboard:
```
VITE_BACKEND_URL=https://your-security-backend.herokuapp.com
```

### 4.3 Redeploy

```bash
vercel --prod
```

Your security frontend URL: `https://security-officer.vercel.app`

---

## Step 5: Deploy Student Frontend to Vercel

### 5.1 Deploy Student Frontend

```bash
cd "SECURITY MANAGEMENT/student-frontend"
vercel
```

Follow the prompts:
- Project name: `security-student`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 5.2 Set Environment Variables

In Vercel dashboard:
```
VITE_BACKEND_URL=https://your-security-backend.herokuapp.com
```

### 5.3 Redeploy

```bash
vercel --prod
```

Your student frontend URL: `https://security-student.vercel.app`

---

## Step 6: Verify Everything Works

### 6.1 Test Backend API

```bash
curl https://your-security-backend.herokuapp.com/api/health
```

Should return: `{"status":"ok"}`

### 6.2 Test Admin Login

1. Go to `https://security-admin.vercel.app`
2. Login with:
   - Email: `security@gmail.com`
   - Password: `security`

### 6.3 Test Security Officer Login

1. Go to `https://security-officer.vercel.app`
2. Login with:
   - Email: `aster@gmail.com` (or your officer email)
   - Officer ID: `123` (or your officer ID)

### 6.4 Test Student Login

1. Go to `https://security-student.vercel.app`
2. Login with student credentials

### 6.5 Test File Upload

1. Try uploading a student photo
2. Verify it appears in Cloudinary dashboard

---

## Step 7: Update CORS in Backend (Important!)

After getting your frontend URLs, update backend CORS:

Edit `SECURITY MANAGEMENT/backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://security-admin.vercel.app',
    'https://security-officer.vercel.app',
    'https://security-student.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};
```

Then redeploy backend:

```bash
cd "SECURITY MANAGEMENT/backend"
git add .
git commit -m "Update CORS for production URLs"
git push heroku main
```

---

## Deployment Summary

| Component | URL | Status |
|-----------|-----|--------|
| Backend API | `https://your-security-backend.herokuapp.com` | ✓ |
| Admin Frontend | `https://security-admin.vercel.app` | ✓ |
| Security Frontend | `https://security-officer.vercel.app` | ✓ |
| Student Frontend | `https://security-student.vercel.app` | ✓ |
| Database | Supabase PostgreSQL | ✓ |
| File Storage | Cloudinary | ✓ |

---

## Troubleshooting

### Backend Not Starting on Heroku

```bash
# Check logs
heroku logs --tail --app your-security-backend

# Check if database connection is working
heroku run "node -e \"console.log(process.env.DATABASE_URL)\"" --app your-security-backend
```

### Frontend Shows Blank Page

1. Check browser console (F12)
2. Verify `VITE_BACKEND_URL` is set correctly
3. Check that backend is running
4. Clear browser cache

### CORS Errors

1. Verify frontend URL is in backend CORS list
2. Redeploy backend after updating CORS
3. Check that Authorization header is being sent

### Database Connection Error

1. Verify DATABASE_URL is correct
2. Check Supabase is running
3. Test connection locally first

### File Upload Not Working

1. Verify Cloudinary credentials
2. Check file size (max 5MB)
3. Verify CORS on Cloudinary

---

## Important Notes

⚠️ **Security Reminders:**
- Never commit `.env` files to Git
- Use strong JWT secrets in production
- Enable HTTPS (Heroku/Vercel do this automatically)
- Regularly update dependencies
- Monitor logs for errors
- Backup database regularly

---

## Next Steps

1. ✓ Deploy backend to Heroku
2. ✓ Deploy frontends to Vercel
3. ✓ Update CORS with production URLs
4. ✓ Test all features
5. Setup monitoring (optional)
6. Setup automated backups (optional)
7. Configure custom domain (optional)

---

## Support

If you encounter issues:
1. Check Heroku logs: `heroku logs --tail`
2. Check Vercel logs: Vercel dashboard → Deployments
3. Check browser console: F12 → Console tab
4. Verify environment variables are set correctly

Good luck with your deployment! 🚀
