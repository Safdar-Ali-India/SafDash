import { useCallback, useEffect, useState } from 'react'
import type { DashboardSettings, WidgetConfig } from '../types'
import { loadJSON, saveJSON } from '../lib/storage'
import { clampRefreshInterval, parseStoredSettings, sanitizeGitHubUsername } from '../lib/security'

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'stats', label: 'Quick Stats', description: 'GitHub profile overview', enabled: true, span: 'full' },
  { id: 'github', label: 'GitHub Activity', description: 'Recent commits and events', enabled: true, span: 'half' },
  { id: 'news', label: 'Dev News', description: 'Top stories from Dev.to & HN', enabled: true, span: 'half' },
  { id: 'tasks', label: 'Task Manager', description: 'Track your daily tasks', enabled: true, span: 'half' },
  { id: 'clock', label: 'Focus Clock', description: 'Live time and focus timer', enabled: true, span: 'half' },
]

const DEFAULT_SETTINGS: DashboardSettings = {
  githubUsername: 'Safdar-Ali-India',
  refreshInterval: 60,
  widgets: DEFAULT_WIDGETS,
}

export function useDashboard() {
  const [settings, setSettings] = useState<DashboardSettings>(() =>
    parseStoredSettings(loadJSON('settings', DEFAULT_SETTINGS), DEFAULT_SETTINGS)
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    saveJSON('settings', settings)
  }, [settings])

  const updateSettings = useCallback((patch: Partial<DashboardSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
      ...(patch.githubUsername !== undefined
        ? { githubUsername: sanitizeGitHubUsername(patch.githubUsername) || prev.githubUsername }
        : {}),
      ...(patch.refreshInterval !== undefined
        ? { refreshInterval: clampRefreshInterval(patch.refreshInterval) }
        : {}),
    }))
  }, [])

  const toggleWidget = useCallback((id: WidgetConfig['id']) => {
    setSettings((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, enabled: !w.enabled } : w
      ),
    }))
  }, [])

  const triggerRefresh = useCallback(() => {
    setLastRefresh(new Date())
  }, [])

  const enabledWidgets = settings.widgets.filter((w) => w.enabled)

  return {
    settings,
    settingsOpen,
    setSettingsOpen,
    updateSettings,
    toggleWidget,
    lastRefresh,
    triggerRefresh,
    enabledWidgets,
  }
}
