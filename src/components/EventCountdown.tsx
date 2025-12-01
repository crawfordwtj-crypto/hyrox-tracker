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
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Event Countdown</h2>
          <p className="text-blue-100 text-xs sm:text-sm">March 27, 2026</p>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 text-right">
          <div>
            <div className="text-2xl sm:text-4xl font-bold leading-none">{timeLeft.days}</div>
            <div className="text-[10px] sm:text-xs text-blue-100">days</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold">:</div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs text-blue-100">hrs</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold">:</div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs text-blue-100">min</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold">:</div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs text-blue-100">sec</div>
          </div>
        </div>
      </div>
    </div>
  )
}
