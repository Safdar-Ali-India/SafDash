import { ExternalLink, GitFork, Star, Users } from 'lucide-react'
import type { GitHubProfile } from '../../types'
import { Card, CardBody } from '../ui/Card'
import { Spinner } from '../ui/Spinner'

interface StatsWidgetProps {
  profile: GitHubProfile | null
  loading: boolean
  error: string | null
  taskStats: { total: number; active: number; done: number }
}

export function StatsWidget({ profile, loading, error, taskStats }: StatsWidgetProps) {
  return (
    <Card span="full" className="overflow-hidden">
      <CardBody className="!py-5">
        {loading && !profile ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-slate-400 py-4">{error}</p>
        ) : profile ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt={profile.login}
                className="h-16 w-16 rounded-2xl border-2 border-slate-600/50 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {profile.name ?? profile.login}
                  </h2>
                  <a
                    href={profile.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-accent transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-sm text-slate-400">@{profile.login}</p>
                {profile.bio && (
                  <p className="mt-1 max-w-md text-sm text-slate-300">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBox icon={<GitFork className="h-4 w-4" />} label="Repos" value={profile.publicRepos} />
              <StatBox icon={<Users className="h-4 w-4" />} label="Followers" value={profile.followers} />
              <StatBox icon={<Star className="h-4 w-4" />} label="Following" value={profile.following} />
              <StatBox icon={<span className="text-xs font-mono">✓</span>} label="Tasks done" value={taskStats.done} accent />
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}

function StatBox({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-surface/50 px-4 py-3 text-center">
      <div className={`mb-1 flex justify-center ${accent ? 'text-success' : 'text-accent'}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold font-mono text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}
