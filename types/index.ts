export type Bank = 'INTER' | 'BRADESCO' | 'NUBANK' | 'OUTROS'

export type AccountBank = 'INTER' | 'NUBANK'

export interface Debt {
  id: string
  userId: string
  name: string
  bank: Bank
  currentInstallment: number
  totalInstallments: number
  monthlyAmount: number
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  name: string
  monthlyAmount: number
  emoji: string
  isActive: boolean
}

export interface Account {
  id: AccountBank
  userId: string
  bank: AccountBank
  balance: number
  updatedAt: Date
}

export type PaymentMethod = 'DEBITO' | 'PIX'

export type ExpenseCategory =
  | 'ALIMENTACAO'
  | 'TRANSPORTE'
  | 'MERCADO'
  | 'LAZER'
  | 'SAUDE'
  | 'CASA'
  | 'OUTROS'

export interface Expense {
  id: string
  userId: string
  description: string
  amount: number
  paymentMethod: PaymentMethod
  account: AccountBank
  category: ExpenseCategory
  date: Date
  createdAt: Date
}

export interface Deposit {
  id: string
  userId: string
  account: AccountBank
  amount: number
  description: string
  date: Date
  createdAt: Date
}

export type Transaction =
  | { kind: 'expense'; data: Expense; amount: number; date: Date; account: AccountBank }
  | { kind: 'deposit'; data: Deposit; amount: number; date: Date; account: AccountBank }

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export type Result<T> = { success: true; data: T } | { success: false; error: string }
