import { useEffect, useState } from 'react'

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}

export function useFocusTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [targetMinutes, setTargetMinutes] = useState(25)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const reset = () => {
    setSeconds(0)
    setRunning(false)
  }

  const start = () => setRunning(true)
  const pause = () => setRunning(false)

  const progress = Math.min((seconds / (targetMinutes * 60)) * 100, 100)
  const isComplete = seconds >= targetMinutes * 60

  return { seconds, running, targetMinutes, setTargetMinutes, reset, start, pause, progress, isComplete }
}
