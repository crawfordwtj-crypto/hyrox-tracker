import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import { getExercises, insertTrainingLog } from '../lib/api'
import type { Database } from '../types/database'

type Exercise = Database['public']['Tables']['exercises']['Row']

export function LogTrainingPage() {
  const { user } = useUserStore()
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [amount, setAmount] = useState('')
  const [weight, setWeight] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadExercises()
  }, [])

  async function loadExercises() {
    try {
      const data = await getExercises()
      setExercises(data)
      if (data.length > 0) {
        setSelectedExerciseId(data[0].id)
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setMessage('')

    try {
      await insertTrainingLog({
        user_id: user.id,
        exercise_id: selectedExerciseId,
        amount: parseFloat(amount),
        weight: weight ? parseFloat(weight) : null,
      })

      setMessage('Training logged successfully!')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error('Error logging training:', error)
      setMessage('Error logging training. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6">Log Training</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="exercise" className="block text-sm font-medium text-gray-200 mb-2">
              Exercise
            </label>
            <select
              id="exercise"
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id} className="bg-gray-800">
                  {exercise.name} (Target: {exercise.comp_amount} {exercise.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-2">
              Amount {selectedExercise && `(${selectedExercise.unit})`}
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-200 mb-2">
              Weight (kg) - Optional
            </label>
            <input
              id="weight"
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight if applicable"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
            >
              {submitting ? 'Logging...' : 'Log Training'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-sm ${
            message.includes('Error')
              ? 'bg-red-500/20 text-red-200'
              : 'bg-green-500/20 text-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
