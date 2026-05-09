'use client'

export const dynamic = 'force-dynamic'

import { useAppStore } from '@/store/useAppStore'
import { MonthGroup } from '@/components/agenda/MonthGroup'

export default function AgendaPage() {
  const { debts, isLoadingDebts } = useAppStore()
  const activeDebts = debts.filter((d) => d.isActive)

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-black text-text mb-5">Agenda</h1>

      {isLoadingDebts ? (
        <div className="py-12 flex justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div>
          {[0, 1, 2, 3].map((offset) => (
            <MonthGroup key={offset} debts={activeDebts} monthOffset={offset} />
          ))}
        </div>
      )}
    </div>
  )
}
