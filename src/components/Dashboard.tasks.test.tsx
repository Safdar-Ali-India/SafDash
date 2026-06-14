import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dashboard } from './Dashboard'

vi.mock('../hooks/useGitHub', () => ({
  useGitHub: () => ({
    profile: null,
    events: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

vi.mock('../hooks/useDevNews', () => ({
  useDevNews: () => ({
    devArticles: [],
    hnStories: [],
    loading: false,
    error: null,
    source: 'devto',
    setSource: vi.fn(),
    refetch: vi.fn(),
  }),
}))

beforeEach(() => {
  localStorage.clear()
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
