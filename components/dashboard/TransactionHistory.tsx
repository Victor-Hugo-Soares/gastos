'use client'

import { useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/lib/AuthContext'
import { formatCurrency, formatShortDate } from '@/lib/formatters'
import { deleteExpense } from '@/hooks/useExpenses'
import { deleteDeposit } from '@/hooks/useDeposits'
import { cn } from '@/lib/cn'
import type { Transaction, ExpenseCategory, AccountBank } from '@/types'

const CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  ALIMENTACAO: '🍔',
  MERCADO: '🛒',
  TRANSPORTE: '🚗',
  LAZER: '🎮',
  SAUDE: '💊',
  CASA: '🏠',
  OUTROS: '📦',
}

const ACCOUNT_LABEL: Record<AccountBank, string> = {
  NUBANK: 'Nubank',
  INTER: 'Inter',
}

interface Props {
  limit?: number
}

export function TransactionHistory({ limit }: Props) {
  const { expenses, deposits, removeExpense, removeDeposit } = useAppStore()
  const { user } = useAuth()

  const transactions = useMemo<Transaction[]>(() => {
    const fromExpenses: Transaction[] = expenses.map((e) => ({
      kind: 'expense',
      data: e,
      amount: e.amount,
      date: e.date,
      account: e.account,
    }))
    const fromDeposits: Transaction[] = deposits.map((d) => ({
      kind: 'deposit',
      data: d,
      amount: d.amount,
      date: d.date,
      account: d.account,
    }))
    return [...fromExpenses, ...fromDeposits].sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [expenses, deposits])

  const items = limit ? transactions.slice(0, limit) : transactions

  async function handleDelete(t: Transaction) {
    if (!user) return
    const label = t.kind === 'expense' ? t.data.description : t.data.description
    const note =
      t.kind === 'expense'
        ? `O valor será devolvido à conta ${ACCOUNT_LABEL[t.account]}.`
        : `O valor será removido da conta ${ACCOUNT_LABEL[t.account]}.`
    if (!confirm(`Excluir "${label}"? ${note}`)) return

    if (t.kind === 'expense') {
      removeExpense(t.data.id)
      await deleteExpense(user.uid, { id: t.data.id, amount: t.data.amount, account: t.data.account })
    } else {
      removeDeposit(t.data.id)
      await deleteDeposit(user.uid, { id: t.data.id, amount: t.data.amount, account: t.data.account })
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-border rounded-card p-6 text-center">
        <p className="text-sm text-muted">Nenhuma transação ainda.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((t) => {
        const isExpense = t.kind === 'expense'
        const sign = isExpense ? '-' : '+'
        const amountClass = isExpense ? 'text-text' : 'text-green'
        const icon = isExpense ? CATEGORY_EMOJI[t.data.category] : '💰'
        const description = t.data.description
        const subtitle = isExpense
          ? `${t.data.paymentMethod === 'PIX' ? 'Pix' : 'Débito'} · ${ACCOUNT_LABEL[t.account]} · ${formatShortDate(t.date)}`
          : `Entrada · ${ACCOUNT_LABEL[t.account]} · ${formatShortDate(t.date)}`

        return (
          <li
            key={`${t.kind}-${t.data.id}`}
            className="bg-white border border-border rounded-card p-3 flex items-center gap-3"
          >
            <div
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 relative',
                isExpense ? 'bg-bg' : 'bg-green/10'
              )}
            >
              <span>{icon}</span>
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white',
                  isExpense ? 'bg-text/70' : 'bg-green'
                )}
              >
                {isExpense ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-text truncate">{description}</p>
              <p className="text-[11px] text-muted truncate">{subtitle}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={cn('font-black text-sm', amountClass)}>
                {sign} {formatCurrency(t.amount)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(t)}
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
