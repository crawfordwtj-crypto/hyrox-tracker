import { useState, useEffect } from 'react'

export function EventCountdown() {
  const targetDate = new Date('2026-03-27T00:00:00')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Event Countdown</h2>
        <p className="text-blue-100 text-sm">March 27, 2026</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-blue-100 mt-1">Days</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-blue-100 mt-1">Hours</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-blue-100 mt-1">Minutes</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-blue-100 mt-1">Seconds</div>
        </div>
      </div>
    </div>
  )
}
