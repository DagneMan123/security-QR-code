# Security Management System - Deployment Guide

## Project Overview
This is a full-stack security management system with:
- **Backend**: Node.js + Express + PostgreSQL (Sequelize ORM)
- **Admin Frontend**: React + Vite + Tailwind CSS
- **Security Frontend**: React + Vite + Tailwind CSS
- **Student Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **File Storage**: Cloudinary
- **Authentication**: JWT

---

## Prerequisites

Before deploying, ensure you have:
- Node.js (v16 or higher)
- PostgreSQL database (or Supabase account)
- Cloudinary account (for image uploads)
- Git
- A hosting platform (Vercel, Netlify, Heroku, AWS, DigitalOcean, etc.)

---

## Part 1: Backend Deployment

### Option A: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd SECURITY\ MANAGEMENT/backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your_postgresql_url
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   heroku config:set QR_SECRET=your_qr_secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option B: Deploy to DigitalOcean App Platform

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Select your GitHub repo
   - Choose the backend folder

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Set Environment Variables** in DigitalOcean dashboard

4. **Deploy** - DigitalOcean will auto-deploy on push

### Option C: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier eligible)

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql-client
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd SECURITY\ MANAGEMENT/backend
   npm install
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Add all environment variables
   ```

6. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "security-backend"
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Part 2: Frontend Deployment

### Option A: Deploy Admin Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd SECURITY\ MANAGEMENT/admin
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, add `VITE_BACKEND_URL=your-backend-url`

4. **Set Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option B: Deploy to Netlify

1. **Connect GitHub**
   - Go to Netlify
   - Connect your GitHub repo
   - Select admin folder

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment: `VITE_BACKEND_URL=your-backend-url`

3. **Deploy** - Netlify auto-deploys on push

### Option C: Deploy to AWS S3 + CloudFront

1. **Build the Project**
   ```bash
   cd SECURITY\ MANAGEMENT/admin
   npm run build
   ```

2. **Create S3 Bucket**
   - AWS Console → S3 → Create Bucket
   - Enable Static Website Hosting
   - Upload `dist` folder contents

3. **Setup CloudFront Distribution**
   - Create distribution pointing to S3 bucket
   - Set default root object to `index.html`

4. **Configure Error Handling**
   - Error 404 → index.html (for SPA routing)

---

## Part 3: Database Setup

### Using Supabase (Recommended)

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Copy connection string

2. **Update Backend .env**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Run Migrations** (if needed)
   ```bash
   cd backend
   npm run migrate
   ```

### Using PostgreSQL Locally

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt install postgresql postgresql-contrib
   ```

2. **Create Database**
   ```bash
   createdb security_management
   ```

3. **Update .env**
   ```
   DATABASE_URL=postgresql://localhost/security_management
   ```

---

## Part 4: Environment Variables Checklist

### Backend (.env)
```
PORT=5000
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
QR_SECRET=your_qr_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

### Admin Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url.com
```

### Security Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url.com
```

### Student Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## Part 5: Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Cloudinary account setup and credentials added
- [ ] JWT secret is strong and secure
- [ ] CORS configured for frontend URLs
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Database backups configured
- [ ] Monitoring/logging setup

---

## Part 6: Post-Deployment Testing

1. **Test Backend API**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Admin Login**
   - Navigate to admin frontend
   - Login with admin credentials

3. **Test Security Officer Login**
   - Navigate to security frontend
   - Login with security officer credentials

4. **Test Student Login**
   - Navigate to student frontend
   - Login with student credentials

5. **Test File Uploads**
   - Upload student photo
   - Verify in Cloudinary

6. **Test QR Code Generation**
   - Generate QR code
   - Scan and verify

---

## Part 7: Monitoring & Maintenance

### Setup Monitoring
- Use PM2 Plus for Node.js monitoring
- Setup error tracking (Sentry)
- Configure database backups
- Monitor server resources

### Regular Maintenance
- Update dependencies monthly
- Review logs for errors
- Backup database weekly
- Monitor API performance
- Update security patches

---

## Part 8: Scaling Considerations

### For High Traffic
1. **Database**: Use read replicas
2. **Backend**: Use load balancer (Nginx, HAProxy)
3. **Frontend**: Use CDN (CloudFront, Cloudflare)
4. **Caching**: Implement Redis
5. **Storage**: Use S3 for file storage

### Performance Optimization
- Enable gzip compression
- Minify frontend assets
- Implement database indexing
- Use connection pooling
- Cache API responses

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
pm2 logs security-backend

# Verify environment variables
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL
```

### Frontend Shows Blank Page
- Check browser console for errors
- Verify VITE_BACKEND_URL is correct
- Clear browser cache
- Check CORS settings on backend

### Database Connection Error
- Verify DATABASE_URL format
- Check database is running
- Verify credentials
- Check firewall rules

### File Upload Not Working
- Verify Cloudinary credentials
- Check file size limits
- Verify CORS on Cloudinary
- Check multer configuration

---

## Support & Resources

- Backend: Express.js docs
- Frontend: React & Vite docs
- Database: PostgreSQL & Sequelize docs
- Hosting: Platform-specific documentation
- Cloudinary: Image management docs

---

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets**
3. **Enable HTTPS/SSL**
4. **Implement rate limiting**
5. **Validate all inputs**
6. **Use environment variables for secrets**
7. **Regular security audits**
8. **Keep dependencies updated**
9. **Monitor for suspicious activity**
10. **Implement proper logging**

---

## Quick Start Commands

### Local Development
```bash
# Backend
cd SECURITY\ MANAGEMENT/backend
npm install
npm run dev

# Admin Frontend (new terminal)
cd SECURITY\ MANAGEMENT/admin
npm install
npm run dev

# Security Frontend (new terminal)
cd SECURITY\ MANAGEMENT/security-fronend
npm install
npm run dev

# Student Frontend (new terminal)
cd SECURITY\ MANAGEMENT/student-frontend
npm install
npm run dev
```

### Production Build
```bash
# Backend - no build needed, runs directly

# Admin Frontend
cd SECURITY\ MANAGEMENT/admin
npm run build
# Output: dist/

# Security Frontend
cd SECURITY\ MANAGEMENT/security-fronend
npm run build
# Output: dist/

# Student Frontend
cd SECURITY\ MANAGEMENT/student-frontend
npm run build
# Output: dist/
```

---

## Contact & Support

For deployment issues or questions, refer to the specific platform documentation or contact your hosting provider's support team.
