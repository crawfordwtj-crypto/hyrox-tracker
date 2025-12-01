import { useState, useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { getPersonalBests, PersonalBest, getUserTeamId, getTeamMembers } from '../lib/api'
import { EventCountdown } from '../components/EventCountdown'

export function DashboardPage() {
  const { user, profile } = useUserStore()
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([])
  const [overallReadiness, setOverallReadiness] = useState(0)
  const [teamReadiness, setTeamReadiness] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  async function loadData() {
    try {
      setLoading(true)
      const bests = await getPersonalBests(user!.id)
      setPersonalBests(bests)
      
      // Calculate overall personal readiness
      const avgReadiness = bests.length > 0
        ? bests.reduce((sum, best) => {
            const readiness = best.comp_amount > 0 
              ? Math.min(100, (best.best_amount / best.comp_amount) * 100)
              : 0
            return sum + readiness
          }, 0) / bests.length
        : 0
      setOverallReadiness(Math.round(avgReadiness))
      
      // Calculate team readiness
      const teamId = await getUserTeamId(user!.id)
      if (teamId) {
        const members = await getTeamMembers(teamId)
        if (members.length > 0) {
          const teamAvg = members.reduce((sum, member) => {
            const memberAvg = member.personal_bests.length > 0
              ? member.personal_bests.reduce((s, best) => {
                  const r = best.comp_amount > 0 ? Math.min(100, (best.best_amount / best.comp_amount) * 100) : 0
                  return s + r
                }, 0) / member.personal_bests.length
              : 0
            return sum + memberAvg
          }, 0) / members.length
          setTeamReadiness(Math.round(teamAvg))
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading your progress...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EventCountdown />

      {/* Readiness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium text-blue-100 mb-2">My Overall Readiness</h3>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">{overallReadiness}%</span>
            <span className="ml-3 text-blue-100">competition ready</span>
          </div>
          <div className="mt-4 relative w-full h-3 bg-blue-900/50 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-white transition-all duration-500"
              style={{ width: `${overallReadiness}%` }}
            />
          </div>
        </div>

        {teamReadiness !== null && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-medium text-purple-100 mb-2">Team Readiness</h3>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold">{teamReadiness}%</span>
              <span className="ml-3 text-purple-100">average</span>
            </div>
            <div className="mt-4 relative w-full h-3 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white transition-all duration-500"
                style={{ width: `${teamReadiness}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {profile?.full_name ? `${profile.full_name}'s Progress` : 'Your Progress'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalBests.map((best) => {
            const readinessPercent = best.comp_amount > 0
              ? Math.min(100, Math.round((best.best_amount / best.comp_amount) * 100))
              : 0

            return (
              <div
                key={best.exercise_id}
                className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {best.exercise_name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Personal Best:</span>
                    <span className="text-white font-medium">
                      {best.best_amount} {best.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Competition Goal:</span>
                    <span className="text-white font-medium">
                      {best.comp_amount} {best.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Readiness</span>
                    <span className={`font-bold ${
                      readinessPercent >= 100 ? 'text-green-400' :
                      readinessPercent >= 75 ? 'text-blue-400' :
                      readinessPercent >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {readinessPercent}%
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
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
              </div>
            )
          })}
        </div>

        {personalBests.length === 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-12 text-center border border-white/20">
            <p className="text-gray-300 text-lg">
              No training data yet. Start logging your workouts!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
