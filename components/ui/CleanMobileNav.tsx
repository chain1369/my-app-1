'use client'

import { useState } from 'react'
import { CleanButton } from './CleanButton'
import {
  Plus,
  X,
  Award,
  Target,
  DollarSign,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react'

interface CleanMobileNavProps {
  onAddSkill: () => void
  onAddMilestone: () => void
  onAddAsset: () => void
  onAddTalent: () => void
  onAddStrength: () => void
  onAddWeakness: () => void
}

export function CleanMobileNav({
  onAddSkill,
  onAddMilestone,
  onAddAsset,
  onAddTalent,
  onAddStrength,
  onAddWeakness,
}: CleanMobileNavProps) {
  const [open, setOpen] = useState(false)

  const actions = [
    { label: '添加技能', icon: Award, action: onAddSkill },
    { label: '新建里程碑', icon: Target, action: onAddMilestone },
    { label: '添加资产', icon: DollarSign, action: onAddAsset },
    { label: '添加天赋', icon: Sparkles, action: onAddTalent },
    { label: '添加优点', icon: ThumbsUp, action: onAddStrength },
    { label: '改进方面', icon: AlertTriangle, action: onAddWeakness },
  ]

  const handleAction = (callback: () => void) => {
    callback()
    setOpen(false)
  }

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-24 z-50 flex flex-col space-y-3 lg:hidden">
            {actions.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={() => handleAction(action)}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-lg hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </>
      )}

      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
        <CleanButton
          variant="primary"
          size="lg"
          onClick={() => setOpen((prev) => !prev)}
          className="h-14 w-14 rounded-full p-0 shadow-2xl"
          aria-label={open ? '关闭快速操作' : '打开快速操作'}
        >
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </CleanButton>
      </div>
    </>
  )
}


