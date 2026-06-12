import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from './Dashboard'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url.includes('api.github.com/users/') && !url.includes('events')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              login: 'test',
              name: 'Test',
              avatar_url: 'https://example.com/a.png',
              public_repos: 1,
              followers: 1,
              following: 1,
              html_url: 'https://github.com/test',
              bio: null,
            }),
        })
      }
      if (url.includes('events')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('dev.to')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('hackernews')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    })
  )
})

describe('Dashboard task flow', () => {
  it('adds a task from the task manager widget', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)

    const input = await screen.findByPlaceholderText('Add a task...')
    await user.type(input, 'Integration test task')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() => {
      expect(screen.getByText('Integration test task')).toBeInTheDocument()
    })

    expect(screen.getByText(/1 active/)).toBeInTheDocument()
  })
})
