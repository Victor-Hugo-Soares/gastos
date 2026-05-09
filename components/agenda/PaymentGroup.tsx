import type { Debt } from '@/types'
import { formatCurrency } from '@/lib/formatters'
import { BankBadge } from '@/components/ui/Badge'

interface PaymentGroupProps {
  day: number
  debts: Debt[]
  banks: Debt['bank'][]
}

export function PaymentGroup({ day, debts, banks }: PaymentGroupProps) {
  const total = debts.reduce((s, d) => s + d.monthlyAmount, 0)

  if (debts.length === 0) return null

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wide">Dia {day}</span>
          <div className="flex gap-1">
            {banks.map((bank) => (
              <BankBadge key={bank} bank={bank} />
            ))}
          </div>
        </div>
        <span className="text-sm font-bold text-text">{formatCurrency(total)}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {debts.map((debt) => (
          <div key={debt.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{debt.name}</p>
              <p className="text-[11px] text-muted">
                {debt.currentInstallment}/{debt.totalInstallments}
              </p>
            </div>
            <span className="text-sm font-semibold text-text">{formatCurrency(debt.monthlyAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
