export type WidgetId = 'github' | 'news' | 'tasks' | 'stats' | 'clock'

export interface WidgetConfig {
  id: WidgetId
  label: string
  description: string
  enabled: boolean
  span: 'full' | 'half' | 'third'
}

export interface DashboardSettings {
  githubUsername: string
  refreshInterval: number
  widgets: WidgetConfig[]
}

export interface GitHubEvent {
  id: string
  type: string
  repo: string
  createdAt: string
  payload?: string
}

export interface GitHubProfile {
  login: string
  name: string | null
  avatarUrl: string
  publicRepos: number
  followers: number
  following: number
  htmlUrl: string
  bio: string | null
}

export interface DevArticle {
  id: number
  title: string
  url: string
  description: string
  author: string
  publishedAt: string
  tags: string[]
  reactions: number
  comments: number
}

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface HNStory {
  id: number
  title: string
  url: string
  score: number
  by: string
  time: number
  descendants: number
}
