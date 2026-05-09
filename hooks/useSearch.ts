'use client'

import { useAppStore } from '@/store/useAppStore'
import type { Debt } from '@/types'

export function useSearch() {
  const { debts, searchQuery, setSearchQuery } = useAppStore()

  const filtered: Debt[] = searchQuery.trim()
    ? debts.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.bank.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : debts

  return { filtered, searchQuery, setSearchQuery }
}
