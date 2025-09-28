'use client'

import { useMemo } from 'react'
import type { Asset, Skill, Milestone, Talent, Strength, Weakness } from '@/lib/supabase'

interface FocusInsights {
  dailyFocus: string[]
  weeklyHighlights: string[]
  improvementSuggestions: string[]
}

function isDateWithinDays(date?: string | null, days = 7) {
  if (!date) return false
  const target = new Date(date)
  const today = new Date()
  const diff = today.getTime() - target.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

export function useFocusAreas({
  skills,
  milestones,
  assets,
  talents,
  strengths,
  weaknesses,
}: {
  skills: Skill[]
  milestones: Milestone[]
  assets: Asset[]
  talents: Talent[]
  strengths: Strength[]
  weaknesses: Weakness[]
}) {
  return useMemo<FocusInsights>(() => {
    const dailyFocus: string[] = []
    const weeklyHighlights: string[] = []
    const improvementSuggestions: string[] = []

    const activeMilestone = milestones.find((milestone) => milestone.status === 'in_progress')
    if (activeMilestone) {
      dailyFocus.push(`推进里程碑【${activeMilestone.title}】`)
    }

    const developingSkill = [...skills].sort((a, b) => a.level - b.level)[0]
    if (developingSkill) {
      dailyFocus.push(`练习技能【${developingSkill.name}】`)
    }

    const recentCompletion = milestones.find(
      (milestone) => milestone.status === 'completed' && isDateWithinDays(milestone.updated_at, 7)
    )
    if (recentCompletion) {
      weeklyHighlights.push(`完成里程碑：${recentCompletion.title}`)
    }

    const topAsset = [...assets].sort((a, b) => (b.current_value || 0) - (a.current_value || 0))[0]
    if (topAsset) {
      weeklyHighlights.push(`最具价值资产：${topAsset.name}`)
    }

    const standoutTalent = talents[0]
    if (standoutTalent) {
      weeklyHighlights.push(`发挥天赋：${standoutTalent.name}`)
    }

    const priorityWeakness = weaknesses.find((weakness) => weakness.priority === 3)
    if (priorityWeakness) {
      improvementSuggestions.push(`重点改进【${priorityWeakness.title}】`)
    }

    const laggingMilestone = milestones.find((milestone) => (milestone.progress || 0) < 30)
    if (laggingMilestone) {
      improvementSuggestions.push(`推进缓慢的里程碑：${laggingMilestone.title}`)
    }

    const dormantStrength = strengths.find((strength) => !strength.updated_at || !isDateWithinDays(strength.updated_at, 14))
    if (dormantStrength) {
      improvementSuggestions.push(`展示优势：${dormantStrength.title}`)
    }

    return {
      dailyFocus,
      weeklyHighlights,
      improvementSuggestions,
    }
  }, [assets, milestones, skills, strengths, talents, weaknesses])
}


