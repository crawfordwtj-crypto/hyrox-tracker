# Deploy to Vercel - Quick Guide

## Option 1: Deploy via Vercel Dashboard (Easiest - 5 minutes)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Hyrox Training Tracker"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hyrox-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (can use GitHub account)
3. Click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Select your `hyrox-tracker` repo
6. Vercel will auto-detect Vite settings
7. **IMPORTANT:** Add Environment Variables:
   - Click **"Environment Variables"**
   - Add: `VITE_SUPABASE_URL` = `https://rpfirtwvkghxgkhmcmls.supabase.co`
   - Add: `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your key)
8. Click **"Deploy"**

✅ Your app will be live at: `https://hyrox-tracker-xxx.vercel.app`

---

## Option 2: Deploy via Vercel CLI (Fast)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
# From your project directory
vercel

# Follow prompts:
# - Login to Vercel
# - Link to new project
# - Set up project settings (use defaults)

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://rpfirtwvkghxgkhmcmls.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deploy to production
vercel --prod
```

✅ You'll get a URL like: `https://hyrox-tracker.vercel.app`

---

## Option 3: Deploy to Netlify

### Via Netlify Dashboard
1. Build your app: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist/` folder
4. Go to **Site Settings** → **Environment Variables**
5. Add both Supabase variables
6. **Redeploy** to apply env vars

---

## After Deployment

### Update Supabase Redirect URLs
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

This ensures magic link emails redirect to your live app!

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Connected to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Supabase redirect URLs updated
- [ ] Test magic link login on live site
- [ ] Share URL with your wife!

---

## Recommended: Use Vercel + GitHub

**Why?**
- Auto-deploys on every git push
- Free SSL certificate
- Custom domain support
- Preview deployments for branches
- Zero configuration needed

Your URL will be shareable worldwide and your wife can sign up from anywhere! 🚀
