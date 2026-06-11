import { GitCommit, Github } from 'lucide-react'
import type { GitHubEvent } from '../../types'
import { formatEventType, timeAgo } from '../../lib/format'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Spinner } from '../ui/Spinner'

interface GitHubWidgetProps {
  events: GitHubEvent[]
  loading: boolean
  error: string | null
}

const eventIcons: Record<string, string> = {
  PushEvent: '🚀',
  WatchEvent: '⭐',
  CreateEvent: '📁',
  IssuesEvent: '🐛',
  PullRequestEvent: '🔀',
  ForkEvent: '🍴',
}

export function GitHubWidget({ events, loading, error }: GitHubWidgetProps) {
  return (
    <Card span="half">
      <CardHeader icon={<Github className="h-4 w-4" />} title="GitHub Activity" />
      <CardBody className="max-h-80 overflow-y-auto">
        {loading && events.length === 0 ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-slate-400 py-6">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No recent activity</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex gap-3 rounded-lg border border-slate-700/30 bg-surface/40 px-3 py-2.5 transition hover:border-slate-600/50"
              >
                <span className="mt-0.5 text-base">{eventIcons[event.type] ?? <GitCommit className="h-4 w-4 text-accent" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {formatEventType(event.type)}
                  </p>
                  <p className="truncate text-xs font-mono text-slate-500">{event.repo}</p>
                  {event.payload && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">{event.payload}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-slate-500">
                  {timeAgo(event.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
