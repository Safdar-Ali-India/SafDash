import { LayoutDashboard, RefreshCw, Settings } from 'lucide-react'
import { timeAgo } from '../../lib/format'

interface HeaderProps {
  onSettingsOpen: () => void
  onRefresh: () => void
  lastRefresh: Date
  refreshing?: boolean
}

export function Header({ onSettingsOpen, onRefresh, lastRefresh, refreshing }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Saf<span className="text-accent">Dash</span>
            </h1>
            <p className="text-xs text-slate-400">Dev dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Updated {timeAgo(lastRefresh.toISOString())}
          </span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-surface-raised text-slate-300 transition hover:border-accent/40 hover:text-accent disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onSettingsOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-surface-raised text-slate-300 transition hover:border-accent/40 hover:text-accent"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
