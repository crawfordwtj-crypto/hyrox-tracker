# GitHub Setup - Step by Step

## Create New GitHub Repository

### Option 1: Via GitHub Website (Easiest)

1. **Go to GitHub.com** and sign in (or create account)
2. **Click the "+" icon** in top right corner
3. **Select "New repository"**
4. **Fill in details:**
   - Repository name: `hyrox-tracker`
   - Description: `Training tracker for Hyrox competition`
   - Keep it **Private** (or Public if you want)
   - **DON'T** check "Initialize with README" (you already have code)
5. **Click "Create repository"**

### Option 2: Via GitHub CLI (if installed)

```bash
gh repo create hyrox-tracker --private --source=. --remote=origin --push
```

---

## Push Your Code to GitHub

After creating the repo on GitHub, you'll see instructions. Here's what to run:

### First Time Setup

```bash
# Initialize git in your project (if not done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Hyrox Training Tracker"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hyrox-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If Git Already Initialized

```bash
# Add files
git add .

# Commit
git commit -m "Initial commit: Hyrox Training Tracker"

# Add remote (get URL from GitHub after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/hyrox-tracker.git

# Push
git push -u origin main
```

---

## Troubleshooting

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hyrox-tracker.git
```

### Authentication Issues
- Use **Personal Access Token** instead of password
- Or use **SSH key** (recommended)
- GitHub will prompt you for authentication

### Need to set up git identity?
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## After Pushing to GitHub

✅ Your code is now on GitHub!

**Next:** Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `hyrox-tracker` repository
4. Add environment variables
5. Deploy!

That's it! 🚀
