'use client'

import { useAppStore } from '@/store/useAppStore'
import {
  calcMonthlyInstallments,
  calcTotalOwed,
  calcMonthlyTotal,
  calcMonthProjection,
  calcSubscriptionsTotal,
  countActiveDebts,
} from '@/lib/calculations'

export function useSummary() {
  const { debts, subscriptions } = useAppStore()

  const activeDebts = debts.filter((d) => d.isActive)

  return {
    monthlyInstallments: calcMonthlyInstallments(activeDebts),
    totalOwed: calcTotalOwed(activeDebts),
    monthlyTotal: calcMonthlyTotal(activeDebts, subscriptions),
    subsTotal: calcSubscriptionsTotal(subscriptions),
    activeDebtCount: countActiveDebts(activeDebts),
    currentMonth: calcMonthProjection(activeDebts, 0),
    nextMonths: [1, 2, 3].map((offset) => calcMonthProjection(activeDebts, offset)),
  }
}
