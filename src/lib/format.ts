export function timeAgo(date: string | number): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function formatEventType(type: string): string {
  return type.replace('Event', '').replace(/([A-Z])/g, ' $1').trim()
}

export function priorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high': return 'text-danger bg-red-500/10 border-red-500/30'
    case 'medium': return 'text-warning bg-amber-500/10 border-amber-500/30'
    case 'low': return 'text-success bg-emerald-500/10 border-emerald-500/30'
  }
}
