import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboard } from './useDashboard'
import { seedLocalStorage } from '../test/helpers'

describe('useDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads default settings when storage is empty', () => {
    const { result } = renderHook(() => useDashboard())
    expect(result.current.settings.githubUsername).toBe('Safdar-Ali-India')
    expect(result.current.settings.refreshInterval).toBe(60)
    expect(result.current.enabledWidgets.length).toBe(5)
  })

  it('sanitizes poisoned settings from localStorage', () => {
    seedLocalStorage('settings', {
      githubUsername: '<script>alert(1)</script>',
      refreshInterval: 9999,
      widgets: 'not-an-array',
    })

    const { result } = renderHook(() => useDashboard())
    expect(result.current.settings.githubUsername).not.toContain('<')
    expect(result.current.settings.refreshInterval).toBe(300)
    expect(result.current.settings.widgets.length).toBeGreaterThan(0)
  })

  it('clamps refresh interval on update', () => {
    const { result } = renderHook(() => useDashboard())

    act(() => {
      result.current.updateSettings({ refreshInterval: 10 })
    })

    expect(result.current.settings.refreshInterval).toBe(30)
  })

  it('sanitizes github username on update', () => {
    const { result } = renderHook(() => useDashboard())

    act(() => {
      result.current.updateSettings({ githubUsername: 'user/../admin' })
    })

    expect(result.current.settings.githubUsername).toBe('useradmin')
  })

  it('toggles widget visibility', () => {
    const { result } = renderHook(() => useDashboard())

    act(() => {
      result.current.toggleWidget('tasks')
    })

    const tasks = result.current.settings.widgets.find((w) => w.id === 'tasks')
    expect(tasks?.enabled).toBe(false)
    expect(result.current.enabledWidgets.some((w) => w.id === 'tasks')).toBe(false)
  })

  it('persists settings to localStorage', () => {
    const { result } = renderHook(() => useDashboard())

    act(() => {
      result.current.updateSettings({ refreshInterval: 120 })
    })

    const stored = JSON.parse(localStorage.getItem('safdash:settings') ?? '{}')
    expect(stored.refreshInterval).toBe(120)
  })
})
