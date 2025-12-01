import { useState, useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { getUserTeamId, getTeamMembers, TeamMemberWithBests } from '../lib/api'

export function TeamPage() {
  const { user } = useUserStore()
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithBests[]>([])
  const [loading, setLoading] = useState(true)

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
        const members = await getTeamMembers(teamId)
        setTeamMembers(members)
      }
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading team data...</div>
      </div>
    )
  }

  if (teamMembers.length === 0) {
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
            Create or Manage Team
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Team Progress</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.user_id}
            className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {member.full_name || 'Unknown Member'}
            </h3>

            <div className="space-y-3">
              {member.personal_bests.map((best) => {
                const readinessPercent = best.comp_amount > 0
                  ? Math.min(100, Math.round((best.best_amount / best.comp_amount) * 100))
                  : 0

                return (
                  <div key={best.exercise_id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">
                        {best.exercise_name}
                      </span>
                      <div className="text-right">
                        <span className="text-sm text-white font-medium">
                          {best.best_amount}/{best.comp_amount} {best.unit}
                        </span>
                        <span className={`ml-2 text-xs font-bold ${
                          readinessPercent >= 100 ? 'text-green-400' :
                          readinessPercent >= 75 ? 'text-blue-400' :
                          readinessPercent >= 50 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {readinessPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
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
              <p className="text-gray-400 text-sm text-center py-4">
                No training data yet
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
