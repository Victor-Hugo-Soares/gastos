'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/lib/AuthContext'
import { updateDebtInstallment } from '@/hooks/useDebts'
import { formatCurrency } from '@/lib/formatters'
import { isDueNextMonth, BANK_DUE_DAY } from '@/lib/calculations'
import { cn } from '@/lib/cn'
import type { AccountBank, Debt } from '@/types'

interface PayModalProps {
  bank: AccountBank
  onClose: () => void
}

const ACCOUNT_META: Record<AccountBank, { label: string; text: string }> = {
  NUBANK: { label: 'Nubank', text: 'text-nubank' },
  INTER: { label: 'Inter', text: 'text-inter' },
}

export function PayModal({ bank, onClose }: PayModalProps) {
  const { debts, updateDebt } = useAppStore()
  const { user } = useAuth()
  const [paying, setPaying] = useState<Set<string>>(new Set())
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set())

  const today = new Date()
  const meta = ACCOUNT_META[bank]
  const dueDay = BANK_DUE_DAY[bank]

  const activeDebts = debts.filter((d) => d.isActive && d.bank === bank && !paidIds.has(d.id))
  const thisMonth = activeDebts.filter((d) => !isDueNextMonth(d.bank, today))
  const nextMonth = activeDebts.filter((d) => isDueNextMonth(d.bank, today))

  async function handlePay(debt: Debt) {
    if (!user || paying.has(debt.id)) return
    setPaying((prev) => new Set(prev).add(debt.id))

    const newInstallment = debt.currentInstallment + 1
    const result = await updateDebtInstallment(user.uid, debt.id, newInstallment)

    if (result.success) {
      updateDebt(debt.id, { currentInstallment: newInstallment })
      setPaidIds((prev) => new Set(prev).add(debt.id))
    }

    setPaying((prev) => {
      const next = new Set(prev)
      next.delete(debt.id)
      return next
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-t-card sm:rounded-card p-5 pb-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-text">Marcar como pago</h2>
            <p className={cn('text-xs font-bold', meta.text)}>{meta.label}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 -mr-2 text-muted" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {thisMonth.length === 0 && nextMonth.length === 0 && (
          <p className="text-sm text-muted text-center py-8">
            Nenhuma parcela pendente para {meta.label}.
          </p>
        )}

        {thisMonth.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wide">
              Vence dia {dueDay}
            </p>
            {thisMonth.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                loading={paying.has(debt.id)}
                onPay={() => handlePay(debt)}
              />
            ))}
          </div>
        )}

        {nextMonth.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wide mt-2">
              Próximo mês · dia {dueDay}
            </p>
            {nextMonth.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                loading={paying.has(debt.id)}
                onPay={() => handlePay(debt)}
                muted
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function DebtRow({
  debt,
  loading,
  onPay,
  muted = false,
}: {
  debt: Debt
  loading: boolean
  onPay: () => void
  muted?: boolean
}) {
  const remaining = debt.totalInstallments - debt.currentInstallment + 1
  const isLast = remaining === 1

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card border border-border px-3 py-2.5',
        muted && 'opacity-60'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-text truncate">{debt.name}</p>
        <p className="text-xs text-muted">
          {formatCurrency(debt.monthlyAmount)} · {debt.currentInstallment}/{debt.totalInstallments}
          {isLast ? ' · última parcela' : ` · ${remaining - 1} restante${remaining - 1 > 1 ? 's' : ''}`}
        </p>
      </div>
      <button
        type="button"
        onClick={onPay}
        disabled={loading}
        className="shrink-0 h-9 px-4 rounded-btn bg-accent text-white text-sm font-bold disabled:opacity-50 flex items-center gap-1.5 transition-opacity"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Check size={14} />
        )}
        Pago
      </button>
    </div>
  )
}
