import { X } from 'lucide-react'
import type { DashboardSettings, WidgetConfig } from '../../types'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  settings: DashboardSettings
  onUpdate: (patch: Partial<DashboardSettings>) => void
  onToggleWidget: (id: WidgetConfig['id']) => void
}

export function SettingsPanel({
  open,
  onClose,
  settings,
  onUpdate,
  onToggleWidget,
}: SettingsPanelProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-700/50 bg-surface-raised shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-700/40 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Dashboard Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              GitHub
            </h3>
            <label className="block text-sm text-slate-300 mb-1.5">Username</label>
            <input
              type="text"
              value={settings.githubUsername}
              onChange={(e) => onUpdate({ githubUsername: e.target.value })}
              placeholder="your-github-username"
              className="w-full rounded-lg border border-slate-600/60 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40"
            />
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Auto Refresh
            </h3>
            <label className="block text-sm text-slate-300 mb-1.5">
              Interval: {settings.refreshInterval}s
            </label>
            <input
              type="range"
              min={30}
              max={300}
              step={30}
              value={settings.refreshInterval}
              onChange={(e) => onUpdate({ refreshInterval: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <p className="mt-1 text-xs text-slate-500">Polls GitHub & news feeds automatically</p>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Widgets
            </h3>
            <div className="space-y-2">
              {settings.widgets.map((widget) => (
                <label
                  key={widget.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/40 bg-surface/60 px-4 py-3 transition hover:border-slate-600"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{widget.label}</p>
                    <p className="text-xs text-slate-500">{widget.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => onToggleWidget(widget.id)}
                    className="h-4 w-4 rounded accent-cyan-400"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
