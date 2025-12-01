# Hyrox Training Tracker

A beautiful, gamified training tracker for Hyrox athletes built with React, TypeScript, and Supabase.

## 🚀 Features

- **Dashboard**: Track your progress with visual readiness bars for each exercise
- **Training Log**: Easily log your workouts with amount and weight
- **Team View**: See your training partner's progress
- **Countdown Timer**: Real-time countdown to your competition date
- **Magic Link Authentication**: Secure, passwordless login

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Backend**: Supabase (Auth + Database)
- **Routing**: React Router v7

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

Your Supabase database should have the following tables:

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### exercises
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  comp_amount NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### training_logs
```sql
CREATE TABLE training_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  exercise_id UUID REFERENCES exercises(id),
  amount NUMERIC NOT NULL,
  weight NUMERIC,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### teams
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### team_members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sample Exercises Data
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

## 🏃‍♂️ Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 Design Philosophy

This app is designed with Apple-like aesthetics and gaming-style engagement:
- Clean, minimalist interface with glassmorphism effects
- Color-coded progress indicators (red → yellow → blue → green)
- Real-time countdown to create urgency
- Team features for social accountability

## 📝 To-Do

Before using the app, you need to:

1. ✅ Set up Supabase project
2. ✅ Create database tables (see Database Setup above)
3. ✅ Add your Supabase credentials to `.env`
4. ✅ Insert sample exercises into the database
5. ✅ Create a user account via the app
6. ✅ (Optional) Create a team and add members

## 🔐 Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own training needs!

## 📄 License

MIT
