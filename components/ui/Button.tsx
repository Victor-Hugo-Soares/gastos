'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-btn transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-accent text-white hover:bg-blue-700',
      secondary: 'bg-white text-text border border-border hover:bg-gray-50',
      ghost: 'text-muted hover:bg-gray-100',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm min-h-[36px]',
      md: 'h-11 px-5 text-sm min-h-[44px]',
      lg: 'h-12 px-6 text-base min-h-[48px]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </span>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
