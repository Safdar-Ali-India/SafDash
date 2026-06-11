import { useDashboard } from '../hooks/useDashboard'
import { Header } from './layout/Header'
import { ClockWidget } from './widgets/ClockWidget'

export function Dashboard() {
  const { setSettingsOpen, lastRefresh, triggerRefresh, enabledWidgets } = useDashboard()
  const isEnabled = (id: string) => enabledWidgets.some((w) => w.id === id)
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-[#0c1222] to-[#111827]">
      <Header onSettingsOpen={() => setSettingsOpen(true)} onRefresh={triggerRefresh} lastRefresh={lastRefresh} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {isEnabled('clock') && <ClockWidget />}
        </div>
      </main>
    </div>
  )
}
