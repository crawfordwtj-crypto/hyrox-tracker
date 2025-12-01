# 📋 Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ☐ Prerequisites
- [ ] Node.js installed (v18 or higher)
- [ ] Git installed (optional, for version control)
- [ ] Modern web browser (Chrome, Firefox, Safari, or Edge)

## ☐ Supabase Setup (Do This First!)

### Create Project
- [ ] Go to https://supabase.com
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Choose organization
- [ ] Enter project name
- [ ] Choose database password
- [ ] Select region (choose closest to you)
- [ ] Wait for project to finish setting up (~2 minutes)

### Get Credentials
- [ ] Click on "Settings" (gear icon in sidebar)
- [ ] Click "API" under "Project Settings"
- [ ] Copy "Project URL" (under Project URL section)
- [ ] Copy "anon public" key (under Project API keys section)

### Create .env File
- [ ] In VS Code, create file named `.env` in project root
- [ ] Add line: `VITE_SUPABASE_URL=` and paste your Project URL
- [ ] Add line: `VITE_SUPABASE_ANON_KEY=` and paste your anon key
- [ ] Save the file

### Create Database Tables
- [ ] In Supabase, click "SQL Editor" in sidebar
- [ ] Click "New Query"
- [ ] Copy SQL from `SETUP.md` for `profiles` table
- [ ] Click "Run"
- [ ] Repeat for `exercises` table
- [ ] Repeat for `training_logs` table
- [ ] Repeat for `teams` table
- [ ] Repeat for `team_members` table
- [ ] Run the INSERT query to add sample exercises

### Add Database Triggers (Optional but Recommended)
- [ ] In SQL Editor, copy script from `DATABASE_TRIGGERS.md`
- [ ] Run the script
- [ ] This will auto-create profiles when users sign up

### Enable Authentication
- [ ] In Supabase, click "Authentication" in sidebar
- [ ] Click "Providers"
- [ ] Make sure "Email" is enabled (should be by default)
- [ ] (Optional) Customize email templates in "Email Templates" tab

## ☐ Local Development Setup

### Install Dependencies
- [ ] Open terminal in VS Code
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Check for any errors (should be none)

### Verify .env File
- [ ] Double-check `.env` file exists in project root
- [ ] Verify both variables are set (URL and KEY)
- [ ] Make sure there are no extra spaces or quotes

### Start Development Server
- [ ] In terminal, run: `npm run dev`
- [ ] Should see: "Local: http://localhost:5173"
- [ ] Open that URL in your browser

## ☐ First Time Setup

### Create Your Account
- [ ] In browser, you should see login screen
- [ ] Enter your email address
- [ ] Click "Send Magic Link"
- [ ] Check your email inbox
- [ ] Click the link in the email
- [ ] You should be redirected and logged in

### Verify Dashboard
- [ ] Should see navigation bar at top
- [ ] Should see countdown timer
- [ ] Should see 8 exercise cards
- [ ] All should show "0%" progress (no workouts yet)

### Log First Workout
- [ ] Click "Log Training" in navigation
- [ ] Select an exercise (e.g., "1km Run")
- [ ] Enter amount (e.g., 800 for 800 meters)
- [ ] (Optional) Enter weight if applicable
- [ ] Click "Log Training"
- [ ] Should redirect to dashboard
- [ ] Should now see progress updated for that exercise

### Test Team Feature (Optional)
If you want to use teams:
- [ ] Follow team setup instructions in `SETUP.md`
- [ ] Create team in Supabase SQL Editor
- [ ] Add team members via SQL
- [ ] Click "Team" in navigation
- [ ] Should see team members and their progress

## ☐ Troubleshooting

If something doesn't work:

### App won't start
- [ ] Check that `npm install` completed successfully
- [ ] Try deleting `node_modules` and running `npm install` again
- [ ] Check terminal for error messages

### Can't log in
- [ ] Verify `.env` file exists and has correct values
- [ ] Check Supabase dashboard that Email auth is enabled
- [ ] Check spam folder for magic link email
- [ ] Try restarting dev server: Ctrl+C then `npm run dev`

### Database errors
- [ ] Verify all tables were created in Supabase
- [ ] Check that Row Level Security policies were added
- [ ] Verify exercises were inserted
- [ ] Check browser console (F12) for specific errors

### Styling looks broken
- [ ] Make sure Tailwind is installed: `npm list tailwindcss`
- [ ] Restart dev server
- [ ] Clear browser cache

## ☐ You're Done! 🎉

- [ ] Dashboard showing your progress ✓
- [ ] Can log workouts ✓
- [ ] Countdown timer working ✓
- [ ] (Optional) Team view working ✓

Now start training and track your progress toward March 1, 2025!

---

**Need Help?**
- Read `SETUP.md` for detailed instructions
- Read `README.md` for feature documentation
- Check `PROJECT_COMPLETE.md` for overview
