'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { DEBTS_SEED, SUBSCRIPTIONS_SEED } from '@/lib/seedData'
import type { Debt, Subscription, Result } from '@/types'
import type { Timestamp } from 'firebase/firestore'

function toDebt(id: string, userId: string, data: Record<string, unknown>): Debt {
  return {
    id,
    userId,
    name: data.name as string,
    bank: data.bank as Debt['bank'],
    currentInstallment: data.currentInstallment as number,
    totalInstallments: data.totalInstallments as number,
    monthlyAmount: data.monthlyAmount as number,
    notes: data.notes as string | undefined,
    isActive: data.isActive as boolean,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  }
}

export function useDebts(userId: string | null) {
  const { setDebts, setSubscriptions, setIsLoadingDebts } = useAppStore()

  useEffect(() => {
    if (!userId) return

    setIsLoadingDebts(true)

    let unsubDebts: (() => void) | undefined
    let unsubSubs: (() => void) | undefined
    let cancelled = false

    async function init() {
      const {
        collection,
        onSnapshot,
        addDoc,
        serverTimestamp,
        query,
        orderBy,
        getDocs,
      } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      if (cancelled) return

      // Seed on first login
      const debtsCol = collection(db, 'users', userId!, 'debts')
      const subsCol = collection(db, 'users', userId!, 'subscriptions')
      const existingDebts = await getDocs(debtsCol)
      if (existingDebts.empty) {
        const now = serverTimestamp()
        for (const debt of DEBTS_SEED) {
          await addDoc(debtsCol, { ...debt, isActive: true, createdAt: now, updatedAt: now })
        }
        for (const sub of SUBSCRIPTIONS_SEED) {
          await addDoc(subsCol, { ...sub, isActive: true })
        }
      } else {
        // Migration: add new seed debts that don't exist yet (matched by name)
        const existingNames = new Set(existingDebts.docs.map((d) => (d.data() as { name: string }).name))
        const missing = DEBTS_SEED.filter((d) => !existingNames.has(d.name))
        if (missing.length > 0) {
          const now = serverTimestamp()
          for (const debt of missing) {
            await addDoc(debtsCol, { ...debt, isActive: true, createdAt: now, updatedAt: now })
          }
        }
      }

      if (cancelled) return

      const debtsQ = query(debtsCol, orderBy('createdAt', 'asc'))

      unsubDebts = onSnapshot(debtsQ, (snap) => {
        const debts: Debt[] = snap.docs.map((d) => toDebt(d.id, userId!, d.data() as Record<string, unknown>))
        setDebts(debts)
        setIsLoadingDebts(false)
      })

      unsubSubs = onSnapshot(subsCol, (snap) => {
        const subs: Subscription[] = snap.docs.map((d) => ({
          id: d.id,
          userId: userId!,
          ...(d.data() as Omit<Subscription, 'id' | 'userId'>),
        }))
        setSubscriptions(subs)
      })
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      unsubDebts?.()
      unsubSubs?.()
    }
  }, [userId, setDebts, setSubscriptions, setIsLoadingDebts])
}

export async function updateDebtInstallment(
  userId: string,
  debtId: string,
  currentInstallment: number
): Promise<Result<void>> {
  try {
    const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    await updateDoc(doc(db, 'users', userId, 'debts', debtId), {
      currentInstallment,
      updatedAt: serverTimestamp(),
    })
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function addDebt(
  userId: string,
  data: Omit<Debt, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Result<string>> {
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    const now = serverTimestamp()
    const ref = await addDoc(collection(db, 'users', userId, 'debts'), {
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return { success: true, data: ref.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
