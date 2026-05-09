import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-5' }
  return (
    <div
      className={cn('bg-white rounded-card border border-border', paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}
