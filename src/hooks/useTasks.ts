import { useCallback, useEffect, useState } from 'react'
import type { Task } from '../types'
import { loadJSON, saveJSON } from '../lib/storage'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadJSON('tasks', []))
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  useEffect(() => {
    saveJSON('tasks', tasks)
  }, [tasks])

  const addTask = useCallback((title: string, priority: Task['priority'] = 'medium') => {
    if (!title.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [task, ...prev])
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
