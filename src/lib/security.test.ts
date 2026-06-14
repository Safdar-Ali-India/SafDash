import { describe, expect, it } from 'vitest'
import {
  clampRefreshInterval,
  LIMITS,
  parseStoredSettings,
  parseStoredTasks,
  sanitizeExternalUrl,
  sanitizeGitHubUsername,
  sanitizeTaskTitle,
} from './security'
import type { DashboardSettings } from '../types'

const defaultSettings: DashboardSettings = {
  githubUsername: 'Safdar-Ali-India',
  refreshInterval: 60,
  widgets: [
    { id: 'stats', label: 'Quick Stats', description: 'x', enabled: true, span: 'full' },
    { id: 'github', label: 'GitHub', description: 'x', enabled: true, span: 'half' },
    { id: 'news', label: 'News', description: 'x', enabled: true, span: 'half' },
    { id: 'tasks', label: 'Tasks', description: 'x', enabled: true, span: 'half' },
    { id: 'clock', label: 'Clock', description: 'x', enabled: true, span: 'half' },
  ],
}

describe('sanitizeGitHubUsername', () => {
  it('allows valid usernames', () => {
    expect(sanitizeGitHubUsername('Safdar-Ali-India')).toBe('Safdar-Ali-India')
    expect(sanitizeGitHubUsername('user123')).toBe('user123')
  })

  it('strips path traversal and injection chars', () => {
    expect(sanitizeGitHubUsername('../admin')).toBe('admin')
    expect(sanitizeGitHubUsername('user<script>')).toBe('userscript')
    expect(sanitizeGitHubUsername('user/../etc')).toBe('useretc')
  })

  it('rejects leading/trailing hyphens after cleanup', () => {
    expect(sanitizeGitHubUsername('---')).toBe('')
    expect(sanitizeGitHubUsername('-user-')).toBe('user')
  })

  it('truncates to max length', () => {
    const long = 'a'.repeat(50)
    expect(sanitizeGitHubUsername(long).length).toBeLessThanOrEqual(LIMITS.GITHUB_USERNAME_MAX)
  })
})

describe('sanitizeExternalUrl', () => {
  it('allows http and https URLs', () => {
    expect(sanitizeExternalUrl('https://dev.to/post')).toBe('https://dev.to/post')
    expect(sanitizeExternalUrl('http://example.com')).toBe('http://example.com/')
  })

  it('blocks javascript and data URIs', () => {
    expect(sanitizeExternalUrl('javascript:alert(1)')).toBeNull()
    expect(sanitizeExternalUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
  })

  it('blocks empty and malformed URLs', () => {
    expect(sanitizeExternalUrl('')).toBeNull()
    expect(sanitizeExternalUrl('   ')).toBeNull()
    expect(sanitizeExternalUrl('not-a-url')).toBeNull()
  })
})

describe('sanitizeTaskTitle', () => {
  it('trims and limits length', () => {
    expect(sanitizeTaskTitle('  hello  ')).toBe('hello')
    expect(sanitizeTaskTitle('x'.repeat(600)).length).toBe(LIMITS.TASK_TITLE_MAX)
  })

  it('strips control characters', () => {
    expect(sanitizeTaskTitle('hello\x00world')).toBe('helloworld')
    expect(sanitizeTaskTitle('tab\there')).toBe('tab\there')
  })
})

describe('clampRefreshInterval', () => {
  it('clamps to allowed range', () => {
    expect(clampRefreshInterval(10)).toBe(30)
    expect(clampRefreshInterval(999)).toBe(300)
    expect(clampRefreshInterval(60)).toBe(60)
  })

  it('handles invalid numbers', () => {
    expect(clampRefreshInterval(NaN)).toBe(30)
    expect(clampRefreshInterval(Infinity)).toBe(30)
  })
})

describe('parseStoredTasks', () => {
  it('returns empty array for invalid input', () => {
    expect(parseStoredTasks(null)).toEqual([])
    expect(parseStoredTasks({})).toEqual([])
    expect(parseStoredTasks('bad')).toEqual([])
  })

  it('filters malformed tasks from localStorage poison', () => {
    const result = parseStoredTasks([
      { id: '1', title: 'Valid', completed: false, priority: 'high', createdAt: '2026-01-01' },
      { id: '2', title: 'Bad priority', completed: false, priority: 'urgent', createdAt: '2026-01-01' },
      { title: 'missing id', completed: false, priority: 'low', createdAt: '2026-01-01' },
      null,
    ])
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Valid')
  })

  it('sanitizes task titles from storage', () => {
    const result = parseStoredTasks([
      { id: '1', title: '  spaced  ', completed: false, priority: 'low', createdAt: '2026-01-01' },
    ])
    expect(result[0].title).toBe('spaced')
  })
})

describe('parseStoredSettings', () => {
  it('falls back to defaults for corrupt settings', () => {
    expect(parseStoredSettings(null, defaultSettings)).toEqual(defaultSettings)
  })

  it('sanitizes malicious github username from storage', () => {
    const result = parseStoredSettings(
      { githubUsername: '../../evil', refreshInterval: 60, widgets: defaultSettings.widgets },
      defaultSettings
    )
    expect(result.githubUsername).toBe('evil')
  })

  it('clamps refresh interval from storage', () => {
    const result = parseStoredSettings(
      { githubUsername: 'user', refreshInterval: 5, widgets: defaultSettings.widgets },
      defaultSettings
    )
    expect(result.refreshInterval).toBe(30)
  })

  it('ignores invalid widget entries', () => {
    const result = parseStoredSettings(
      {
        githubUsername: 'user',
        refreshInterval: 60,
        widgets: [{ id: 'invalid', label: 'x', description: 'x', enabled: true, span: 'half' }],
      },
      defaultSettings
    )
    expect(result.widgets).toEqual(defaultSettings.widgets)
  })
})
