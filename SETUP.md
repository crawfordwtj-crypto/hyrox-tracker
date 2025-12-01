# Quick Setup Guide

## ⚠️ IMPORTANT: Before Running the App

You need to complete these steps **outside of VS Code** in your Supabase dashboard:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details and create

## 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## 3. Create Your .env File

1. In VS Code, create a file called `.env` in the project root
2. Add your credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Set Up Database Tables

In your Supabase dashboard, go to **SQL Editor** and run these queries one by one:

### Create profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create exercises table
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  comp_amount NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read exercises
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);
```

### Create training_logs table
```sql
CREATE TABLE training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  weight NUMERIC,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own logs" ON training_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON training_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON training_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON training_logs FOR DELETE USING (auth.uid() = user_id);
```

### Create teams table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view teams
CREATE POLICY "Authenticated users can view teams" ON teams FOR SELECT TO authenticated USING (true);
```

### Create team_members table
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view team members" ON team_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_members tm WHERE tm.user_id = auth.uid()
  )
);
```

### Insert sample exercises
```sql
INSERT INTO exercises (name, comp_amount, unit) VALUES
  ('1km Run', 1000, 'm'),
  ('Ski Erg', 1000, 'm'),
  ('Sled Push', 50, 'm'),
  ('Sled Pull', 50, 'm'),
  ('Burpee Broad Jumps', 80, 'm'),
  ('Rowing', 1000, 'm'),
  ('Farmers Carry', 200, 'm'),
  ('Sandbag Lunges', 100, 'm');
```

## 5. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if desired

## 6. Run the App

Back in VS Code terminal:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 7. Create Your Account

1. Enter your email in the app
2. Check your email for the magic link
3. Click the link to log in
4. Your profile will be automatically created

## 8. (Optional) Create a Team

To use the team features:

1. In Supabase SQL Editor, create a team:
```sql
INSERT INTO teams (name) VALUES ('Your Team Name');
```

2. Get the team ID and your user ID:
```sql
-- Get team ID
SELECT id FROM teams WHERE name = 'Your Team Name';

-- Get your user ID (after logging in)
SELECT id FROM auth.users WHERE email = 'your@email.com';
```

3. Add yourself and your partner to the team:
```sql
-- Replace 'team-id-here' and 'user-id-here' with actual IDs
INSERT INTO team_members (team_id, user_id) VALUES
  ('team-id-here', 'user-id-here'),
  ('team-id-here', 'partner-user-id-here');
```

## 🎉 You're Done!

Your Hyrox Training Tracker is now ready to use. Start logging your workouts and tracking your progress!

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists in the project root
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating `.env`

### Authentication not working
- Check that Email authentication is enabled in Supabase
- Verify your email credentials are correct in `.env`
- Check spam folder for magic link emails

### Tables not found
- Make sure you ran all the SQL queries in the SQL Editor
- Check that Row Level Security (RLS) policies were created
- Verify tables exist in **Database** → **Tables**
