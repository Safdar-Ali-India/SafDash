import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from './SettingsPanel'
import type { DashboardSettings } from '../../types'

const settings: DashboardSettings = {
  githubUsername: 'Safdar-Ali-India',
  refreshInterval: 60,
  widgets: [
    { id: 'tasks', label: 'Task Manager', description: 'Tasks', enabled: true, span: 'half' },
    { id: 'clock', label: 'Focus Clock', description: 'Clock', enabled: true, span: 'half' },
  ],
}

describe('SettingsPanel', () => {
  it('does not render when closed', () => {
    render(
      <SettingsPanel
        open={false}
        onClose={vi.fn()}
        settings={settings}
        onUpdate={vi.fn()}
        onToggleWidget={vi.fn()}
      />
    )
    expect(screen.queryByText('Dashboard Settings')).not.toBeInTheDocument()
  })

  it('updates github username via onUpdate', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()

    render(
      <SettingsPanel
        open
        onClose={vi.fn()}
        settings={settings}
        onUpdate={onUpdate}
        onToggleWidget={vi.fn()}
      />
    )

    const input = screen.getByPlaceholderText('your-github-username')
    await user.clear(input)
    await user.type(input, 'dev')

    expect(onUpdate).toHaveBeenCalled()
    expect(onUpdate.mock.calls.some(([patch]) => 'githubUsername' in patch)).toBe(true)
  })

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    const { container } = render(
      <SettingsPanel
        open
        onClose={onClose}
        settings={settings}
        onUpdate={vi.fn()}
        onToggleWidget={vi.fn()}
      />
    )

    const backdrop = container.querySelector('.bg-black\\/60')
    expect(backdrop).toBeTruthy()
    if (backdrop) await user.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('toggles widget checkbox', async () => {
    const user = userEvent.setup()
    const onToggleWidget = vi.fn()

    render(
      <SettingsPanel
        open
        onClose={vi.fn()}
        settings={settings}
        onUpdate={vi.fn()}
        onToggleWidget={onToggleWidget}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(onToggleWidget).toHaveBeenCalledWith('tasks')
  })
})
