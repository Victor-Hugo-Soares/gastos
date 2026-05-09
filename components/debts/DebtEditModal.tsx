'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/formatters'
import { updateDebtInstallment } from '@/hooks/useDebts'
import { useAppStore } from '@/store/useAppStore'
import type { Debt } from '@/types'

interface DebtEditModalProps {
  debt: Debt
  onClose: () => void
}

export function DebtEditModal({ debt, onClose }: DebtEditModalProps) {
  const { updateDebt } = useAppStore()
  const [current, setCurrent] = useState(debt.currentInstallment)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!debt.userId) return
    setLoading(true)
    setError(null)

    const result = await updateDebtInstallment(debt.userId, debt.id, current)
    if (result.success) {
      updateDebt(debt.id, { currentInstallment: current })
      onClose()
    } else {
      setError('Erro ao salvar. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Editar ${debt.name}`}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-card p-6 pb-safe"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-text text-lg">{debt.name}</h2>
            <p className="text-sm text-muted">{debt.bank} · {formatCurrency(debt.monthlyAmount)}/mês</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-muted min-h-[44px] min-w-[44px]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {debt.notes && (
          <div className="bg-accent-light rounded-chip p-3 mb-5">
            <p className="text-xs text-accent">{debt.notes}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm font-semibold text-text mb-3">Parcela atual</p>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-text active:bg-gray-200 min-h-[44px] min-w-[44px]"
              aria-label="Diminuir parcela"
              disabled={current <= 1}
            >
              <Minus size={20} />
            </button>
            <div className="text-center">
              <span className="text-4xl font-black text-text">{current}</span>
              <span className="text-xl text-muted">/{debt.totalInstallments}</span>
            </div>
            <button
              onClick={() => setCurrent((c) => Math.min(debt.totalInstallments, c + 1))}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-text active:bg-gray-200 min-h-[44px] min-w-[44px]"
              aria-label="Aumentar parcela"
              disabled={current >= debt.totalInstallments}
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${(current / debt.totalInstallments) * 100}%` }}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-3 text-center">{error}</p>}

        <Button
          onClick={handleSave}
          loading={loading}
          className="w-full"
          disabled={current === debt.currentInstallment}
        >
          Salvar alteração
        </Button>
      </motion.div>
    </div>
  )
}
