import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGitHub } from './useGitHub'
import {
  githubEventsFixture,
  githubProfileFixture,
  mockFetch,
} from '../test/helpers'

describe('useGitHub', () => {
  const refreshKey = new Date('2026-06-11T12:00:00Z')

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        '/events/public': githubEventsFixture,
        '/users/testuser': githubProfileFixture,
        '/users/': githubProfileFixture,
      })
    )
  })

  it('fetches profile and events for valid username', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/events/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(githubEventsFixture) })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve(githubProfileFixture) })
      })
    )

    const { result } = renderHook(() => useGitHub('testuser', refreshKey))

    await waitFor(() => expect(result.current.profile?.login).toBe('testuser'))

    expect(result.current.events).toHaveLength(1)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('sanitizes malicious username before fetch', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/events/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(githubEventsFixture) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(githubProfileFixture) })
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useGitHub('../testuser', refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))

    const calledUrl = String(fetchMock.mock.calls[0][0])
    expect(calledUrl).not.toContain('..')
    expect(calledUrl).toContain('testuser')
  })

  it('shows error for empty username', async () => {
    const { result } = renderHook(() => useGitHub('   ', refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toMatch(/username/i)
    expect(result.current.profile).toBeNull()
  })

  it('handles API failure gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }))
    )

    const { result } = renderHook(() => useGitHub('ghost', refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toMatch(/not found/i)
    expect(result.current.events).toEqual([])
  })
})
