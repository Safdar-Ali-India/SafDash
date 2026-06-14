import { useCallback, useEffect, useState } from 'react'
import type { DevArticle, HNStory } from '../types'
import { sanitizeExternalUrl } from '../lib/security'

interface NewsState {
  devArticles: DevArticle[]
  hnStories: HNStory[]
  loading: boolean
  error: string | null
  source: 'devto' | 'hackernews'
}

export function useDevNews(refreshKey: Date) {
  const [state, setState] = useState<NewsState>({
    devArticles: [],
    hnStories: [],
    loading: true,
    error: null,
    source: 'devto',
  })

  const fetchNews = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const [devRes, hnIdsRes] = await Promise.all([
        fetch('https://dev.to/api/articles?per_page=8&top=7'),
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json'),
      ])

      const devData = devRes.ok ? await devRes.json() : []
      const hnIds: number[] = hnIdsRes.ok ? await hnIdsRes.json() : []

      const devArticles: DevArticle[] = devData.map((a: Record<string, unknown>) => ({
        id: Number(a.id),
        title: String(a.title),
        url: sanitizeExternalUrl(String(a.url)) ?? 'https://dev.to',
        description: String(a.description ?? ''),
        author: String((a.user as { username: string })?.username ?? 'unknown'),
        publishedAt: String(a.published_at),
        tags: Array.isArray(a.tag_list) ? (a.tag_list as string[]).map(String).slice(0, 10) : [],
        reactions: Number(a.public_reactions_count ?? 0),
        comments: Number(a.comments_count ?? 0),
      }))

      const topIds = hnIds.slice(0, 6)
      const hnItems = await Promise.all(
        topIds.map(async (id) => {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          if (!res.ok) return null
          const item = await res.json()
          const rawUrl = item.url ?? `https://news.ycombinator.com/item?id=${item.id}`
          return {
            id: item.id,
            title: String(item.title ?? 'Untitled'),
            url: sanitizeExternalUrl(String(rawUrl)) ?? `https://news.ycombinator.com/item?id=${item.id}`,
            score: Number(item.score ?? 0),
            by: String(item.by ?? 'unknown'),
            time: Number(item.time ?? 0),
            descendants: Number(item.descendants ?? 0),
          } as HNStory
        })
      )

      setState({
        devArticles,
        hnStories: hnItems.filter(Boolean) as HNStory[],
        loading: false,
        error: null,
        source: 'devto',
      })
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load dev news',
      }))
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews, refreshKey])

  const setSource = useCallback((source: 'devto' | 'hackernews') => {
    setState((prev) => ({ ...prev, source }))
  }, [])

  return { ...state, setSource, refetch: fetchNews }
}
