'use client'

import { ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { DayBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency } from '@/lib/formatters'
import { BANK_DUE_DAY } from '@/lib/calculations'
import type { Debt } from '@/types'

interface DebtCardProps {
  debt: Debt
  onEdit: (debt: Debt) => void
}

export function DebtCard({ debt, onEdit }: DebtCardProps) {
  const dueDay = BANK_DUE_DAY[debt.bank]

  return (
    <button
      onClick={() => onEdit(debt)}
      className="flex items-center gap-3 w-full bg-white rounded-card border border-border p-4 text-left active:bg-gray-50 transition-colors min-h-[72px]"
      aria-label={`Editar ${debt.name}`}
    >
      <Avatar bank={debt.bank} name={debt.name} />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-text text-sm truncate">{debt.name}</p>
        <p className="text-[11px] text-muted">
          {debt.currentInstallment}/{debt.totalInstallments} parcelas · {debt.bank}
        </p>
        {debt.notes && (
          <p className="text-[10px] text-muted mt-0.5 truncate">{debt.notes}</p>
        )}
        <ProgressBar
          current={debt.currentInstallment}
          total={debt.totalInstallments}
          className="mt-2"
        />
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-black text-text">{formatCurrency(debt.monthlyAmount)}</span>
        <DayBadge day={dueDay} />
      </div>

      <ChevronRight size={16} className="text-muted shrink-0" aria-hidden="true" />
    </button>
  )
}
