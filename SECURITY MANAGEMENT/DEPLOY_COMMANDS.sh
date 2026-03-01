#!/bin/bash

# Security Management System - Deployment Commands
# Copy and paste these commands one by one

echo "=========================================="
echo "Security Management System - Deployment"
echo "=========================================="

# ==========================================
# STEP 1: BACKEND DEPLOYMENT (HEROKU)
# ==========================================

echo ""
echo "STEP 1: Backend Deployment to Heroku"
echo "=========================================="

# 1.1 Install Heroku CLI (if not installed)
echo "Installing Heroku CLI..."
# brew tap heroku/brew && brew install heroku  # macOS
# choco install heroku-cli  # Windows

# 1.2 Login to Heroku
echo "Logging in to Heroku..."
heroku login

# 1.3 Create Heroku App
echo "Creating Heroku app..."
heroku create your-security-backend

# 1.4 Set Environment Variables
echo "Setting environment variables..."
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

# 1.5 Deploy Backend
echo "Deploying backend..."
cd "SECURITY MANAGEMENT/backend"
git push heroku main

# 1.6 Check Deployment
echo "Checking deployment..."
heroku logs --tail --app your-security-backend

# 1.7 Get Backend URL
echo "Getting backend URL..."
heroku apps:info your-security-backend

# ==========================================
# STEP 2: ADMIN FRONTEND DEPLOYMENT (VERCEL)
# ==========================================

echo ""
echo "STEP 2: Admin Frontend Deployment to Vercel"
echo "=========================================="

# 2.1 Install Vercel CLI (if not installed)
echo "Installing Vercel CLI..."
npm install -g vercel

# 2.2 Login to Vercel
echo "Logging in to Vercel..."
vercel login

# 2.3 Deploy Admin Frontend
echo "Deploying admin frontend..."
cd "SECURITY MANAGEMENT/admin"
vercel

# 2.4 Set Environment Variables in Vercel Dashboard
echo "Set VITE_BACKEND_URL in Vercel dashboard"
echo "Value: https://your-security-backend.herokuapp.com"

# 2.5 Redeploy with Environment Variables
echo "Redeploying with environment variables..."
vercel --prod

# ==========================================
# STEP 3: SECURITY FRONTEND DEPLOYMENT (VERCEL)
# ==========================================

echo ""
echo "STEP 3: Security Frontend Deployment to Vercel"
echo "=========================================="

# 3.1 Deploy Security Frontend
echo "Deploying security frontend..."
cd "SECURITY MANAGEMENT/security-fronend"
vercel

# 3.2 Set Environment Variables in Vercel Dashboard
echo "Set VITE_BACKEND_URL in Vercel dashboard"
echo "Value: https://your-security-backend.herokuapp.com"

# 3.3 Redeploy with Environment Variables
echo "Redeploying with environment variables..."
vercel --prod

# ==========================================
# STEP 4: STUDENT FRONTEND DEPLOYMENT (VERCEL)
# ==========================================

echo ""
echo "STEP 4: Student Frontend Deployment to Vercel"
echo "=========================================="

# 4.1 Deploy Student Frontend
echo "Deploying student frontend..."
cd "SECURITY MANAGEMENT/student-frontend"
vercel

# 4.2 Set Environment Variables in Vercel Dashboard
echo "Set VITE_BACKEND_URL in Vercel dashboard"
echo "Value: https://your-security-backend.herokuapp.com"

# 4.3 Redeploy with Environment Variables
echo "Redeploying with environment variables..."
vercel --prod

# ==========================================
# STEP 5: VERIFICATION
# ==========================================

echo ""
echo "STEP 5: Verification"
echo "=========================================="

# 5.1 Test Backend
echo "Testing backend..."
curl https://your-security-backend.herokuapp.com/api/health

# 5.2 Test Admin Frontend
echo "Admin Frontend: https://security-admin.vercel.app"

# 5.3 Test Security Frontend
echo "Security Frontend: https://security-officer.vercel.app"

# 5.4 Test Student Frontend
echo "Student Frontend: https://security-student.vercel.app"

# ==========================================
# STEP 6: UPDATE CORS (IMPORTANT!)
# ==========================================

echo ""
echo "STEP 6: Update CORS in Backend"
echo "=========================================="

echo "Edit SECURITY MANAGEMENT/backend/server.js"
echo "Update corsOptions with your production URLs:"
echo "- https://security-admin.vercel.app"
echo "- https://security-officer.vercel.app"
echo "- https://security-student.vercel.app"

echo "Then redeploy backend:"
cd "SECURITY MANAGEMENT/backend"
git add .
git commit -m "Update CORS for production URLs"
git push heroku main

# ==========================================
# DEPLOYMENT COMPLETE
# ==========================================

echo ""
echo "=========================================="
echo "Deployment Complete! 🎉"
echo "=========================================="
echo ""
echo "Production URLs:"
echo "- Backend: https://your-security-backend.herokuapp.com"
echo "- Admin: https://security-admin.vercel.app"
echo "- Security: https://security-officer.vercel.app"
echo "- Student: https://security-student.vercel.app"
echo ""
echo "Test Credentials:"
echo "- Admin Email: security@gmail.com"
echo "- Admin Password: security"
echo "- Officer Email: aster@gmail.com"
echo "- Officer ID: 123"
echo ""
echo "=========================================="
