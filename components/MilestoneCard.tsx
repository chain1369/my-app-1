'use client'

import { Card, CardContent } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'
import { Badge } from './ui/Badge'
import { Milestone } from '@/lib/supabase'
import { getMilestoneStatusColor, getMilestoneStatusText, formatDate } from '@/lib/utils'
import { Calendar, Target, Clock } from 'lucide-react'

interface MilestoneCardProps {
  milestone: Milestone
  onEdit?: (milestone: Milestone) => void
}

export function MilestoneCard({ milestone, onEdit }: MilestoneCardProps) {
  const statusColor = milestone.status === 'completed' ? 'success' : 
                     milestone.status === 'in_progress' ? 'primary' : 
                     milestone.status === 'cancelled' ? 'secondary' : 'warning'
  
  const progressColor = milestone.progress >= 80 ? 'green' : 
                       milestone.progress >= 50 ? 'blue' : 
                       milestone.progress >= 25 ? 'orange' : 'red'
  
  return (
    <Card className="group" hover onClick={() => onEdit?.(milestone)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {milestone.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusColor} className="text-xs">
                  {getMilestoneStatusText(milestone.status)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {milestone.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Target className="h-3 w-3" />
              <span>P{milestone.priority}</span>
            </div>
          </div>
          
          {milestone.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {milestone.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度</span>
              <span>{milestone.progress}%</span>
            </div>
            <ProgressBar 
              value={milestone.progress} 
              max={100} 
              color={progressColor}
              showLabel={false}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            {milestone.target_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>目标: {formatDate(milestone.target_date)}</span>
              </div>
            )}
            {milestone.completed_date && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>完成: {formatDate(milestone.completed_date)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

