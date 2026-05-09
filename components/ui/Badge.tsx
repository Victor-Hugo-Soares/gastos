import type { Bank } from '@/types'
import { cn } from '@/lib/cn'

interface BankBadgeProps {
  bank: Bank
}

const BANK_STYLES: Record<Bank, string> = {
  INTER: 'bg-inter-bg text-inter',
  BRADESCO: 'bg-bradesco-bg text-bradesco',
  NUBANK: 'bg-nubank-bg text-nubank',
  OUTROS: 'bg-outros-bg text-outros',
}

export function BankBadge({ bank }: BankBadgeProps) {
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wide', BANK_STYLES[bank])}>
      {bank}
    </span>
  )
}

interface DayBadgeProps {
  day: number
}

export function DayBadge({ day }: DayBadgeProps) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-gray-100 text-muted">
      dia {day}
    </span>
  )
}
