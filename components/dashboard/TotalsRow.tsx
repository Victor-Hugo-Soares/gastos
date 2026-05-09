'use client'

import { useSummary } from '@/hooks/useSummary'
import { formatCurrency } from '@/lib/formatters'
import { Card } from '@/components/ui/Card'

export function TotalsRow() {
  const { monthlyInstallments, totalOwed, activeDebtCount } = useSummary()

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Parcelas/Mês</p>
        <p className="text-xl font-black text-text">{formatCurrency(monthlyInstallments)}</p>
        <p className="text-[11px] text-muted mt-0.5">só dívidas, sem fixos</p>
      </Card>
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Total em Aberto</p>
        <p className="text-xl font-black text-text">{formatCurrency(totalOwed)}</p>
        <p className="text-[11px] text-muted mt-0.5">{activeDebtCount} parcelas pendentes</p>
      </Card>
    </div>
  )
}
