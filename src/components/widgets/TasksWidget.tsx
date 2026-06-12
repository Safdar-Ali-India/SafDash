import { Check, ListTodo, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Task } from '../../types'
import { priorityColor } from '../../lib/format'
import { Card, CardBody, CardHeader } from '../ui/Card'

interface TasksWidgetProps {
  tasks: Task[]
  filter: 'all' | 'active' | 'done'
  stats: { total: number; active: number; done: number }
  onFilterChange: (f: 'all' | 'active' | 'done') => void
  onAdd: (title: string, priority: Task['priority']) => boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onClearCompleted: () => void
}

export function TasksWidget({
  tasks,
  filter,
  stats,
  onFilterChange,
  onAdd,
  onToggle,
  onDelete,
  onClearCompleted,
}: TasksWidgetProps) {
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [hint, setHint] = useState<string | null>(null)
  const canAdd = input.trim().length > 0

  const handleAdd = () => {
    if (!canAdd) {
      setHint('Type a task name first')
      return
    }
    if (onAdd(input, priority)) {
      setInput('')
      setHint(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAdd()
  }

  return (
    <Card span="half">
      <CardHeader
        icon={<ListTodo className="h-4 w-4" />}
        title="Task Manager"
        action={
          <span className="text-xs font-mono text-slate-500">
            {stats.active} active · {stats.done} done
          </span>
        }
      />
      <CardBody>
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (hint) setHint(null)
            }}
            placeholder="Add a task..."
            className="flex-1 rounded-lg border border-slate-600/60 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="rounded-lg border border-slate-600/60 bg-surface px-2 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Med</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
              canAdd
                ? 'bg-accent/20 text-accent hover:bg-accent/30'
                : 'bg-slate-700/40 text-slate-500'
            }`}
            aria-label="Add task"
          >
            <Plus className="pointer-events-none h-4 w-4" />
          </button>
        </form>
        {hint && <p className="mb-3 text-xs text-warning">{hint}</p>}

        <div className="mb-3 flex gap-1">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`rounded-md px-2.5 py-1 text-xs capitalize transition ${
                filter === f
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
          {stats.done > 0 && (
            <button
              onClick={onClearCompleted}
              className="ml-auto text-xs text-slate-500 hover:text-danger transition"
            >
              Clear done
            </button>
          )}
        </div>

        <ul className="max-h-52 space-y-2 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No tasks yet — add one above</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-2.5 rounded-lg border border-slate-700/30 bg-surface/40 px-3 py-2"
              >
                <button
                  onClick={() => onToggle(task.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    task.completed
                      ? 'border-success bg-success/20 text-success'
                      : 'border-slate-600 hover:border-accent'
                  }`}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </button>
                <span
                  className={`flex-1 text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}
                >
                  {task.title}
                </span>
                <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 text-slate-500 transition group-hover:opacity-100 hover:text-danger"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </CardBody>
    </Card>
  )
}
