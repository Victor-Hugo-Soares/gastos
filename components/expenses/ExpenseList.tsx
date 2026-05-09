'use client'

import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/lib/AuthContext'
import { formatCurrency, formatShortDate } from '@/lib/formatters'
import { deleteExpense } from '@/hooks/useExpenses'
import { Trash2 } from 'lucide-react'
import type { Expense, ExpenseCategory } from '@/types'

const CATEGORY_META: Record<ExpenseCategory, { label: string; emoji: string }> = {
  ALIMENTACAO: { label: 'Alimentação', emoji: '🍔' },
  MERCADO: { label: 'Mercado', emoji: '🛒' },
  TRANSPORTE: { label: 'Transporte', emoji: '🚗' },
  LAZER: { label: 'Lazer', emoji: '🎮' },
  SAUDE: { label: 'Saúde', emoji: '💊' },
  CASA: { label: 'Casa', emoji: '🏠' },
  OUTROS: { label: 'Outros', emoji: '📦' },
}

interface Props {
  limit?: number
}

export function ExpenseList({ limit }: Props) {
  const { expenses, removeExpense } = useAppStore()
  const { user } = useAuth()

  const items = limit ? expenses.slice(0, limit) : expenses

  async function handleDelete(expense: Expense) {
    if (!user) return
    if (!confirm(`Excluir "${expense.description}"? O valor será devolvido à conta ${expense.account}.`)) return
    removeExpense(expense.id)
    await deleteExpense(user.uid, { id: expense.id, amount: expense.amount, account: expense.account })
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-border rounded-card p-6 text-center">
        <p className="text-sm text-muted">Nenhum gasto registrado ainda.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((expense) => {
        const meta = CATEGORY_META[expense.category]
        return (
          <li
            key={expense.id}
            className="bg-white border border-border rounded-card p-3 flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full bg-bg flex items-center justify-center text-xl shrink-0">
              {meta.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-text truncate">{expense.description}</p>
              <p className="text-xs text-muted">
                {meta.label} · {expense.paymentMethod === 'PIX' ? 'Pix' : 'Débito'} · {expense.account === 'NUBANK' ? 'Nubank' : 'Inter'} · {formatShortDate(expense.date)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-sm text-text">{formatCurrency(expense.amount)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(expense)}
              className="p-2 text-muted hover:text-red-500 transition-colors shrink-0"
              aria-label="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
