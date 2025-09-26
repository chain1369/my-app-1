'use client'

import { Card, CardContent } from './ui/Card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon: LucideIcon
  className?: string
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  color = 'blue' 
}: StatsCardProps) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  }
  
  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }
  
  return (
    <Card className={cn('relative overflow-hidden', className)} hover>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {value}
            </motion.p>
            {change && (
              <p className={cn('text-xs font-medium', changeColors[change.type])}>
                {change.value}
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-full', colors[color])}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

