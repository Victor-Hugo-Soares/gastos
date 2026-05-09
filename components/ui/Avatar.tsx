import type { Bank } from '@/types'
import { cn } from '@/lib/cn'

interface AvatarProps {
  bank: Bank
  name: string
  size?: number
}

const BANK_COLORS: Record<Bank, { bg: string; text: string }> = {
  INTER: { bg: 'bg-inter-bg', text: 'text-inter' },
  BRADESCO: { bg: 'bg-bradesco-bg', text: 'text-bradesco' },
  NUBANK: { bg: 'bg-nubank-bg', text: 'text-nubank' },
  OUTROS: { bg: 'bg-outros-bg', text: 'text-outros' },
}

export function Avatar({ bank, name, size = 44 }: AvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const { bg, text } = BANK_COLORS[bank]

  return (
    <div
      className={cn('rounded-chip flex items-center justify-center font-bold text-sm shrink-0', bg, text)}
      style={{ width: size, height: size, minWidth: size }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
