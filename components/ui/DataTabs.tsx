'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface DataTab {
  id: string
  label: string
  badge?: number
  icon?: React.ComponentType<{ className?: string }>
  content: React.ReactNode
}

interface DataTabsProps {
  tabs: DataTab[]
  defaultTabId?: string
  onTabChange?: (id: string) => void
}

export function DataTabs({ tabs, defaultTabId, onTabChange }: DataTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId ?? tabs[0]?.id)

  const handleChange = (id: string) => {
    setActiveTab(id)
    onTabChange?.(id)
  }

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-gray-200">
        <div className="flex min-w-full gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => handleChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors',
                  'border border-transparent border-b-0',
                  isActive
                    ? 'bg-white text-gray-900 border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-b-lg border border-gray-200 bg-white p-4">
        {activeContent}
      </div>
    </div>
  )
}


