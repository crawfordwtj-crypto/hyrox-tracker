import { useState, useEffect, FormEvent } from 'react'
import { useUserStore } from '../store/useUserStore'
import { 
  getUserTeamId, 
  getTeam, 
  getTeamMembers, 
  getTeamInvites,
  createTeam,
  addUserToTeam,
  inviteToTeam,
  deleteTeamInvite,
  removeTeamMember,
  type Team,
  type TeamInvite,
  type TeamMemberWithBests
} from '../lib/api'

export function TeamManagementPage() {
  const { user } = useUserStore()
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMemberWithBests[]>([])
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create team form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [eventName, setEventName] = useState('HYROX Competition')
  const [eventDate, setEventDate] = useState('2026-03-27')
  
  // Invite form
  const [inviteEmail, setInviteEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      loadTeamData()
    }
  }, [user])

  async function loadTeamData() {
    try {
      setLoading(true)
      const teamId = await getUserTeamId(user!.id)
      
      if (teamId) {
        const [teamData, membersData, invitesData] = await Promise.all([
          getTeam(teamId),
          getTeamMembers(teamId),
          getTeamInvites(teamId),
        ])
        
        setTeam(teamData)
        setMembers(membersData)
        setInvites(invitesData)
      } else {
        setShowCreateForm(true)
      }
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTeam(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const newTeam = await createTeam(teamName, eventName, `${eventDate}T00:00:00Z`)
      await addUserToTeam(newTeam.id, user!.id)
      
      setMessage('Team created successfully!')
      setShowCreateForm(false)
      await loadTeamData()
    } catch (error: any) {
      setMessage(error.message || 'Error creating team')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleInviteMember(e: FormEvent) {
    e.preventDefault()
    if (!team) return

    setSubmitting(true)
    setMessage('')

    try {
      await inviteToTeam(team.id, inviteEmail, user!.id)
      setMessage(`Invite sent to ${inviteEmail}!`)
      setInviteEmail('')
      
      // Reload invites
      const updatedInvites = await getTeamInvites(team.id)
      setInvites(updatedInvites)
    } catch (error: any) {
      setMessage(error.message || 'Error sending invite')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!team || !confirm('Remove this team member?')) return

    try {
      await removeTeamMember(team.id, memberId)
      setMessage('Member removed')
      await loadTeamData()
    } catch (error: any) {
      setMessage(error.message || 'Error removing member')
    }
  }

  async function handleDeleteInvite(inviteId: string) {
    if (!confirm('Delete this invite?')) return

    try {
      await deleteTeamInvite(inviteId)
      setMessage('Invite deleted')
      
      if (team) {
        const updatedInvites = await getTeamInvites(team.id)
        setInvites(updatedInvites)
      }
    } catch (error: any) {
      setMessage(error.message || 'Error deleting invite')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (showCreateForm || !team) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Create Your Team</h1>
          
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-200 mb-2">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Team Crawford"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-200 mb-2">
                Event Name
              </label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="HYROX Competition"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-200 mb-2">
                Event Date
              </label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Team'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
        <p className="text-blue-100">{team.event_name}</p>
        <p className="text-sm text-blue-100 mt-1">
          Event Date: {new Date(team.event_date || '').toLocaleDateString()}
        </p>
      </div>

      {/* Invite Member */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Invite Team Member</h2>
        
        <form onSubmit={handleInviteMember} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="teammate@example.com"
            required
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Sending...' : 'Invite'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Team Members ({members.length})</h2>
        
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div>
                <p className="text-white font-medium">{member.full_name || 'Unknown'}</p>
                <p className="text-sm text-gray-400">
                  {member.personal_bests.length} exercises logged
                </p>
              </div>
              {member.user_id !== user?.id && (
                <button
                  onClick={() => handleRemoveMember(member.user_id)}
                  className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Pending Invites</h2>
          
          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white">{invite.email}</p>
                  <p className="text-sm text-gray-400">
                    Invited {new Date(invite.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteInvite(invite.id)}
                  className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
