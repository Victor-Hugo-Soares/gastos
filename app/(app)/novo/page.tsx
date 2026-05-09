'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { DebtForm } from '@/components/debts/DebtForm'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { cn } from '@/lib/cn'

type Tab = 'expense' | 'debt'

export default function NovoPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('expense')

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-2xl font-black text-text mb-5">
        {tab === 'expense' ? 'Novo Gasto' : 'Nova Dívida'}
      </h1>

      <div className="flex gap-2 mb-6 p-1 bg-white border border-border rounded-btn">
        <button
          type="button"
          onClick={() => setTab('expense')}
          className={cn(
            'flex-1 h-10 rounded-chip text-sm font-bold transition-all',
            tab === 'expense' ? 'bg-accent text-white' : 'text-muted'
          )}
        >
          Débito / Pix
        </button>
        <button
          type="button"
          onClick={() => setTab('debt')}
          className={cn(
            'flex-1 h-10 rounded-chip text-sm font-bold transition-all',
            tab === 'debt' ? 'bg-accent text-white' : 'text-muted'
          )}
        >
          Parcelado
        </button>
      </div>

      {user && tab === 'expense' && <ExpenseForm userId={user.uid} />}
      {user && tab === 'debt' && <DebtForm userId={user.uid} />}
    </div>
  )
}
