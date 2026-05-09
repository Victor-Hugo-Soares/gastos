'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Account, AccountBank, Result } from '@/types'
import type { Timestamp } from 'firebase/firestore'

const ACCOUNT_SEED: Record<AccountBank, number> = {
  NUBANK: 0.30,
  INTER: 104.36,
}

function toAccount(id: string, userId: string, data: Record<string, unknown>): Account {
  return {
    id: id as AccountBank,
    userId,
    bank: data.bank as AccountBank,
    balance: data.balance as number,
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  }
}

export function useAccounts(userId: string | null) {
  const { setAccounts, setIsLoadingAccounts } = useAppStore()

  useEffect(() => {
    if (!userId) return

    setIsLoadingAccounts(true)

    let unsub: (() => void) | undefined
    let cancelled = false

    async function init() {
      const { collection, doc, onSnapshot, getDoc, setDoc, serverTimestamp } = await import(
        'firebase/firestore'
      )
      const { db } = await import('@/lib/firebase')

      if (cancelled) return

      // Seed accounts if missing
      for (const [bank, balance] of Object.entries(ACCOUNT_SEED) as [AccountBank, number][]) {
        const ref = doc(db, 'users', userId!, 'accounts', bank)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, { bank, balance, updatedAt: serverTimestamp() })
        }
      }

      if (cancelled) return

      unsub = onSnapshot(collection(db, 'users', userId!, 'accounts'), (snap) => {
        const accounts: Account[] = snap.docs.map((d) =>
          toAccount(d.id, userId!, d.data() as Record<string, unknown>)
        )
        setAccounts(accounts)
        setIsLoadingAccounts(false)
      })
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [userId, setAccounts, setIsLoadingAccounts])
}

export async function adjustAccountBalance(
  userId: string,
  bank: AccountBank,
  delta: number
): Promise<Result<void>> {
  try {
    const { runTransaction, doc, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    const ref = doc(db, 'users', userId, 'accounts', bank)
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref)
      const current = (snap.exists() ? (snap.data().balance as number) : 0) ?? 0
      tx.set(
        ref,
        { bank, balance: Number((current + delta).toFixed(2)), updatedAt: serverTimestamp() },
        { merge: true }
      )
    })
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function setAccountBalance(
  userId: string,
  bank: AccountBank,
  balance: number
): Promise<Result<void>> {
  try {
    const { setDoc, doc, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')
    await setDoc(
      doc(db, 'users', userId, 'accounts', bank),
      { bank, balance: Number(balance.toFixed(2)), updatedAt: serverTimestamp() },
      { merge: true }
    )
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
