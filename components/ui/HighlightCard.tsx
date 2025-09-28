'use client'

import { cn } from '@/lib/utils'

interface HighlightCardProps {
  title: string
  subtitle?: string
  metric?: string
  trend?: 'up' | 'down' | 'steady'
  trendLabel?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function HighlightCard({
  title,
  subtitle,
  metric,
  trend,
  trendLabel,
  actions,
  children,
  variant = 'primary',
}: HighlightCardProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100',
    secondary: 'bg-white border-gray-200',
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    steady: 'text-gray-600',
  } as const

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="mt-1 text-2xl font-semibold text-gray-900">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      {(metric || trendLabel) && (
        <div className="mt-4 flex items-end gap-3">
          {metric && <p className="text-4xl font-bold text-gray-900">{metric}</p>}
          {trendLabel && (
            <span className={cn('text-sm font-medium', trend ? trendColors[trend] : 'text-gray-600')}>
              {trendLabel}
            </span>
          )}
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}


