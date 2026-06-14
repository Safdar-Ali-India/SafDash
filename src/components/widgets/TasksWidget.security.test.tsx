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

describe('TasksWidget security', () => {
  it('renders task titles as text, not HTML', () => {
    render(
      <TasksWidget
        {...baseProps}
        tasks={[
          {
            id: '1',
            title: '<img src=x onerror=alert(1)>',
            completed: false,
            priority: 'high',
            createdAt: '2026-01-01',
          },
        ]}
        stats={{ total: 1, active: 1, done: 0 }}
        onAdd={vi.fn(() => true)}
      />
    )

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument()
    expect(document.querySelector('img[src="x"]')).toBeNull()
  })

  it('shows hint when submitting empty task', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn(() => false)

    render(<TasksWidget {...baseProps} onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByText(/type a task name first/i)).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onAdd with trimmed input', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn(() => true)

    render(<TasksWidget {...baseProps} onAdd={onAdd} />)

    await user.type(screen.getByPlaceholderText('Add a task...'), 'Ship feature')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(onAdd).toHaveBeenCalledWith('Ship feature', 'medium')
  })
})
