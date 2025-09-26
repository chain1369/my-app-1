'use client'

import { Card, CardContent } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'
import { Skill } from '@/lib/supabase'
import { getSkillLevelText } from '@/lib/utils'
import { Badge } from './ui/Badge'

interface SkillCardProps {
  skill: Skill
  onEdit?: (skill: Skill) => void
}

export function SkillCard({ skill, onEdit }: SkillCardProps) {
  const levelColor = skill.level >= 8 ? 'green' : skill.level >= 6 ? 'blue' : skill.level >= 4 ? 'orange' : 'red'
  
  return (
    <Card className="group" hover onClick={() => onEdit?.(skill)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {skill.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {skill.category}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{skill.level}/10</p>
              <p className="text-xs text-gray-500">{getSkillLevelText(skill.level)}</p>
            </div>
          </div>
          
          <ProgressBar 
            value={skill.level} 
            max={10} 
            color={levelColor}
            showLabel={false}
          />
          
          {skill.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {skill.description}
            </p>
          )}
          
          {skill.started_date && (
            <p className="text-xs text-gray-400">
              开始时间: {new Date(skill.started_date).toLocaleDateString('zh-CN')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

