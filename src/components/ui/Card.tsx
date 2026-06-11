import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  span?: 'full' | 'half' | 'third'
}

const spanClass = {
  full: 'col-span-full',
  half: 'col-span-1 lg:col-span-1',
  third: 'col-span-1',
}

export function Card({ children, className = '', span = 'half' }: CardProps) {
  return (
    <div
      className={`${spanClass[span]} animate-fade-in rounded-2xl border border-slate-700/50 bg-surface-raised/80 backdrop-blur-sm shadow-xl shadow-black/20 ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  icon,
  title,
  action,
}: {
  icon: ReactNode
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/40 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span className="text-accent">{icon}</span>
        <h2 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}
