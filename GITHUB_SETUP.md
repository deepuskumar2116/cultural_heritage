# 📋 GitHub Repository Setup - Step by Step

## ✅ Step 1: Create Repository on GitHub

1. **Go to GitHub**: https://github.com/new
   - Or directly: https://github.com/deepuskumar2116?tab=repositories

2. **Fill in the form**:
   - **Repository name**: `cultural-heritage`
   - **Description**: `Cultural Heritage Tourism Application - Full Stack MERN`
   - **Visibility**: 
     - Choose **Public** (if you want to showcase it)
     - Or **Private** (if it's for personal use)
   - **Initialize this repository with**:
     - ❌ DO NOT check any boxes (leave empty)
     - We already have local files

3. **Click "Create repository"** button

---

## ✅ Step 2: Copy the Generated Commands

After clicking "Create repository", GitHub will show you commands like:

```
git remote add origin https://github.com/deepuskumar2116/cultural-heritage.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 3: Run the Commands in PowerShell

```powershell
cd "c:\Users\Deepu s kumar\Documents\cultural-heritage"

# The remote might already be added, so remove it first
git remote remove origin

# Add the new remote
git remote add origin https://github.com/deepuskumar2116/cultural-heritage.git

# Verify it's added
git remote -v

# Rename branch from master to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ✅ Verify Success

After pushing, you should see:

```
Enumerating objects: 51, done.
Counting objects: 100%
Writing objects: 100%
...
[new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Then visit: `https://github.com/deepuskumar2116/cultural-heritage`

You should see:
- ✓ All source code files
- ✓ 50+ commits with your code
- ✓ README.md with documentation
- ✓ All deployment configurations

---

## 🎯 Summary of What Gets Pushed

Your GitHub repo will have:

```
📦 cultural-heritage/
├── 📁 server/
│   ├── server.js (Express backend)
│   ├── package.json
│   └── uploads/ (for images)
│
├── 📁 client/
│   ├── src/
│   │   ├── pages/ (Login, AdminDashboard, TouristHome)
│   │   ├── components/
│   │   ├── services/ (API client)
│   │   └── styles/
│   └── package.json
│
├── 📁 .github/
│   └── workflows/ (CI/CD pipeline)
│
├── 📄 Dockerfile (Docker support)
├── 📄 docker-compose.yml
├── 📄 Procfile (Heroku support)
├── 📄 DEPLOYMENT_GUIDE.md
├── 📄 GITHUB_DEPLOYMENT_STEPS.md
├── 📄 README.md
└── ... and more documentation
```

---

## 📝 After Creating the Repository

1. Create the empty repository on GitHub (follow steps above)
2. Run the git commands to push your code
3. Your code is now backed up on GitHub! ✅

---

## 🚀 Next: Deploy to Heroku

Once code is on GitHub, you can:

1. **Create Heroku account**: https://signup.heroku.com
2. **Connect your GitHub repo to Heroku**
3. **One-click deploy** from GitHub
4. **Admin can add content** after deployment!

See: **DEPLOYMENT_QUICK_START.md** for complete guide

---

## ❓ Need Help?

- **Can't create repo?** → Go to https://github.com/new manually
- **Push fails?** → Check if repository exists on GitHub first
- **SSH vs HTTPS?** → Using HTTPS (easier), no SSH key needed

