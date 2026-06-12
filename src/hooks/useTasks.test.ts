import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

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
    expect(result.current.allTasks[0].priority).toBe('high')
    expect(result.current.stats.active).toBe(1)

    const stored = JSON.parse(localStorage.getItem('safdash:tasks') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Test task')
  })
})
