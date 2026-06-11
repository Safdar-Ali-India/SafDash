import { useDashboard } from '../hooks/useDashboard'
import { Header } from './layout/Header'

export function Dashboard() {
  const { setSettingsOpen, lastRefresh, triggerRefresh } = useDashboard()
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-[#0c1222] to-[#111827]">
      <Header onSettingsOpen={() => setSettingsOpen(true)} onRefresh={triggerRefresh} lastRefresh={lastRefresh} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8" />
    </div>
  )
}
