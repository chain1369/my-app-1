'use client'

import { Talent } from '@/lib/supabase'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { ProgressBar } from './ui/ProgressBar'
import { Sparkles, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface TalentCardProps {
  talent: Talent
  onEdit?: (talent: Talent) => void
}

const categoryColors: { [key: string]: string } = {
  creative: 'bg-purple-100 text-purple-800',
  analytical: 'bg-blue-100 text-blue-800',
  social: 'bg-green-100 text-green-800',
  physical: 'bg-orange-100 text-orange-800',
  technical: 'bg-indigo-100 text-indigo-800',
  general: 'bg-gray-100 text-gray-800'
}

const getLevelText = (level: number): string => {
  if (level <= 2) return '初现'
  if (level <= 4) return '发展中'
  if (level <= 6) return '良好'
  if (level <= 8) return '优秀'
  return '卓越'
}

export function TalentCard({ talent, onEdit }: TalentCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onEdit?.(talent)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-semibold text-gray-900">{talent.name}</h3>
        </div>
        <Badge 
          className={`${categoryColors[talent.category] || categoryColors.general} text-xs`}
        >
          {talent.category === 'creative' && '创意'}
          {talent.category === 'analytical' && '分析'}
          {talent.category === 'social' && '社交'}
          {talent.category === 'physical' && '体能'}
          {talent.category === 'technical' && '技术'}
          {talent.category === 'general' && '通用'}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">天赋等级</span>
            <span className="text-sm font-medium text-gray-900">
              {talent.level}/10 · {getLevelText(talent.level)}
            </span>
          </div>
          <ProgressBar 
            progress={talent.level * 10} 
            className="h-2"
            color="purple"
          />
        </div>

        {talent.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {talent.description}
          </p>
        )}

        {talent.discovered_date && (
          <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
            <Calendar className="h-3 w-3 mr-1" />
            发现于 {format(new Date(talent.discovered_date), 'yyyy年M月d日')}
          </div>
        )}
      </div>
    </Card>
  )
}

