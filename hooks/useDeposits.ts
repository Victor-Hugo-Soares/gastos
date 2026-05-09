'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Deposit, Result } from '@/types'
import type { Timestamp } from 'firebase/firestore'
import { adjustAccountBalance } from './useAccounts'

function toDeposit(id: string, userId: string, data: Record<string, unknown>): Deposit {
  return {
    id,
    userId,
    account: data.account as Deposit['account'],
    amount: data.amount as number,
    description: data.description as string,
    date: (data.date as Timestamp)?.toDate() ?? new Date(),
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
  }
}

export function useDeposits(userId: string | null) {
  const { setDeposits, setIsLoadingDeposits } = useAppStore()

  useEffect(() => {
    if (!userId) return

    setIsLoadingDeposits(true)

    let unsub: (() => void) | undefined
    let cancelled = false

    async function init() {
      const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      if (cancelled) return

      const q = query(collection(db, 'users', userId!, 'deposits'), orderBy('date', 'desc'))

      unsub = onSnapshot(q, (snap) => {
        const deposits: Deposit[] = snap.docs.map((d) =>
          toDeposit(d.id, userId!, d.data() as Record<string, unknown>)
        )
        setDeposits(deposits)
        setIsLoadingDeposits(false)
      })
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [userId, setDeposits, setIsLoadingDeposits])
}

export async function addDeposit(
  userId: string,
  data: Omit<Deposit, 'id' | 'userId' | 'createdAt'>
): Promise<Result<string>> {
  try {
    const { addDoc, collection, serverTimestamp, Timestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    const ref = await addDoc(collection(db, 'users', userId, 'deposits'), {
      account: data.account,
      amount: data.amount,
      description: data.description,
      date: Timestamp.fromDate(data.date),
      createdAt: serverTimestamp(),
    })
    await adjustAccountBalance(userId, data.account, data.amount)
    return { success: true, data: ref.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function deleteDeposit(
  userId: string,
  deposit: Pick<Deposit, 'id' | 'amount' | 'account'>
): Promise<Result<void>> {
  try {
    const { deleteDoc, doc } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    await deleteDoc(doc(db, 'users', userId, 'deposits', deposit.id))
    await adjustAccountBalance(userId, deposit.account, -deposit.amount)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
