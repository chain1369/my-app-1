'use client'

import { cn } from '@/lib/utils'

interface CleanCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  variant?: 'default' | 'elevated'
}

export function CleanCard({ 
  children, 
  className, 
  hover = false, 
  onClick,
  variant = 'default'
}: CleanCardProps) {
  const baseStyles = 'bg-white rounded-lg transition-smooth'
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'shadow-sm hover:shadow-md'
  }
  
  const hoverStyles = hover ? 'hover:shadow-md cursor-pointer hover:-translate-y-0.5' : ''

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CleanCardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  )
}

export function CleanCardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CleanCardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

export function CleanCardDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  )
}


