import { describe, expect, it, vi } from 'vitest'
import { formatEventType, priorityColor, timeAgo } from './format'

describe('format', () => {
  it('timeAgo returns human-readable relative times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-11T12:00:00Z'))

    expect(timeAgo('2026-06-11T11:59:00Z')).toBe('1m ago')
    expect(timeAgo('2026-06-10T12:00:00Z')).toBe('1d ago')

    vi.useRealTimers()
  })

  it('formatEventType splits camelCase event names', () => {
    expect(formatEventType('PushEvent')).toBe('Push')
    expect(formatEventType('PullRequestEvent')).toBe('Pull Request')
  })

  it('priorityColor returns distinct classes per priority', () => {
    expect(priorityColor('high')).toContain('danger')
    expect(priorityColor('medium')).toContain('warning')
    expect(priorityColor('low')).toContain('success')
  })
})
