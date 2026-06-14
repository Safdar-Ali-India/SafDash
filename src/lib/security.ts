import type { DashboardSettings, Task, WidgetConfig, WidgetId } from '../types'

const GITHUB_USERNAME_MAX = 39
const TASK_TITLE_MAX = 500
const REFRESH_MIN = 30
const REFRESH_MAX = 300

const VALID_WIDGET_IDS = new Set<WidgetId>(['stats', 'github', 'news', 'tasks', 'clock'])
const VALID_PRIORITIES = new Set<Task['priority']>(['low', 'medium', 'high'])

/** GitHub usernames: alphanumeric + hyphens, 1–39 chars. */
export function sanitizeGitHubUsername(input: string): string {
  const trimmed = input.trim().slice(0, GITHUB_USERNAME_MAX)
  const cleaned = trimmed.replace(/[^a-zA-Z0-9-]/g, '')
  if (!cleaned) return ''
  if (cleaned.startsWith('-') || cleaned.endsWith('-')) {
    return cleaned.replace(/^-+|-+$/g, '')
  }
  return cleaned
}

export function clampRefreshInterval(seconds: number): number {
  if (!Number.isFinite(seconds)) return REFRESH_MIN
  return Math.min(REFRESH_MAX, Math.max(REFRESH_MIN, Math.round(seconds)))
}

/** Block javascript:, data:, and other non-http(s) URLs from user/API content. */
export function sanitizeExternalUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    return parsed.href
  } catch {
    return null
  }
}

export function sanitizeTaskTitle(title: string): string {
  return title
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, TASK_TITLE_MAX)
}

function isValidPriority(value: unknown): value is Task['priority'] {
  return typeof value === 'string' && VALID_PRIORITIES.has(value as Task['priority'])
}

function isValidTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.completed === 'boolean' &&
    isValidPriority(t.priority) &&
    typeof t.createdAt === 'string'
  )
}

export function parseStoredTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter(isValidTask)
    .map((task) => ({
      ...task,
      title: sanitizeTaskTitle(task.title),
    }))
    .filter((task) => task.title.length > 0)
}

function isValidWidget(value: unknown): value is WidgetConfig {
  if (!value || typeof value !== 'object') return false
  const w = value as Record<string, unknown>
  return (
    typeof w.id === 'string' &&
    VALID_WIDGET_IDS.has(w.id as WidgetId) &&
    typeof w.label === 'string' &&
    typeof w.description === 'string' &&
    typeof w.enabled === 'boolean' &&
    (w.span === 'full' || w.span === 'half' || w.span === 'third')
  )
}

export function parseStoredSettings(
  raw: unknown,
  defaults: DashboardSettings
): DashboardSettings {
  if (!raw || typeof raw !== 'object') return defaults

  const data = raw as Record<string, unknown>
  const githubUsername =
    typeof data.githubUsername === 'string'
      ? sanitizeGitHubUsername(data.githubUsername) || defaults.githubUsername
      : defaults.githubUsername

  const refreshInterval =
    typeof data.refreshInterval === 'number'
      ? clampRefreshInterval(data.refreshInterval)
      : defaults.refreshInterval

  const widgets = Array.isArray(data.widgets)
    ? data.widgets.filter(isValidWidget)
    : defaults.widgets

  return {
    githubUsername,
    refreshInterval,
    widgets: widgets.length > 0 ? widgets : defaults.widgets,
  }
}

export const LIMITS = {
  GITHUB_USERNAME_MAX,
  TASK_TITLE_MAX,
  REFRESH_MIN,
  REFRESH_MAX,
} as const
