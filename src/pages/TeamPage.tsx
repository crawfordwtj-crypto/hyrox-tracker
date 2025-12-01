import { useState, useEffect, FormEvent } from 'react'
import { useUserStore } from '../store/useUserStore'
import { 
  getUserTeamId, 
  getTeamMembers, 
  getTeam,
  inviteToTeam,
  getTeamInvites,
  deleteTeamInvite,
  removeTeamMember,
  TeamMemberWithBests,
  type Team,
  type TeamInvite
} from '../lib/api'

export function TeamPage() {
  const { user } = useUserStore()
  const [team, setTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithBests[]>([])
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [loading, setLoading] = useState(true)
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
          getTeamInvites(teamId)
        ])
        
        setTeam(teamData)
        setTeamMembers(membersData)
        setInvites(invitesData)
      }
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      setLoading(false)
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

  function calculateMemberReadiness(member: TeamMemberWithBests): number {
    if (member.personal_bests.length === 0) return 0
    
    const avgReadiness = member.personal_bests.reduce((sum, best) => {
      const readiness = best.comp_amount > 0 
        ? Math.min(100, (best.best_amount / best.comp_amount) * 100)
        : 0
      return sum + readiness
    }, 0) / member.personal_bests.length
    
    return Math.round(avgReadiness)
  }

  function calculateTeamReadiness(): number {
    if (teamMembers.length === 0) return 0
    
    const totalReadiness = teamMembers.reduce((sum, member) => {
      return sum + calculateMemberReadiness(member)
    }, 0)
    
    return Math.round(totalReadiness / teamMembers.length)
  }

  function getRankedMembers() {
    return [...teamMembers]
      .map(member => ({
        ...member,
        readiness: calculateMemberReadiness(member)
      }))
      .sort((a, b) => b.readiness - a.readiness)
  }

  function getMedalEmoji(rank: number): string {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return '🏅'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading team data...</div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-12 text-center border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">No Team Yet</h2>
          <p className="text-gray-300 mb-6">
            You haven't been added to a team yet. Create a team or wait to be invited.
          </p>
          <a
            href="/manage-team"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Create Team
          </a>
        </div>
      </div>
    )
  }

  const rankedMembers = getRankedMembers()
  const teamReadiness = calculateTeamReadiness()
  const daysUntilEvent = team.event_date 
    ? Math.ceil((new Date(team.event_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
            <p className="text-blue-100 text-lg">{team.event_name}</p>
            <p className="text-blue-200 text-sm mt-1">
              {daysUntilEvent > 0 ? `${daysUntilEvent} days until competition` : 'Competition day!'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold">{teamReadiness}%</div>
            <div className="text-blue-100 text-sm">Team Readiness</div>
          </div>
        </div>
      </div>

      {/* Podium - Top 3 */}
      {rankedMembers.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🏆</span> Team Leaderboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankedMembers.slice(0, 3).map((member, index) => (
              <div
                key={member.user_id}
                className={`relative p-6 rounded-xl text-center ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 md:order-2 md:scale-110' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 md:order-1' :
                  'bg-gradient-to-br from-amber-600 to-amber-700 md:order-3'
                }`}
              >
                <div className="text-5xl mb-2">{getMedalEmoji(index)}</div>
                <div className="text-white font-bold text-lg mb-1">
                  {member.full_name || 'Unknown'}
                </div>
                <div className="text-white/90 text-3xl font-bold">
                  {member.readiness}%
                </div>
                <div className="text-white/80 text-sm mt-1">
                  {member.personal_bests.length} exercises
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Members */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Invite Teammates</h2>
        
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

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Pending Invitations</h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white text-sm">{invite.email}</span>
                  <button
                    onClick={() => handleDeleteInvite(invite.id)}
                    className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All Team Members */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-6">All Team Members</h2>
        
        <div className="space-y-4">
          {rankedMembers.map((member, index) => (
            <div
              key={member.user_id}
              className="p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMedalEmoji(index)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {member.full_name || 'Unknown Member'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {member.personal_bests.length} exercises • {member.readiness}% ready
                    </p>
                  </div>
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

              {/* Member Progress Bars */}
              <div className="space-y-2">
                {member.personal_bests.map((best) => {
                  const readinessPercent = best.comp_amount > 0
                    ? Math.min(100, Math.round((best.best_amount / best.comp_amount) * 100))
                    : 0

                  return (
                    <div key={best.exercise_id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">
                          {best.exercise_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {best.best_amount}/{best.comp_amount} {best.unit}
                        </span>
                      </div>
                      <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                            readinessPercent >= 100 ? 'bg-green-500' :
                            readinessPercent >= 75 ? 'bg-blue-500' :
                            readinessPercent >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${readinessPercent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {member.personal_bests.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-2">
                  No training data yet
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
