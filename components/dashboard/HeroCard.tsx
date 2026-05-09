'use client'

import { useSummary } from '@/hooks/useSummary'
import { formatCurrency } from '@/lib/formatters'
import { useAppStore } from '@/store/useAppStore'

export function HeroCard() {
  const { monthlyTotal, currentMonth, subsTotal, activeDebtCount } = useSummary()
  const { subscriptions } = useAppStore()
  const activeSubs = subscriptions.filter((s) => s.isActive).length

  return (
    <div className="bg-accent rounded-card p-5 text-white">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
        Total este mês
      </p>
      <p className="text-4xl font-black tracking-tight mb-1">{formatCurrency(monthlyTotal)}</p>
      <p className="text-sm text-white/70 mb-4">
        {activeDebtCount} parcelas + {activeSubs} assinaturas
      </p>

      <div className="flex gap-2 flex-wrap">
        {currentMonth.groups.map((g) => (
          <Chip key={g.day} label={`Dia ${String(g.day).padStart(2, '0')}`} value={g.total} />
        ))}
        <Chip label="Fixos" value={subsTotal} />
      </div>
    </div>
  )
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 min-w-0 bg-white/15 rounded-chip px-3 py-2 text-center">
      <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-white truncate">{formatCurrency(value)}</p>
    </div>
  )
}
