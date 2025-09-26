'use client'

import { Strength } from '@/lib/supabase'
import { Card } from './ui/Card'
import { ThumbsUp, Lightbulb } from 'lucide-react'

interface StrengthCardProps {
  strength: Strength
  onEdit?: (strength: Strength) => void
}

export function StrengthCard({ strength, onEdit }: StrengthCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50"
      onClick={() => onEdit?.(strength)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="font-semibold text-gray-900">{strength.name}</h3>
        </div>
      </div>

      <div className="space-y-3">
        {strength.description && (
          <p className="text-sm text-gray-600">
            {strength.description}
          </p>
        )}

        {strength.examples && (
          <div className="bg-white/60 rounded-lg p-3 border border-green-100">
            <div className="flex items-start">
              <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-green-700 mb-1">具体表现</p>
                <p className="text-sm text-gray-600">{strength.examples}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

