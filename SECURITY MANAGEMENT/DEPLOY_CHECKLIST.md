# Deployment Checklist - Security Management System

## Pre-Deployment ✓

- [ ] All code committed to Git
- [ ] `.env` file NOT committed (check `.gitignore`)
- [ ] All tests passing locally
- [ ] Backend runs with `npm run dev`
- [ ] Admin frontend runs with `npm run dev`
- [ ] Security frontend runs with `npm run dev`
- [ ] Student frontend runs with `npm run dev`
- [ ] Database connection working locally
- [ ] Cloudinary credentials verified
- [ ] JWT secret is strong and unique

---

## Backend Deployment (Heroku)

### Setup
- [ ] Heroku CLI installed
- [ ] Logged in to Heroku (`heroku login`)
- [ ] Created Heroku app (`heroku create your-security-backend`)

### Environment Variables Set
- [ ] `PORT=5000`
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=postgresql://...` (Supabase)
- [ ] `JWT_SECRET=your_secret_key`
- [ ] `CLOUDINARY_CLOUD_NAME=dm5rf4yzc`
- [ ] `CLOUDINARY_API_KEY=815842898446983`
- [ ] `CLOUDINARY_API_SECRET=boT09_AFnNUMrNW_LrO2qfLad7g`
- [ ] `QR_SECRET=smart_security_key_123`
- [ ] `ADMIN_EMAIL=security@gmail.com`
- [ ] `ADMIN_PASSWORD=security`

### Deployment
- [ ] Pushed to Heroku: `git push heroku main`
- [ ] Deployment successful (check logs)
- [ ] Backend URL obtained: `https://your-security-backend.herokuapp.com`
- [ ] Health check working: `curl https://your-security-backend.herokuapp.com/api/health`

---

## Admin Frontend Deployment (Vercel)

### Setup
- [ ] Vercel CLI installed
- [ ] Logged in to Vercel (`vercel login`)
- [ ] Project created on Vercel

### Environment Variables Set
- [ ] `VITE_BACKEND_URL=https://your-security-backend.herokuapp.com`

### Deployment
- [ ] Deployed: `vercel --prod`
- [ ] Admin URL obtained: `https://security-admin.vercel.app`
- [ ] Frontend loads without errors
- [ ] Can access login page

---

## Security Frontend Deployment (Vercel)

### Setup
- [ ] Project created on Vercel

### Environment Variables Set
- [ ] `VITE_BACKEND_URL=https://your-security-backend.herokuapp.com`

### Deployment
- [ ] Deployed: `vercel --prod`
- [ ] Security URL obtained: `https://security-officer.vercel.app`
- [ ] Frontend loads without errors
- [ ] Can access login page

---

## Student Frontend Deployment (Vercel)

### Setup
- [ ] Project created on Vercel

### Environment Variables Set
- [ ] `VITE_BACKEND_URL=https://your-security-backend.herokuapp.com`

### Deployment
- [ ] Deployed: `vercel --prod`
- [ ] Student URL obtained: `https://security-student.vercel.app`
- [ ] Frontend loads without errors
- [ ] Can access login page

---

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `curl https://your-security-backend.herokuapp.com/api/health`
- [ ] Database connection working
- [ ] Can create new records
- [ ] Can read records
- [ ] Can update records
- [ ] Can delete records

### Admin Frontend Tests
- [ ] Login with `security@gmail.com` / `security`
- [ ] Dashboard loads
- [ ] Can view devices
- [ ] Can view students
- [ ] Can view security officers
- [ ] Can upload student photo
- [ ] Can generate QR code
- [ ] Can edit device
- [ ] Can block device
- [ ] Can delete device

### Security Frontend Tests
- [ ] Login with officer email and ID
- [ ] Dashboard loads
- [ ] Can view all devices
- [ ] Can view students
- [ ] Can update device status
- [ ] Can block device
- [ ] Can scan QR code
- [ ] Can view today's logins
- [ ] Can view today's logouts

### Student Frontend Tests
- [ ] Login with student credentials
- [ ] Dashboard loads
- [ ] Can check in device
- [ ] Can check out device
- [ ] Can view device status
- [ ] Can scan QR code

### File Upload Tests
- [ ] Upload student photo
- [ ] Photo appears in Cloudinary
- [ ] Photo displays in admin
- [ ] Photo displays in security frontend

### API Tests
- [ ] Login endpoint working
- [ ] Device list endpoint working
- [ ] Student list endpoint working
- [ ] Officer list endpoint working
- [ ] File upload endpoint working
- [ ] QR code generation working

---

## CORS Configuration

- [ ] Backend CORS updated with production URLs
- [ ] Admin URL added to CORS
- [ ] Security URL added to CORS
- [ ] Student URL added to CORS
- [ ] Backend redeployed after CORS update

---

## Database

- [ ] Supabase connection verified
- [ ] All tables created
- [ ] Initial data seeded (if needed)
- [ ] Backups configured
- [ ] Connection pooling enabled

---

## Security

- [ ] JWT secret is strong (min 32 characters)
- [ ] Passwords hashed with bcrypt
- [ ] Rate limiting enabled
- [ ] HTTPS enabled (automatic on Heroku/Vercel)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Environment variables not committed

---

## Monitoring & Logs

- [ ] Heroku logs accessible: `heroku logs --tail`
- [ ] Vercel logs accessible: Vercel dashboard
- [ ] Error tracking setup (optional)
- [ ] Performance monitoring setup (optional)

---

## Documentation

- [ ] README updated with deployment URLs
- [ ] API documentation updated
- [ ] User guide created
- [ ] Admin guide created
- [ ] Security officer guide created
- [ ] Student guide created

---

## Final Verification

- [ ] All three frontends accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] File uploads working
- [ ] QR codes generating
- [ ] Authentication working
- [ ] All features tested
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable

---

## Deployment Complete! 🎉

**Production URLs:**
- Backend: `https://your-security-backend.herokuapp.com`
- Admin: `https://security-admin.vercel.app`
- Security: `https://security-officer.vercel.app`
- Student: `https://security-student.vercel.app`

**Next Steps:**
1. Monitor logs for errors
2. Gather user feedback
3. Plan for scaling if needed
4. Setup automated backups
5. Configure custom domains (optional)
6. Setup monitoring alerts (optional)

---

## Rollback Plan

If something goes wrong:

### Rollback Backend
```bash
heroku releases --app your-security-backend
heroku rollback v1 --app your-security-backend
```

### Rollback Frontend
```bash
vercel rollback
```

---

## Support Contacts

- Heroku Support: https://help.heroku.com
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Cloudinary Support: https://cloudinary.com/support

---

## Notes

Add any deployment-specific notes here:

```
- Deployment Date: ___________
- Deployed By: ___________
- Issues Encountered: ___________
- Resolution: ___________
- Performance Notes: ___________
```
