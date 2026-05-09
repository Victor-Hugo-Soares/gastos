'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Pencil, Check, X, Plus } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/lib/AuthContext'
import { formatCurrency } from '@/lib/formatters'
import { setAccountBalance } from '@/hooks/useAccounts'
import { DepositModal } from './DepositModal'
import { PayModal } from './PayModal'
import { cn } from '@/lib/cn'
import type { AccountBank } from '@/types'

const ACCOUNT_META: Record<AccountBank, { label: string; bg: string; text: string }> = {
  NUBANK: { label: 'Nubank', bg: 'bg-nubank-bg', text: 'text-nubank' },
  INTER: { label: 'Inter', bg: 'bg-inter-bg', text: 'text-inter' },
}

export function AccountsCard() {
  const { accounts } = useAppStore()
  const { user } = useAuth()
  const [editing, setEditing] = useState<AccountBank | null>(null)
  const [draft, setDraft] = useState('')
  const [depositFor, setDepositFor] = useState<AccountBank | null>(null)
  const [payFor, setPayFor] = useState<AccountBank | null>(null)

  const total = accounts.reduce((s, a) => s + a.balance, 0)

  function startEdit(bank: AccountBank, current: number) {
    setEditing(bank)
    setDraft(current.toFixed(2))
  }

  async function commitEdit() {
    if (!user || !editing) return
    const value = Number(draft.replace(',', '.'))
    if (!Number.isFinite(value)) {
      setEditing(null)
      return
    }
    await setAccountBalance(user.uid, editing, value)
    setEditing(null)
  }

  function cancelEdit() {
    setEditing(null)
    setDraft('')
  }

  return (
    <>
      <div className="bg-white border border-border rounded-card p-4">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-xs font-bold text-muted uppercase tracking-wide">Saldo nas contas</p>
          <p className="text-sm font-black text-text">{formatCurrency(total)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {(['NUBANK', 'INTER'] as AccountBank[]).map((bank) => {
            const account = accounts.find((a) => a.bank === bank)
            const balance = account?.balance ?? 0
            const meta = ACCOUNT_META[bank]
            const isEditing = editing === bank

            return (
              <div
                key={bank}
                className={cn('rounded-chip px-3 py-2 cursor-pointer', meta.bg)}
                onClick={() => { if (!isEditing) setPayFor(bank) }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={cn('text-[10px] font-bold uppercase tracking-wide', meta.text)}>
                    {meta.label}
                  </p>
                  {!isEditing ? (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDepositFor(bank) }}
                        className={cn('p-0.5', meta.text)}
                        aria-label={`Recarregar ${meta.label}`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); startEdit(bank, balance) }}
                        className={cn('p-0.5', meta.text)}
                        aria-label={`Editar saldo ${meta.label}`}
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={commitEdit}
                        className={cn('p-0.5', meta.text)}
                        aria-label="Salvar"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-0.5 text-muted"
                        aria-label="Cancelar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className={cn(
                      'w-full text-base font-black bg-transparent outline-none',
                      meta.text
                    )}
                    autoFocus
                  />
                ) : (
                  <p className={cn('text-base font-black', meta.text)}>{formatCurrency(balance)}</p>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setDepositFor('NUBANK')}
          className="w-full h-10 rounded-btn border border-dashed border-accent text-accent text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-accent-light transition-colors"
        >
          <Plus size={16} />
          Recarregar saldo
        </button>
      </div>

      <AnimatePresence>
        {depositFor && user && (
          <DepositModal
            userId={user.uid}
            initialAccount={depositFor}
            onClose={() => setDepositFor(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {payFor && (
          <PayModal bank={payFor} onClose={() => setPayFor(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
