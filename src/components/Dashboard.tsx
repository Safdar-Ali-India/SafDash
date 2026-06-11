import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useGitHub } from '../hooks/useGitHub'
import { Header } from './layout/Header'
import { ClockWidget } from './widgets/ClockWidget'
import { GitHubWidget } from './widgets/GitHubWidget'
import { StatsWidget } from './widgets/StatsWidget'

export function Dashboard() {
  const { settings, setSettingsOpen, lastRefresh, triggerRefresh, enabledWidgets } = useDashboard()
  const [refreshKey] = useState(lastRefresh)
  const github = useGitHub(settings.githubUsername, refreshKey)
  const isEnabled = (id: string) => enabledWidgets.some((w) => w.id === id)
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-[#0c1222] to-[#111827]">
      <Header onSettingsOpen={() => setSettingsOpen(true)} onRefresh={triggerRefresh} lastRefresh={lastRefresh} refreshing={github.loading} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {isEnabled('stats') && <StatsWidget profile={github.profile} loading={github.loading} error={github.error} taskStats={{ total: 0, active: 0, done: 0 }} />}
          {isEnabled('github') && <GitHubWidget events={github.events} loading={github.loading} error={github.error} />}
          {isEnabled('clock') && <ClockWidget />}
        </div>
      </main>
    </div>
  )
}
