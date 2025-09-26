'use client'

import { forwardRef } from 'react'

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ color = 'blue', className = '', ...props }, ref) => {
    const colors = {
      blue: 'accent-blue-500',
      green: 'accent-green-500',
      orange: 'accent-orange-500',
      red: 'accent-red-500',
      purple: 'accent-purple-500'
    }
    
    return (
      <input
        ref={ref}
        type="range"
        className={`
          w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
          slider-modern
          ${colors[color]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }

