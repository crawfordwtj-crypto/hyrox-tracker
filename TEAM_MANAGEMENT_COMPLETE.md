# Team Management Setup Complete! 🎉

## What's New

You can now create teams and invite teammates to join you in training for your HYROX event!

## Features Added

### 1. Team Management Page (`/manage-team`)
- **Create Team**: Set up a new team with a name, event name, and event date
- **Invite Members**: Send invitations to teammates via email
- **Manage Members**: View all team members and remove members if needed
- **Track Invitations**: See all pending invitations you've sent

### 2. Invitation System
- **Email Invites**: Invite teammates by entering their email address
- **Invite Banner**: When users log in, they'll see any pending team invitations
- **Accept/Decline**: Users can accept or decline team invitations with one click
- **Auto-Join**: Accepting an invitation automatically adds the user to the team

### 3. Navigation
- Added "Manage Team" link to the navigation bar
- Only accessible when logged in

## How to Use

### Creating Your First Team

1. **Log in** to your account
2. **Click "Manage Team"** in the navigation
3. **Fill in the team details**:
   - Team Name (e.g., "Team Crawford")
   - Event Name (e.g., "HYROX Competition")
   - Event Date (select the date of your event)
4. **Click "Create Team"**

### Inviting Teammates

1. Go to **Manage Team** page
2. Enter your teammate's **email address** in the invite form
3. Click **"Invite"**
4. Your teammate will see the invitation when they log in

### Accepting Invitations

1. **Log in** to your account
2. If you have pending invitations, you'll see a **blue banner** at the top of the dashboard
3. Click **"Accept"** to join the team, or **"Decline"** to reject the invitation
4. After accepting, the page will reload and you'll be part of the team!

### Managing Your Team

From the Manage Team page, you can:
- **View all team members** with their training stats
- **Remove members** (except yourself)
- **Cancel pending invitations** that haven't been accepted yet

## Database Setup Required

Before you can use these features, you need to run the SQL in the Supabase SQL Editor.

**See: `TEAM_DATABASE_SETUP.md`** for the complete SQL setup.

## Technical Details

### New Files Created

- `src/pages/TeamManagementPage.tsx` - Team management interface
- `src/components/InviteBanner.tsx` - Shows pending invitations
- Updated `src/App.tsx` - Added `/manage-team` route
- Updated `src/components/Navigation.tsx` - Added "Manage Team" link
- Updated `src/pages/DashboardPage.tsx` - Shows InviteBanner
- Updated `src/lib/api.ts` - Added team management functions

### API Functions Added

```typescript
createTeam(name, eventName, eventDate)
addUserToTeam(teamId, userId)
inviteToTeam(teamId, email, invitedBy)
getTeamInvites(teamId)
getPendingInvitesForUser(email)
acceptTeamInvite(inviteId)
getTeam(teamId)
removeTeamMember(teamId, userId)
deleteTeamInvite(inviteId)
```

### Database Tables

- `teams` - Stores team information (updated with event_date and event_name)
- `team_members` - Links users to teams
- `team_invites` - Tracks pending/accepted/declined invitations

## Next Steps

1. **Run the SQL** from `TEAM_DATABASE_SETUP.md` in your Supabase SQL Editor
2. **Test it out**:
   - Create a team
   - Invite your training partner
   - Have them accept the invitation
3. **Train together** and track your progress!

---

Now you and your wife can train together with team tracking! 💪
