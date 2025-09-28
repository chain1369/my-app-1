'use client'

interface SimpleLoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function SimpleLoading({ 
  message = "加载中", 
  size = 'md',
  fullScreen = true 
}: SimpleLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const containerClass = fullScreen 
    ? "min-h-screen bg-white flex items-center justify-center"
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        {/* 简洁的加载指示器 */}
        <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin`} />
        
        {/* 加载文本 */}
        <p className="text-gray-600 text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  )
}

// 内联加载指示器
export function InlineLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin`} />
  )
}

// 按钮内加载状态
export function ButtonLoading() {
  return (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )
}


