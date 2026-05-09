'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Expense, Result } from '@/types'
import type { Timestamp } from 'firebase/firestore'
import { adjustAccountBalance } from './useAccounts'

function toExpense(id: string, userId: string, data: Record<string, unknown>): Expense {
  return {
    id,
    userId,
    description: data.description as string,
    amount: data.amount as number,
    paymentMethod: data.paymentMethod as Expense['paymentMethod'],
    account: (data.account as Expense['account']) ?? 'NUBANK',
    category: data.category as Expense['category'],
    date: (data.date as Timestamp)?.toDate() ?? new Date(),
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
  }
}

export function useExpenses(userId: string | null) {
  const { setExpenses, setIsLoadingExpenses } = useAppStore()

  useEffect(() => {
    if (!userId) return

    setIsLoadingExpenses(true)

    let unsub: (() => void) | undefined
    let cancelled = false

    async function init() {
      const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      if (cancelled) return

      const q = query(collection(db, 'users', userId!, 'expenses'), orderBy('date', 'desc'))

      unsub = onSnapshot(q, (snap) => {
        const expenses: Expense[] = snap.docs.map((d) =>
          toExpense(d.id, userId!, d.data() as Record<string, unknown>)
        )
        setExpenses(expenses)
        setIsLoadingExpenses(false)
      })
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [userId, setExpenses, setIsLoadingExpenses])
}

export async function addExpense(
  userId: string,
  data: Omit<Expense, 'id' | 'userId' | 'createdAt'>
): Promise<Result<string>> {
  try {
    const { addDoc, collection, serverTimestamp, Timestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    const ref = await addDoc(collection(db, 'users', userId, 'expenses'), {
      description: data.description,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      account: data.account,
      category: data.category,
      date: Timestamp.fromDate(data.date),
      createdAt: serverTimestamp(),
    })
    await adjustAccountBalance(userId, data.account, -data.amount)
    return { success: true, data: ref.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function deleteExpense(
  userId: string,
  expense: Pick<Expense, 'id' | 'amount' | 'account'>
): Promise<Result<void>> {
  try {
    const { deleteDoc, doc } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    await deleteDoc(doc(db, 'users', userId, 'expenses', expense.id))
    await adjustAccountBalance(userId, expense.account, expense.amount)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
