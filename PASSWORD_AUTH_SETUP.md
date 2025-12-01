# Enable Password Authentication in Supabase

## Quick Setup

1. **Go to your Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Email** provider
4. Make sure these settings are enabled:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (toggle OFF for easier testing, or leave ON for production)
5. Click **Save**

## Important: Email Confirmation Setting

### For Testing (Recommended while developing)
- **Turn OFF** "Confirm email"
- Users can sign up and log in immediately without email verification
- Faster for testing with your wife

### For Production (More secure)
- **Turn ON** "Confirm email"  
- Users receive confirmation email after signing up
- Must click link before they can log in
- More secure but adds extra step

## Update RLS Policies for Profiles

Run this in Supabase SQL Editor to allow profile creation on signup:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policy that allows inserts during signup
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Make sure these policies exist too
CREATE POLICY IF NOT EXISTS "Users can view all profiles" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

## Test the New Authentication

1. **Sign Up:**
   - Enter name, email, password
   - Click "Create Account"
   - Should log in immediately (if email confirmation is OFF)

2. **Sign Out:**
   - Click "Sign Out" button in navigation

3. **Sign In:**
   - Enter same email and password
   - Click "Sign In"
   - Should log in instantly - no more waiting for emails!

## Benefits of Password Auth

✅ **Instant login** - No waiting for emails  
✅ **Works offline** - No email dependency  
✅ **Familiar UX** - Standard login flow  
✅ **Easy repeat access** - Just remember password  
✅ **Better for apps** - More app-like experience  

## Optional: Password Reset

If you want to add password reset later, users can use the "Forgot Password" flow:

```tsx
// Add this to AuthGate if needed
const handlePasswordReset = async (email: string) => {
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}
```

---

**That's it!** Your app now has proper password authentication with user names! 🎉
