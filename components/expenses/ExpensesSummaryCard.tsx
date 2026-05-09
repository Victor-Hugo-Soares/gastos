'use client'

import { useAppStore } from '@/store/useAppStore'
import { calcMonthExpensesTotal, calcExpensesByMethod, filterMonthExpenses } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'

export function ExpensesSummaryCard() {
  const { expenses } = useAppStore()

  const total = calcMonthExpensesTotal(expenses)
  const byMethod = calcExpensesByMethod(expenses)
  const count = filterMonthExpenses(expenses).length

  return (
    <div className="bg-white border border-border rounded-card p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-xs font-bold text-muted uppercase tracking-wide">Gastos do Mês</p>
        <p className="text-[10px] text-muted">{count} {count === 1 ? 'gasto' : 'gastos'}</p>
      </div>

      <p className="text-3xl font-black text-text mb-3">{formatCurrency(total)}</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-chip bg-bg px-3 py-2">
          <p className="text-[10px] font-bold text-muted uppercase">Débito</p>
          <p className="text-sm font-black text-text">{formatCurrency(byMethod.DEBITO)}</p>
        </div>
        <div className="rounded-chip bg-bg px-3 py-2">
          <p className="text-[10px] font-bold text-muted uppercase">Pix</p>
          <p className="text-sm font-black text-text">{formatCurrency(byMethod.PIX)}</p>
        </div>
      </div>
    </div>
  )
}
