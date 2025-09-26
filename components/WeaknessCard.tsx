'use client'

import { Weakness } from '@/lib/supabase'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { AlertTriangle, Target } from 'lucide-react'

interface WeaknessCardProps {
  weakness: Weakness
  onEdit?: (weakness: Weakness) => void
}

const priorityColors: { [key: number]: string } = {
  1: 'bg-gray-100 text-gray-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-red-100 text-red-800'
}

const priorityText: { [key: number]: string } = {
  1: '低优先级',
  2: '中优先级',
  3: '高优先级'
}

export function WeaknessCard({ weakness, onEdit }: WeaknessCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-orange-50 to-red-50"
      onClick={() => onEdit?.(weakness)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-semibold text-gray-900">{weakness.name}</h3>
        </div>
        <Badge 
          className={`${priorityColors[weakness.priority]} text-xs`}
        >
          {priorityText[weakness.priority]}
        </Badge>
      </div>

      <div className="space-y-3">
        {weakness.description && (
          <p className="text-sm text-gray-600">
            {weakness.description}
          </p>
        )}

        {weakness.improvement_plan && (
          <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
            <div className="flex items-start">
              <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-orange-700 mb-1">改进计划</p>
                <p className="text-sm text-gray-600">{weakness.improvement_plan}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
