import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useDevNews } from '../hooks/useDevNews'
import { useGitHub } from '../hooks/useGitHub'
import { useTasks } from '../hooks/useTasks'
import { Header } from './layout/Header'
import { ClockWidget } from './widgets/ClockWidget'
import { GitHubWidget } from './widgets/GitHubWidget'
import { NewsWidget } from './widgets/NewsWidget'
import { StatsWidget } from './widgets/StatsWidget'
import { TasksWidget } from './widgets/TasksWidget'

export function Dashboard() {
  const { settings, setSettingsOpen, lastRefresh, triggerRefresh, enabledWidgets } = useDashboard()
  const [refreshKey] = useState(lastRefresh)
  const github = useGitHub(settings.githubUsername, refreshKey)
  const news = useDevNews(refreshKey)
  const tasks = useTasks()
  const isEnabled = (id: string) => enabledWidgets.some((w) => w.id === id)
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-[#0c1222] to-[#111827]">
      <Header onSettingsOpen={() => setSettingsOpen(true)} onRefresh={triggerRefresh} lastRefresh={lastRefresh} refreshing={github.loading} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {isEnabled('stats') && <StatsWidget profile={github.profile} loading={github.loading} error={github.error} taskStats={tasks.stats} />}
          {isEnabled('github') && <GitHubWidget events={github.events} loading={github.loading} error={github.error} />}
          {isEnabled('news') && <NewsWidget devArticles={news.devArticles} hnStories={news.hnStories} loading={news.loading} error={news.error} source={news.source} onSourceChange={news.setSource} />}
          {isEnabled('tasks') && <TasksWidget tasks={tasks.tasks} filter={tasks.filter} stats={tasks.stats} onFilterChange={tasks.setFilter} onAdd={tasks.addTask} onToggle={tasks.toggleTask} onDelete={tasks.deleteTask} onClearCompleted={tasks.clearCompleted} />}
          {isEnabled('clock') && <ClockWidget />}
        </div>
      </main>
    </div>
  )
}
