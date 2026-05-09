'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-btn border border-border bg-white px-4 text-sm text-text placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all min-h-[44px]',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
