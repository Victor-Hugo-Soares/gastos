import type { Bank, Debt, Subscription, Expense, PaymentMethod } from '@/types'

export const BANK_DUE_DAY: Record<Bank, number> = {
  INTER: 7,
  BRADESCO: 7,
  NUBANK: 20,
  OUTROS: 15,
}

const EMPRESTIMO_NUBANK_LAST_INSTALLMENT = 250
const EMPRESTIMO_NUBANK_NAME = 'Empréstimo Nubank'

export function calcMonthlyInstallments(debts: Debt[]): number {
  return debts
    .filter((d) => d.isActive)
    .reduce((sum, d) => sum + d.monthlyAmount, 0)
}

export function calcTotalOwed(debts: Debt[]): number {
  return debts
    .filter((d) => d.isActive)
    .reduce((sum, d) => {
      const remaining = d.totalInstallments - d.currentInstallment + 1
      if (d.name === EMPRESTIMO_NUBANK_NAME && d.bank === 'NUBANK') {
        const regularInstallments = remaining - 1
        const lastInstallmentValue = remaining > 0 ? EMPRESTIMO_NUBANK_LAST_INSTALLMENT : 0
        return sum + regularInstallments * d.monthlyAmount + lastInstallmentValue
      }
      return sum + remaining * d.monthlyAmount
    }, 0)
}

export function calcMonthlyTotal(debts: Debt[], subs: Subscription[]): number {
  const installments = calcMonthlyInstallments(debts)
  const subsTotal = subs.filter((s) => s.isActive).reduce((sum, s) => sum + s.monthlyAmount, 0)
  return installments + subsTotal
}

export interface DayGroup {
  day: number
  debts: Debt[]
  total: number
}

export function getNextDueDate(bank: Bank, today: Date = new Date()): Date {
  const day = BANK_DUE_DAY[bank]
  const next = new Date(today.getFullYear(), today.getMonth(), day)
  if (today.getDate() > day) {
    next.setMonth(next.getMonth() + 1)
  }
  return next
}

export function isDueNextMonth(bank: Bank, today: Date = new Date()): boolean {
  return today.getDate() > BANK_DUE_DAY[bank]
}

export function calcMonthProjection(
  debts: Debt[],
  monthOffset: number,
  today: Date = new Date()
): {
  total: number
  groups: DayGroup[]
} {
  const activeDebts = debts.filter((d) => d.isActive)

  const eligibleDebts = activeDebts.filter(
    (d) => d.currentInstallment + monthOffset <= d.totalInstallments
  )

  const filtered =
    monthOffset === 0
      ? eligibleDebts.filter((d) => today.getDate() <= BANK_DUE_DAY[d.bank])
      : eligibleDebts

  const byDay = new Map<number, Debt[]>()
  for (const debt of filtered) {
    const day = BANK_DUE_DAY[debt.bank]
    const arr = byDay.get(day) ?? []
    arr.push(debt)
    byDay.set(day, arr)
  }

  const groups: DayGroup[] = Array.from(byDay.entries())
    .map(([day, list]) => ({
      day,
      debts: list,
      total: list.reduce((s, d) => s + d.monthlyAmount, 0),
    }))
    .sort((a, b) => a.day - b.day)

  const total = groups.reduce((s, g) => s + g.total, 0)
  return { total, groups }
}

export function calcSubscriptionsTotal(subs: Subscription[]): number {
  return subs.filter((s) => s.isActive).reduce((sum, s) => sum + s.monthlyAmount, 0)
}

export function countActiveDebts(debts: Debt[]): number {
  return debts.filter((d) => d.isActive).length
}

function isSameMonth(date: Date, ref: Date): boolean {
  return date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth()
}

export function filterMonthExpenses(expenses: Expense[], ref: Date = new Date()): Expense[] {
  return expenses.filter((e) => isSameMonth(e.date, ref))
}

export function calcMonthExpensesTotal(expenses: Expense[], ref: Date = new Date()): number {
  return filterMonthExpenses(expenses, ref).reduce((sum, e) => sum + e.amount, 0)
}

export function calcExpensesByMethod(
  expenses: Expense[],
  ref: Date = new Date()
): Record<PaymentMethod, number> {
  return filterMonthExpenses(expenses, ref).reduce(
    (acc, e) => {
      acc[e.paymentMethod] += e.amount
      return acc
    },
    { DEBITO: 0, PIX: 0 } as Record<PaymentMethod, number>
  )
}
