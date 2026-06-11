import { ExternalLink, MessageCircle, Newspaper, ThumbsUp } from 'lucide-react'
import type { DevArticle, HNStory } from '../../types'
import { timeAgo } from '../../lib/format'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Spinner } from '../ui/Spinner'

interface NewsWidgetProps {
  devArticles: DevArticle[]
  hnStories: HNStory[]
  loading: boolean
  error: string | null
  source: 'devto' | 'hackernews'
  onSourceChange: (source: 'devto' | 'hackernews') => void
}

export function NewsWidget({
  devArticles,
  hnStories,
  loading,
  error,
  source,
  onSourceChange,
}: NewsWidgetProps) {
  return (
    <Card span="half">
      <CardHeader
        icon={<Newspaper className="h-4 w-4" />}
        title="Dev News"
        action={
          <div className="flex rounded-lg border border-slate-700/50 bg-surface/60 p-0.5 text-xs">
            <button
              onClick={() => onSourceChange('devto')}
              className={`rounded-md px-2.5 py-1 transition ${source === 'devto' ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Dev.to
            </button>
            <button
              onClick={() => onSourceChange('hackernews')}
              className={`rounded-md px-2.5 py-1 transition ${source === 'hackernews' ? 'bg-accent/20 text-accent' : 'text-slate-400 hover:text-slate-200'}`}
            >
              HN
            </button>
          </div>
        }
      />
      <CardBody className="max-h-80 overflow-y-auto">
        {loading && devArticles.length === 0 ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-slate-400 py-6">{error}</p>
        ) : source === 'devto' ? (
          <ul className="space-y-3">
            {devArticles.map((article) => (
              <li key={article.id}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-slate-700/30 bg-surface/40 px-3 py-2.5 transition hover:border-accent/30 hover:bg-surface/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-accent transition line-clamp-2">
                      {article.title}
                    </p>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>@{article.author}</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span className="flex items-center gap-0.5">
                      <ThumbsUp className="h-3 w-3" /> {article.reactions}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="h-3 w-3" /> {article.comments}
                    </span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {hnStories.map((story) => (
              <li key={story.id}>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-slate-700/30 bg-surface/40 px-3 py-2.5 transition hover:border-accent/30 hover:bg-surface/60"
                >
                  <p className="text-sm font-medium text-slate-200 group-hover:text-accent transition line-clamp-2">
                    {story.title}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono text-warning">▲ {story.score}</span>
                    <span>by {story.by}</span>
                    <span>{story.descendants} comments</span>
                    <span>{timeAgo(story.time * 1000)}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
