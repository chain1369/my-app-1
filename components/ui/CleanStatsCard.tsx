'use client'

import { CleanCard } from './CleanCard'

interface CleanStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
}

export function CleanStatsCard({
  title,
  value,
  subtitle,
  icon: Icon
}: CleanStatsCardProps) {
  return (
    <CleanCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-gray-900">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </CleanCard>
  )
}




