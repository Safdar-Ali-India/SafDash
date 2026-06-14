import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDevNews } from './useDevNews'
import {
  devToFixture,
  hnIdsFixture,
  hnItemFixture,
  mockFetch,
} from '../test/helpers'

describe('useDevNews', () => {
  const refreshKey = new Date('2026-06-11T12:00:00Z')

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        'dev.to/api/articles': devToFixture,
        'topstories.json': hnIdsFixture,
        '/v0/item/100': hnItemFixture,
      })
    )
  })

  it('loads dev.to and HN stories', async () => {
    const { result } = renderHook(() => useDevNews(refreshKey))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.devArticles).toHaveLength(1)
    expect(result.current.hnStories).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('sanitizes malicious article URLs from API', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        'dev.to/api/articles': [
          { ...devToFixture[0], url: 'javascript:alert(document.cookie)' },
        ],
        'topstories.json': [],
      })
    )

    const { result } = renderHook(() => useDevNews(refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.devArticles[0].url).toBe('https://dev.to')
  })

  it('falls back for malicious HN URLs', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        'dev.to/api/articles': [],
        'topstories.json': [100],
        '/v0/item/100': { ...hnItemFixture, url: 'data:text/html,bad' },
      })
    )

    const { result } = renderHook(() => useDevNews(refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.hnStories[0].url).toBe('https://news.ycombinator.com/item?id=100')
  })

  it('handles network errors without crashing', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))

    const { result } = renderHook(() => useDevNews(refreshKey))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toMatch(/failed/i)
  })
})
