'use client'

import { Card } from '@/components/ui/Card'
import { PaymentGroup } from './PaymentGroup'
import { formatCurrency, formatMonth } from '@/lib/formatters'
import { calcMonthProjection } from '@/lib/calculations'
import type { Debt } from '@/types'

interface MonthGroupProps {
  debts: Debt[]
  monthOffset: number
}

export function MonthGroup({ debts, monthOffset }: MonthGroupProps) {
  const date = new Date()
  date.setMonth(date.getMonth() + monthOffset)

  const { total, groups } = calcMonthProjection(debts, monthOffset)
  const monthLabel = formatMonth(date)

  if (total === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-black text-text text-base">{monthLabel}</h2>
        {monthOffset === 0 && (
          <span className="text-[10px] font-bold bg-accent text-white px-2 py-0.5 rounded-pill uppercase">
            Atual
          </span>
        )}
      </div>

      <Card className="bg-accent-light border-accent/20 mb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-accent">Total do mês</p>
          <p className="text-lg font-black text-accent">{formatCurrency(total)}</p>
        </div>
      </Card>

      <Card>
        {groups.map((group, idx) => {
          const banks = Array.from(new Set(group.debts.map((d) => d.bank)))
          return (
            <div key={group.day}>
              {idx > 0 && <div className="border-t border-border my-3" />}
              <PaymentGroup day={group.day} debts={group.debts} banks={banks} />
            </div>
          )
        })}
      </Card>
    </div>
  )
}
