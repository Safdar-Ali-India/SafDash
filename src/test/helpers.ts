import { vi } from 'vitest'

export function mockFetch(responses: Record<string, unknown | (() => unknown)>) {
  const entries = Object.entries(responses).sort((a, b) => b[0].length - a[0].length)

  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input)
    const match = entries.find(([key]) => url.includes(key))
    const body = match ? (typeof match[1] === 'function' ? match[1]() : match[1]) : {}
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    })
  })
}

export function seedLocalStorage(key: string, value: unknown) {
  localStorage.setItem(`safdash:${key}`, JSON.stringify(value))
}

export const githubProfileFixture = {
  login: 'testuser',
  name: 'Test User',
  avatar_url: 'https://avatars.githubusercontent.com/u/1',
  public_repos: 10,
  followers: 5,
  following: 3,
  html_url: 'https://github.com/testuser',
  bio: 'Hello',
}

export const githubEventsFixture = [
  {
    id: 1,
    type: 'PushEvent',
    repo: { name: 'testuser/repo' },
    created_at: '2026-01-01T00:00:00Z',
    payload: { commits: [{ message: 'fix: bug' }] },
  },
]

export const devToFixture = [
  {
    id: 1,
    title: 'Hello Dev.to',
    url: 'https://dev.to/hello',
    description: 'desc',
    user: { username: 'author' },
    published_at: '2026-01-01T00:00:00Z',
    tag_list: ['react'],
    public_reactions_count: 3,
    comments_count: 1,
  },
]

export const hnIdsFixture = [100]
export const hnItemFixture = {
  id: 100,
  title: 'HN Story',
  url: 'https://example.com/story',
  score: 42,
  by: 'dang',
  time: 1700000000,
  descendants: 5,
}
