'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/hooks/useSearch'
import { DebtCard } from './DebtCard'
import { DebtEditModal } from './DebtEditModal'
import { getNextDueDate, isDueNextMonth } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import type { Debt } from '@/types'

export function DebtList() {
  const { filtered } = useSearch()
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const { thisMonth, nextMonth, thisMonthTotal, nextMonthTotal } = useMemo(() => {
    const today = new Date()
    const active = filtered.filter((d) => d.isActive)
    const sorted = [...active].sort(
      (a, b) => getNextDueDate(a.bank, today).getTime() - getNextDueDate(b.bank, today).getTime()
    )
    const thisMonth = sorted.filter((d) => !isDueNextMonth(d.bank, today))
    const nextMonth = sorted.filter((d) => isDueNextMonth(d.bank, today))
    const thisMonthTotal = thisMonth.reduce((s, d) => s + d.monthlyAmount, 0)
    const nextMonthTotal = nextMonth.reduce((s, d) => s + d.monthlyAmount, 0)
    return { thisMonth, nextMonth, thisMonthTotal, nextMonthTotal }
  }, [filtered])

  if (thisMonth.length === 0 && nextMonth.length === 0) {
    return (
      <div className="py-12 text-center text-muted">
        <p className="text-sm">Nenhuma dívida encontrada</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {thisMonth.length > 0 && (
          <>
            <SectionLabel>Este mês</SectionLabel>
            <AnimatePresence>
              {thisMonth.map((debt) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <DebtCard debt={debt} onEdit={setEditingDebt} />
                </motion.div>
              ))}
            </AnimatePresence>
            <TotalRow label="Total pendente este mês" value={thisMonthTotal} />
          </>
        )}

        {nextMonth.length > 0 && (
          <>
            <SectionLabel className={thisMonth.length > 0 ? 'mt-4' : ''}>Próximo mês</SectionLabel>
            <AnimatePresence>
              {nextMonth.map((debt) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="opacity-75"
                >
                  <DebtCard debt={debt} onEdit={setEditingDebt} />
                </motion.div>
              ))}
            </AnimatePresence>
            <TotalRow label="Total do próximo mês" value={nextMonthTotal} muted />
          </>
        )}
      </div>

      <AnimatePresence>
        {editingDebt && (
          <DebtEditModal debt={editingDebt} onClose={() => setEditingDebt(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-bold text-muted uppercase tracking-wide pl-1 ${className}`}>
      {children}
    </p>
  )
}

function TotalRow({ label, value, muted = false }: { label: string; value: number; muted?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-card px-4 py-3 mt-1 ${
        muted ? 'bg-bg border border-border' : 'bg-accent text-white'
      }`}
    >
      <span className={`text-xs font-bold uppercase tracking-wide ${muted ? 'text-muted' : 'text-white/80'}`}>
        {label}
      </span>
      <span className={`text-base font-black ${muted ? 'text-text' : 'text-white'}`}>
        {formatCurrency(value)}
      </span>
    </div>
  )
}
