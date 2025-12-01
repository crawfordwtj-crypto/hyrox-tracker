import { useState, useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { getPendingInvitesForUser, acceptTeamInvite, deleteTeamInvite, type TeamInvite } from '../lib/api'

export function InviteBanner() {
  const { user } = useUserStore()
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (user) {
      loadInvites()
    }
  }, [user])

  async function loadInvites() {
    if (!user) return
    try {
      const userInvites = await getPendingInvitesForUser(user.email!)
      setInvites(userInvites)
    } catch (error) {
      console.error('Error loading invites:', error)
    }
  }

  async function handleAccept(inviteId: string) {
    setProcessing(true)
    try {
      await acceptTeamInvite(inviteId)
      await loadInvites()
      // Reload the page to update team data
      window.location.reload()
    } catch (error) {
      console.error('Error accepting invite:', error)
      alert('Failed to accept invite')
    } finally {
      setProcessing(false)
    }
  }

  async function handleDecline(inviteId: string) {
    setProcessing(true)
    try {
      await deleteTeamInvite(inviteId)
      await loadInvites()
    } catch (error) {
      console.error('Error declining invite:', error)
      alert('Failed to decline invite')
    } finally {
      setProcessing(false)
    }
  }

  if (invites.length === 0) return null

  return (
    <div className="mb-6 space-y-3">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Team Invitation</h3>
              <p className="text-blue-100">
                You've been invited to join a team!
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(invite.id)}
                disabled={processing}
                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(invite.id)}
                disabled={processing}
                className="px-4 py-2 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
