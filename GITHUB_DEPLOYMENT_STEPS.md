# 🚀 Push to GitHub - Step by Step Guide

## 📋 Prerequisites

1. **GitHub Account** - Create one at https://github.com
2. **Git Installed** - Download from https://git-scm.com
3. **Local Repository** - Already initialized ✓

---

## 🔑 Step 1: Create SSH Key (Authentication)

### Windows PowerShell:

```powershell
# Generate SSH key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy the public key
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```

### Add SSH Key to GitHub:

1. Go to https://github.com/settings/keys
2. Click "New SSH key"
3. Paste the copied key
4. Title: "My Laptop"
5. Click "Add SSH key"

---

## 📦 Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `cultural-heritage`
3. **Description**: `Cultural Heritage Tourism Application`
4. **Visibility**: Public (or Private if you prefer)
5. **Initialize with**: None (we already have local repo)
6. Click "Create repository"

---

## 🎯 Step 3: Push to GitHub

In your project directory:

```powershell
# Check git status
git status

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Cultural Heritage Tourism App

- Full-stack application for exploring cultural heritage sites
- Admin can add cities, places, and amenities
- Tourists can browse and submit reviews
- JWT authentication with persistent credentials
- 31 pre-seeded amenities for Bengaluru
- SQLite database with auto-initialization
- Image upload support for all entities"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin git@github.com:YOUR_USERNAME/cultural-heritage.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## ✅ Verification

After pushing, verify on GitHub:

1. Visit: `https://github.com/YOUR_USERNAME/cultural-heritage`
2. You should see:
   - ✓ All source code files
   - ✓ `.gitignore` file
   - ✓ `DEPLOYMENT_GUIDE.md`
   - ✓ `Procfile`, `Dockerfile`, `docker-compose.yml`
   - ✓ `.github/workflows/deploy.yml`

---

## 🌐 Step 4: Deploy to Heroku

### Prerequisites:
1. Create Heroku account: https://signup.heroku.com
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### Deploy Steps:

```powershell
# Login to Heroku
heroku login

# Create Heroku app
heroku create YOUR-APP-NAME
# Example: heroku create cultural-heritage-tourism

# Get the app URL
heroku open
# Will show: https://YOUR-APP-NAME.herokuapp.com

# Deploy from GitHub
git push heroku main
```

### Environment Variables:

```powershell
# Set secret key on Heroku
heroku config:set JWT_SECRET=your-super-secret-key-here --app YOUR-APP-NAME

# View all config
heroku config --app YOUR-APP-NAME

# View logs
heroku logs --tail --app YOUR-APP-NAME
```

---

## 🎯 Step 5: Admin Can Add Content After Deployment

After deployment, the admin can:

1. **Visit your deployed app**:
   ```
   https://YOUR-APP-NAME.herokuapp.com
   ```

2. **Login as admin**:
   ```
   Username: admin
   Password: admin123
   ```

3. **Add content through the dashboard**:
   - ✓ Add new cities
   - ✓ Add heritage places
   - ✓ Add amenities (9 categories)
   - ✓ Upload images for all
   - ✓ View tourist feedback

4. **All data persists** in the database across deployments ✅

---

## 🔄 Continuous Updates

After initial deployment, you can push updates:

```powershell
# Make changes locally

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Automatically deploys to Heroku via GitHub Actions!
# Check deployment status: https://github.com/YOUR_USERNAME/cultural-heritage/actions
```

---

## 📱 Alternative: Deploy to Railway.app (Simpler)

1. Go to https://railway.app
2. Click "New Project"
3. Connect your GitHub repository
4. Railway auto-detects Node.js
5. Deploy with one click!
6. Get public URL immediately

---

## 🐳 Alternative: Deploy with Docker

```powershell
# Build Docker image
docker build -t cultural-heritage .

# Run locally
docker run -p 4000:4000 -e JWT_SECRET=dev-secret cultural-heritage

# Or use docker-compose
docker-compose up
```

Then push to:
- Docker Hub
- AWS ECR
- Google Cloud Run
- Azure Container Registry

---

## ✨ Post-Deployment Checklist

- [ ] App is live on production URL
- [ ] Admin can login with admin/admin123
- [ ] Tourist can login with testuser/test123
- [ ] All 31 amenities display correctly
- [ ] Images load properly
- [ ] Reviews can be submitted
- [ ] External links work
- [ ] Admin can add new cities
- [ ] Admin can add new amenities
- [ ] Database persists data

---

## 🎉 You're Live!

Your app is now deployed! Share the URL:

```
🌐 Visit: https://YOUR-APP-NAME.herokuapp.com
👨‍💼 Admin: admin / admin123
👤 Tourist: testuser / test123
```

---

## 📞 Troubleshooting

### App won't deploy
- Check GitHub Actions logs
- Verify Heroku API key is set correctly
- Review server logs: `heroku logs --tail`

### Images not showing in production
- Ensure `server/uploads/` directory exists
- Check image paths are correct
- Verify CORS is enabled

### Database errors
- Check database initialization logs
- Verify write permissions on server
- Reset database: `heroku pg:reset` (if using PostgreSQL)

---

## 🚀 Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Heroku/Railway/Docker
3. ✅ Share deployed URL
4. ✅ Admin adds cities & content
5. ✅ Tourists browse and review
6. ✅ Monitor logs and usage

**Happy deploying!** 🎉

