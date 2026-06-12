import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TasksWidget } from './TasksWidget'

const baseProps = {
  tasks: [],
  filter: 'all' as const,
  stats: { total: 0, active: 0, done: 0 },
  onFilterChange: vi.fn(),
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  onClearCompleted: vi.fn(),
}

describe('TasksWidget', () => {
  it('adds a task when typing and clicking +', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn(() => true)

    render(<TasksWidget {...baseProps} onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add task' })

    await user.type(input, 'Fix login bug')

    await user.click(addButton)

    expect(onAdd).toHaveBeenCalledWith('Fix login bug', 'medium')
    expect(input).toHaveValue('')
  })

  it('adds a task on Enter key', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn(() => true)

    render(<TasksWidget {...baseProps} onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Add a task...')
    await user.type(input, 'Ship feature{Enter}')

    expect(onAdd).toHaveBeenCalledWith('Ship feature', 'medium')
  })
})
