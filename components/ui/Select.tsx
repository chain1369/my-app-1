'use client'

import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-10
            bg-white/80 backdrop-blur-sm
            border border-gray-200/80 rounded-xl
            text-gray-900 text-sm
            focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
            focus:outline-none
            transition-all duration-200
            hover:bg-white/90 hover:border-gray-300/80
            appearance-none cursor-pointer
            shadow-sm
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }

