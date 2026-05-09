import { cn } from '@/lib/cn'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0

  return (
    <div className={cn('h-1.5 w-full rounded-full bg-gray-100 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      />
    </div>
  )
}
