'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/hooks/useSearch'
import { DebtCard } from './DebtCard'
import { DebtEditModal } from './DebtEditModal'
import type { Debt } from '@/types'

export function DebtList() {
  const { filtered } = useSearch()
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const active = filtered.filter((d) => d.isActive)

  if (active.length === 0) {
    return (
      <div className="py-12 text-center text-muted">
        <p className="text-sm">Nenhuma dívida encontrada</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {active.map((debt) => (
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
      </div>

      <AnimatePresence>
        {editingDebt && (
          <DebtEditModal debt={editingDebt} onClose={() => setEditingDebt(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
