import { useCallback, useEffect, useState } from 'react'
import type { GitHubEvent, GitHubProfile } from '../types'

interface GitHubState {
  profile: GitHubProfile | null
  events: GitHubEvent[]
  loading: boolean
  error: string | null
}

export function useGitHub(username: string, refreshKey: Date) {
  const [state, setState] = useState<GitHubState>({
    profile: null,
    events: [],
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (!username.trim()) {
      setState({ profile: null, events: [], loading: false, error: 'Enter a GitHub username in settings' })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const [profileRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=8`),
      ])

      if (!profileRes.ok) throw new Error(`User "${username}" not found`)

      const profileData = await profileRes.json()
      const eventsData = eventsRes.ok ? await eventsRes.json() : []

      const profile: GitHubProfile = {
        login: profileData.login,
        name: profileData.name,
        avatarUrl: profileData.avatar_url,
        publicRepos: profileData.public_repos,
        followers: profileData.followers,
        following: profileData.following,
        htmlUrl: profileData.html_url,
        bio: profileData.bio,
      }

      const events: GitHubEvent[] = eventsData.map((e: Record<string, unknown>) => ({
        id: String(e.id),
        type: String(e.type),
        repo: String((e.repo as { name: string }).name),
        createdAt: String(e.created_at),
        payload: summarizePayload(e),
      }))

      setState({ profile, events, loading: false, error: null })
    } catch (err) {
      setState({
        profile: null,
        events: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch GitHub data',
      })
    }
  }, [username])

  useEffect(() => {
    fetchData()
  }, [fetchData, refreshKey])

  return { ...state, refetch: fetchData }
}

function summarizePayload(event: Record<string, unknown>): string | undefined {
  const payload = event.payload as Record<string, unknown> | undefined
  if (!payload) return undefined

  if (event.type === 'PushEvent') {
    const commits = payload.commits as Array<{ message: string }> | undefined
    return commits?.[0]?.message
  }
  if (event.type === 'WatchEvent') return 'Starred a repository'
  if (event.type === 'CreateEvent') {
    const refType = payload.ref_type as string
    return `Created ${refType}`
  }
  if (event.type === 'IssuesEvent') {
    const action = payload.action as string
    return `Issue ${action}`
  }
  if (event.type === 'PullRequestEvent') {
    const action = payload.action as string
    return `PR ${action}`
  }
  return undefined
}
