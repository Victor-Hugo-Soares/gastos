import { NextRequest, NextResponse } from 'next/server'
import { calcMonthlyInstallments, calcTotalOwed, calcMonthProjection } from '@/lib/calculations'
import type { Debt, Subscription } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const { db } = await import('@/lib/firebase')

    const debtsSnap = await getDocs(
      query(collection(db, 'users', userId, 'debts'), orderBy('createdAt', 'asc'))
    )
    const subsSnap = await getDocs(collection(db, 'users', userId, 'subscriptions'))

    const debts = debtsSnap.docs
      .map((d) => ({ id: d.id, userId, ...(d.data() as Omit<Debt, 'id' | 'userId'>) }))
      .filter((d) => d.isActive)

    const subs = subsSnap.docs
      .map((d) => ({ id: d.id, userId, ...(d.data() as Omit<Subscription, 'id' | 'userId'>) }))
      .filter((s) => s.isActive)

    return NextResponse.json({
      monthlyInstallments: calcMonthlyInstallments(debts),
      totalOwed: calcTotalOwed(debts),
      currentMonth: calcMonthProjection(debts, 0),
      debtCount: debts.length,
      subCount: subs.length,
    })
  } catch (err) {
    console.error('[summary/route]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
