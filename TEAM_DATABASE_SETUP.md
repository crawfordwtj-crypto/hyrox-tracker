# Team Management Database Setup

## 1. Create team_invites Table

Run this in Supabase SQL Editor:

```sql
-- Create team_invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, email)
);

-- Enable RLS
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Allow team members to view invites for their team
CREATE POLICY "Team members can view team invites" 
ON team_invites FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = team_invites.team_id 
    AND team_members.user_id = auth.uid()
  )
);

-- Allow team members to create invites
CREATE POLICY "Team members can invite others" 
ON team_invites FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = team_invites.team_id 
    AND team_members.user_id = auth.uid()
  )
);

-- Allow users to update their own invites (accept/decline)
CREATE POLICY "Users can update invites sent to them" 
ON team_invites FOR UPDATE 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Allow team members to delete invites
CREATE POLICY "Team members can delete invites" 
ON team_invites FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = team_invites.team_id 
    AND team_members.user_id = auth.uid()
  )
);
```

## 2. Update Teams Table (Optional - Add Event Date)

```sql
-- Add event_date column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE DEFAULT '2026-03-27T00:00:00Z';

-- Add event_name column
ALTER TABLE teams ADD COLUMN IF NOT EXISTS event_name TEXT DEFAULT 'HYROX Competition';
```

## 3. Create Function to Accept Invites

```sql
-- Function to accept team invite
CREATE OR REPLACE FUNCTION accept_team_invite(invite_id UUID)
RETURNS VOID AS $$
DECLARE
  v_team_id UUID;
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Get user email
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;
  
  -- Get invite details and verify it's for this user
  SELECT team_id INTO v_team_id 
  FROM team_invites 
  WHERE id = invite_id 
  AND email = v_email 
  AND status = 'pending';
  
  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite';
  END IF;
  
  -- Add user to team
  INSERT INTO team_members (team_id, user_id)
  VALUES (v_team_id, v_user_id)
  ON CONFLICT (team_id, user_id) DO NOTHING;
  
  -- Update invite status
  UPDATE team_invites 
  SET status = 'accepted' 
  WHERE id = invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 4. Update Team Members Table Constraint

```sql
-- Add unique constraint if it doesn't exist
ALTER TABLE team_members 
ADD CONSTRAINT IF NOT EXISTS team_members_team_user_unique 
UNIQUE (team_id, user_id);
```

---

Run all these queries in your Supabase SQL Editor, then you're ready to use the team management features! 🎉
