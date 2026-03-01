# Cloudinary Setup Guide

## Overview

The system now uses **Cloudinary** for image storage instead of base64. This provides:
- ✅ Efficient cloud storage
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Reduced database size
- ✅ Better performance

---

## Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/
2. Click "Sign Up"
3. Create a free account
4. Verify your email

---

## Step 2: Get Your Credentials

1. Login to Cloudinary Dashboard
2. Go to "Settings" → "API Keys"
3. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## Step 3: Update .env File

Edit `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Replace with your actual credentials from Cloudinary**

---

## Step 4: Reinstall Dependencies

```bash
cd backend
npm install
```

---

## Step 5: Test Upload

1. Start backend: `npm run dev`
2. Register a new device with a photo
3. Check Cloudinary dashboard → Media Library
4. You should see the uploaded image in `security_management/students` folder

---

## How It Works

### Before (Base64)
```
Image → Base64 → Database (Large)
```

### After (Cloudinary)
```
Image → Cloudinary → URL → Database (Small)
```

---

## Benefits

| Feature | Base64 | Cloudinary |
|---------|--------|-----------|
| Database Size | Large | Small |
| Performance | Slow | Fast |
| CDN | No | Yes |
| Optimization | No | Yes |
| Bandwidth | High | Low |
| Scalability | Limited | Unlimited |

---

## Cloudinary Features

### Free Plan Includes
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Unlimited uploads
- ✅ Image optimization
- ✅ CDN delivery
- ✅ API access

### Paid Plans
- Pro: $99/month (500 GB storage)
- Business: $399/month (2 TB storage)

---

## Troubleshooting

### Images Not Uploading

**Error**: `CLOUDINARY_CLOUD_NAME is not defined`

**Solution**: 
- Check .env file has correct credentials
- Restart backend: `npm run dev`

### Wrong Credentials

**Error**: `Invalid API Key`

**Solution**:
- Go to Cloudinary Dashboard
- Copy credentials again
- Update .env
- Restart backend

### File Too Large

**Error**: `File size exceeds limit`

**Solution**:
- Max file size: 5MB
- Compress image before upload
- Or increase limit in `middleware/multer.js`

---

## View Uploaded Images

### In Cloudinary Dashboard
1. Login to Cloudinary
2. Go to "Media Library"
3. Folder: `security_management/students`
4. See all uploaded student photos

### In Database
```sql
SELECT studentId, imageUrl FROM "Students";
```

You'll see URLs like:
```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/security_management/students/abc123.jpg
```

---

## Image Optimization

Cloudinary automatically:
- ✅ Compresses images
- ✅ Converts to optimal format
- ✅ Resizes for different devices
- ✅ Caches globally

### Use Optimized URLs

```javascript
// Original
https://res.cloudinary.com/cloud/image/upload/v123/file.jpg

// Optimized (200x200)
https://res.cloudinary.com/cloud/image/upload/w_200,h_200,c_fill/v123/file.jpg

// Optimized (quality 80)
https://res.cloudinary.com/cloud/image/upload/q_80/v123/file.jpg
```

---

## Security

### API Secret
- ⚠️ Never share your API Secret
- ⚠️ Keep it in .env only
- ⚠️ Don't commit to git

### Signed URLs
For production, use signed URLs:
```javascript
const url = cloudinary.url("file.jpg", {
  sign_url: true,
  type: "authenticated",
  resource_type: "image"
});
```

---

## Migration from Base64

If you have existing base64 images:

1. Export from database
2. Convert base64 to image files
3. Upload to Cloudinary
4. Update database with Cloudinary URLs

---

## API Reference

### Upload Image
```javascript
const upload = multer({ storage: cloudinaryStorage });
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});
```

### Delete Image
```javascript
cloudinary.uploader.destroy('public_id', (error, result) => {
  console.log(result);
});
```

### Transform Image
```javascript
const url = cloudinary.url("image.jpg", {
  width: 200,
  height: 200,
  crop: "fill",
  quality: "auto"
});
```

---

## Monitoring

### Check Usage
1. Login to Cloudinary
2. Go to "Dashboard"
3. See storage and bandwidth usage
4. Monitor API calls

### Set Alerts
1. Go to "Settings" → "Notifications"
2. Set bandwidth alerts
3. Get email notifications

---

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Get credentials
3. ✅ Update .env
4. ✅ Reinstall dependencies
5. ✅ Test upload
6. ✅ Verify in Cloudinary dashboard

---

## Support

- Cloudinary Docs: https://cloudinary.com/documentation
- API Reference: https://cloudinary.com/documentation/image_upload_api_reference
- Support: https://support.cloudinary.com

---

**Status**: Ready to Setup ✅
