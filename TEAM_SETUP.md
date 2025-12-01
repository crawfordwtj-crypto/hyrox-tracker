# Quick Team Setup Guide

## Add Your Wife to Your Team (2 Minutes Setup)

### Step 1: Have her sign up first
1. Send her the app URL: `http://localhost:5176`
2. She enters her email and logs in via magic link
3. This creates her profile automatically

### Step 2: Get both User IDs
In Supabase SQL Editor, run:
```sql
-- Get both user IDs
SELECT id, email FROM auth.users;
```
Copy both IDs (they look like: `550e8400-e29b-41d4-a716-446655440000`)

### Step 3: Create a team
```sql
-- Create your team
INSERT INTO teams (name) 
VALUES ('Team Crawford');

-- Get the team ID
SELECT id, name FROM teams;
```
Copy the team ID.

### Step 4: Add both of you to the team
```sql
-- Replace YOUR_TEAM_ID, YOUR_USER_ID, WIFE_USER_ID with actual values
INSERT INTO team_members (team_id, user_id) VALUES
  ('YOUR_TEAM_ID', 'YOUR_USER_ID'),
  ('YOUR_TEAM_ID', 'WIFE_USER_ID');
```

### Step 5: Verify
```sql
-- Check team members
SELECT 
  tm.id,
  t.name as team_name,
  p.full_name as member_name,
  p.id as user_id
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
JOIN profiles p ON tm.user_id = p.id;
```

✅ Done! Both dashboards will now show "Team Readiness" and the Team page will show both members.

---

## One-Command Setup (Advanced)

If you want to do it all at once, run this after both of you have signed up:

```sql
-- Create team and add members (replace email addresses)
WITH new_team AS (
  INSERT INTO teams (name) VALUES ('Team Crawford')
  RETURNING id
),
user_ids AS (
  SELECT id FROM auth.users 
  WHERE email IN ('your@email.com', 'wife@email.com')
)
INSERT INTO team_members (team_id, user_id)
SELECT new_team.id, user_ids.id
FROM new_team, user_ids;
```

---

## Update Full Names (Optional)

If profiles don't have names yet:
```sql
-- Update your names
UPDATE profiles 
SET full_name = 'Tom' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');

UPDATE profiles 
SET full_name = 'Your Wife Name' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'wife@email.com');
```

---

## Future: Email Invitations

For the future, if you want proper team invitations:

**Option 1: Simple Invite Link**
- Create an "Invite Team Member" button
- Generates a unique invite code
- Email them a link with the code
- When they sign up, automatically joins them to team

**Option 2: Email Input**
- Add email input on Team page
- Send them a Supabase magic link
- Include team_id in redirect URL
- On successful login, auto-join team

**For now, the SQL approach above is the fastest for testing with just you two!** 🚀
