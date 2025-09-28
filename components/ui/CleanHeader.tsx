'use client'

import { useState } from 'react'
import { CleanButton } from './CleanButton'
import { 
  Plus,
  Target, 
  Award, 
  DollarSign, 
  Sparkles, 
  ThumbsUp, 
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react'

interface CleanHeaderProps {
  onAddSkill: () => void
  onAddMilestone: () => void
  onAddAsset: () => void
  onAddTalent: () => void
  onAddStrength: () => void
  onAddWeakness: () => void
  onEditProfile: () => void
  onSignOut: () => void
}

export function CleanHeader({
  onAddSkill,
  onAddMilestone,
  onAddAsset,
  onAddTalent,
  onAddStrength,
  onAddWeakness,
  onEditProfile,
  onSignOut
}: CleanHeaderProps) {
  const [showQuickActions, setShowQuickActions] = useState(false)

  const quickActions = [
    { icon: Award, label: '添加技能', action: onAddSkill },
    { icon: Target, label: '新建里程碑', action: onAddMilestone },
    { icon: DollarSign, label: '添加资产', action: onAddAsset },
    { icon: Sparkles, label: '添加天赋', action: onAddTalent },
    { icon: ThumbsUp, label: '添加优点', action: onAddStrength },
    { icon: AlertTriangle, label: '改进方面', action: onAddWeakness },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo和标题区域 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                人生仪表板
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                追踪你的成长与进步
              </p>
            </div>
          </div>
          
          {/* 操作区域（桌面 & 移动一致） */}
          <div className="flex items-center space-x-2">
            {/* 快速添加下拉菜单 */}
            <div className="relative">
              <CleanButton 
                variant="primary"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="px-4 py-2 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
              </CleanButton>
              
              {/* 下拉菜单 */}
              {showQuickActions && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => {
                          action.action()
                          setShowQuickActions(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* 设置和退出按钮 */}
            <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
              <CleanButton 
                variant="ghost"
                size="sm"
                onClick={onEditProfile}
              >
                <Settings className="h-4 w-4" />
              </CleanButton>
              <CleanButton 
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </CleanButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* 点击外部关闭下拉菜单 */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </header>
  )
}


