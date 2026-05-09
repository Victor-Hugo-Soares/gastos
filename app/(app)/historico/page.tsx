'use client'

export const dynamic = 'force-dynamic'

import { TransactionHistory } from '@/components/dashboard/TransactionHistory'

export default function HistoricoPage() {
  return (
    <div className="px-4 pt-6 pb-6 flex flex-col gap-4">
      <h1 className="text-2xl font-black text-text">Histórico</h1>
      <TransactionHistory />
    </div>
  )
}
