# 🚀 Railway Deployment Guide

## ✅ Fixed Docker Issues

The Dockerfile has been fixed to properly handle the project structure. The error you got was because it was looking for root-level package files that don't exist.

**What was fixed:**
- ✅ Removed invalid root package.json references
- ✅ Properly copy from server/ and client/ subdirectories
- ✅ Added .dockerignore for clean builds
- ✅ Added railway.json configuration
- ✅ Set production environment variables

---

## 🎯 Deploy to Railway Now

### Step 1: Go to Railway
Visit: https://railway.app/dashboard

### Step 2: Create New Project
Click "New Project" → Select "Deploy from GitHub"

### Step 3: Select Your Repository
Search for: `cultural_heritage`
Click to select it

### Step 4: Configure
Railway auto-detects the Dockerfile configuration
- **Environment**: Node.js
- **Build**: Dockerfile
- **Start Command**: `node server/server.js`

### Step 5: Deploy
Click "Deploy" and wait 2-5 minutes

### Step 6: Get Your URL
Once deployed, Railway will give you a public URL like:
```
https://cultural_heritage-production-xxxx.up.railway.app
```

---

## ✨ After Deployment

Your app will be live with:
- ✅ Admin dashboard working
- ✅ Tourist interface working
- ✅ SQLite database persisting
- ✅ Image uploads stored
- ✅ All APIs functional

### Admin can:
1. Login: `admin` / `admin123`
2. Add cities, places, amenities
3. Upload images
4. View tourist feedback

### Data persists:
- All changes stay in database
- Images stored on server
- Tourists can browse and review
- Credentials saved permanently

---

## 🔑 Environment Variables (Optional)

If needed, Railway lets you set variables:

```
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

Go to: Project Settings → Variables

---

## 🐛 Troubleshooting

### Build fails
- Make sure you pushed latest code with Docker fixes
- Check that Dockerfile exists in root directory
- Railway should auto-detect and use it

### App crashes after deploy
- Check Railway logs (Dashboard → Logs)
- Verify database initialized (check server output)
- Make sure PORT environment variable exists

### Images not showing
- Ensure uploads directory exists
- Check permissions on server/uploads/

---

## ✅ Verify Deployment

After Railway shows "Deployment Complete":

1. Click the generated URL
2. Login as admin: `admin/admin123`
3. Add a test city
4. Logout & login as tourist
5. Verify you see the new city

If all works → Deployment is successful! 🎉

---

## 📊 What You Get

- **Automatic backups**: Railway backs up your data
- **Auto-scaling**: Handles traffic spikes
- **Environment**: Node.js 18 Alpine
- **Database**: SQLite on the server
- **Storage**: server/uploads/ persists

---

## 🚀 You're Ready!

Go to Railway and deploy now!

**Your app will be live in ~5 minutes!** ⚡

