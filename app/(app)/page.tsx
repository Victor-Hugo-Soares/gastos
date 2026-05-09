'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { HeroCard } from '@/components/dashboard/HeroCard'
import { TotalsRow } from '@/components/dashboard/TotalsRow'
import { SearchBar } from '@/components/dashboard/SearchBar'
import { AccountsCard } from '@/components/dashboard/AccountsCard'
import { TransactionHistory } from '@/components/dashboard/TransactionHistory'
import { DebtList } from '@/components/debts/DebtList'
import { ExpensesSummaryCard } from '@/components/expenses/ExpensesSummaryCard'
import { useAppStore } from '@/store/useAppStore'

export default function HomePage() {
  const { isLoadingDebts, expenses, deposits } = useAppStore()
  const hasMovements = expenses.length > 0 || deposits.length > 0

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black text-text">Gastos</h1>
      </div>

      <HeroCard />
      <AccountsCard />
      <TotalsRow />

      <ExpensesSummaryCard />

      {hasMovements && (
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-text uppercase tracking-wide">Histórico</h2>
            <Link href="/historico" className="text-xs font-bold text-accent">
              Ver tudo
            </Link>
          </div>
          <TransactionHistory limit={6} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        <SearchBar />

        {isLoadingDebts ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DebtList />
        )}
      </section>
    </div>
  )
}
