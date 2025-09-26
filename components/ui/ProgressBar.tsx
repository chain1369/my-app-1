'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress?: number
  value?: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

export function ProgressBar({ 
  progress,
  value, 
  max = 100, 
  className, 
  showLabel = true,
  color = 'blue' 
}: ProgressBarProps) {
  // 支持两种方式：直接传progress百分比，或者传value和max计算
  const percentage = progress !== undefined ? Math.min(progress, 100) : Math.min(((value || 0) / max) * 100, 100)
  
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  }
  
  const backgroundColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50'
  }
  
  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn(
        'relative h-2 rounded-full overflow-hidden shadow-inner',
        backgroundColors[color]
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r shadow-sm',
            colors[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && value !== undefined && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}
