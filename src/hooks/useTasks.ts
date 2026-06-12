import { useCallback, useEffect, useState } from 'react'
import type { Task } from '../types'
import { loadJSON, saveJSON } from '../lib/storage'

function createTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadTasks(): Task[] {
  const loaded = loadJSON<Task[]>('tasks', [])
  return Array.isArray(loaded) ? loaded : []
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  useEffect(() => {
    saveJSON('tasks', tasks)
  }, [tasks])

  const addTask = useCallback((title: string, priority: Task['priority'] = 'medium') => {
    const trimmed = title.trim()
    if (!trimmed) return false
    const task: Task = {
      id: createTaskId(),
      title: trimmed,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [task, ...prev])
    setFilter('all')
    return true
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }, [])

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  }

  return { tasks: filtered, allTasks: tasks, filter, setFilter, addTask, toggleTask, deleteTask, clearCompleted, stats }
}
