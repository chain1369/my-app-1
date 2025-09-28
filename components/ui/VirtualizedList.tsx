'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    )

    const start = Math.max(0, visibleStart - overscan)
    const end = Math.min(items.length - 1, visibleEnd + overscan)

    return { start, end }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }))
  }, [items, visibleRange])

  const offsetY = visibleRange.start * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 使用示例组件
interface ListItemProps {
  title: string
  description: string
  value: number
}

export function OptimizedSkillList({ 
  skills 
}: { 
  skills: Array<{ name: string; description?: string; level: number; id: string }> 
}) {
  const renderSkillItem = (skill: any, index: number) => (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl rounded-lg border border-gray-200/50 mx-2">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
        {skill.description && (
          <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
        )}
      </div>
      <div className="ml-4">
        <div className="text-lg font-bold text-blue-600">
          {skill.level}/10
        </div>
      </div>
    </div>
  )

  if (skills.length <= 10) {
    // 少量数据时不使用虚拟化
    return (
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={skill.id}>
            {renderSkillItem(skill, index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <VirtualizedList
      items={skills}
      itemHeight={80}
      containerHeight={400}
      renderItem={renderSkillItem}
      className="rounded-lg border border-gray-200/50"
    />
  )
}


