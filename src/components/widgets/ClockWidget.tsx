import { Clock, Pause, Play, RotateCcw } from 'lucide-react'
import { useClock, useFocusTimer } from '../../hooks/useClock'
import { Card, CardBody, CardHeader } from '../ui/Card'

export function ClockWidget() {
  const now = useClock()
  const timer = useFocusTimer()

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <Card span="half">
      <CardHeader icon={<Clock className="h-4 w-4" />} title="Focus Clock" />
      <CardBody>
        <div className="text-center">
          <p className="font-mono text-4xl font-bold tracking-wider text-white">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-slate-700/40 bg-surface/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pomodoro
            </span>
            <select
              value={timer.targetMinutes}
              onChange={(e) => timer.setTargetMinutes(Number(e.target.value))}
              disabled={timer.running}
              className="rounded-md border border-slate-600/60 bg-surface px-2 py-1 text-xs text-slate-300"
            >
              {[15, 25, 45, 60].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>

          <div className="relative mx-auto mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
              style={{ width: `${timer.progress}%` }}
            />
          </div>

          <p className={`text-center font-mono text-2xl font-semibold ${timer.isComplete ? 'text-success' : 'text-accent'}`}>
            {formatTime(timer.seconds)}
          </p>

          {timer.isComplete && (
            <p className="mt-1 text-center text-xs text-success">Session complete! 🎉</p>
          )}

          <div className="mt-3 flex justify-center gap-2">
            {timer.running ? (
              <button
                onClick={timer.pause}
                className="flex items-center gap-1.5 rounded-lg border border-slate-600/60 px-4 py-2 text-sm text-slate-300 transition hover:border-accent/40 hover:text-accent"
              >
                <Pause className="h-3.5 w-3.5" /> Pause
              </button>
            ) : (
              <button
                onClick={timer.start}
                className="flex items-center gap-1.5 rounded-lg bg-accent/20 px-4 py-2 text-sm text-accent transition hover:bg-accent/30"
              >
                <Play className="h-3.5 w-3.5" /> Start
              </button>
            )}
            <button
              onClick={timer.reset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-600/60 px-4 py-2 text-sm text-slate-300 transition hover:border-danger/40 hover:text-danger"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
