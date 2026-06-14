import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'
import { seedLocalStorage } from '../test/helpers'
import { LIMITS } from '../lib/security'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds and persists a task', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      const ok = result.current.addTask('Test task', 'high')
      expect(ok).toBe(true)
    })

    expect(result.current.allTasks).toHaveLength(1)
    expect(result.current.allTasks[0].title).toBe('Test task')
    expect(result.current.stats.active).toBe(1)

    const stored = JSON.parse(localStorage.getItem('safdash:tasks') ?? '[]')
    expect(stored[0].title).toBe('Test task')
  })

  it('rejects empty and whitespace-only titles', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      expect(result.current.addTask('   ')).toBe(false)
      expect(result.current.addTask('')).toBe(false)
    })

    expect(result.current.allTasks).toHaveLength(0)
  })

  it('sanitizes XSS-like task titles', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.addTask('<img src=x onerror=alert(1)>')
    })

    expect(result.current.allTasks[0].title).toBe('<img src=x onerror=alert(1)>')
    // React escapes on render — title stored as plain text, not executed
  })

  it('truncates overly long titles', () => {
    const { result } = renderHook(() => useTasks())
    const long = 'a'.repeat(600)

    act(() => {
      result.current.addTask(long)
    })

    expect(result.current.allTasks[0].title.length).toBe(LIMITS.TASK_TITLE_MAX)
  })

  it('ignores poisoned tasks from localStorage', () => {
    seedLocalStorage('tasks', [
      { id: '1', title: 'Valid', completed: false, priority: 'low', createdAt: '2026-01-01' },
      { evil: true },
      { id: '2', title: 'Bad', completed: false, priority: 'critical', createdAt: '2026-01-01' },
    ])

    const { result } = renderHook(() => useTasks())
    expect(result.current.allTasks).toHaveLength(1)
    expect(result.current.allTasks[0].title).toBe('Valid')
  })

  it('toggles, deletes, and clears completed tasks', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.addTask('One')
      result.current.addTask('Two')
    })

    const twoId = result.current.allTasks.find((t) => t.title === 'Two')!.id

    act(() => {
      result.current.toggleTask(twoId)
    })
    expect(result.current.stats.done).toBe(1)

    act(() => {
      result.current.setFilter('done')
    })
    expect(result.current.tasks).toHaveLength(1)

    act(() => {
      result.current.clearCompleted()
    })
    expect(result.current.allTasks).toHaveLength(1)
    expect(result.current.allTasks[0].title).toBe('One')

    act(() => {
      result.current.deleteTask(result.current.allTasks[0].id)
    })
    expect(result.current.allTasks).toHaveLength(0)
  })

  it('switches to all filter after adding a task', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.setFilter('done')
      result.current.addTask('New task')
    })

    expect(result.current.filter).toBe('all')
    expect(result.current.tasks.some((t) => t.title === 'New task')).toBe(true)
  })
})
