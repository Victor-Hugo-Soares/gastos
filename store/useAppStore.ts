'use client'

import { create } from 'zustand'
import type { Debt, Subscription, ChatMessage, Expense, Account, Deposit } from '@/types'

interface AppState {
  debts: Debt[]
  subscriptions: Subscription[]
  expenses: Expense[]
  deposits: Deposit[]
  accounts: Account[]
  chatMessages: ChatMessage[]
  isLoadingDebts: boolean
  isLoadingExpenses: boolean
  isLoadingDeposits: boolean
  isLoadingAccounts: boolean
  isLoadingChat: boolean
  searchQuery: string
  setDebts: (debts: Debt[]) => void
  setSubscriptions: (subs: Subscription[]) => void
  setExpenses: (expenses: Expense[]) => void
  setDeposits: (deposits: Deposit[]) => void
  setAccounts: (accounts: Account[]) => void
  setChatMessages: (msgs: ChatMessage[]) => void
  addChatMessage: (msg: ChatMessage) => void
  setIsLoadingDebts: (v: boolean) => void
  setIsLoadingExpenses: (v: boolean) => void
  setIsLoadingDeposits: (v: boolean) => void
  setIsLoadingAccounts: (v: boolean) => void
  setIsLoadingChat: (v: boolean) => void
  setSearchQuery: (q: string) => void
  updateDebt: (id: string, updates: Partial<Debt>) => void
  addDebt: (debt: Debt) => void
  addExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  addDeposit: (deposit: Deposit) => void
  removeDeposit: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  debts: [],
  subscriptions: [],
  expenses: [],
  deposits: [],
  accounts: [],
  chatMessages: [],
  isLoadingDebts: false,
  isLoadingExpenses: false,
  isLoadingDeposits: false,
  isLoadingAccounts: false,
  isLoadingChat: false,
  searchQuery: '',
  setDebts: (debts) => set({ debts }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setExpenses: (expenses) => set({ expenses }),
  setDeposits: (deposits) => set({ deposits }),
  setAccounts: (accounts) => set({ accounts }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setIsLoadingDebts: (isLoadingDebts) => set({ isLoadingDebts }),
  setIsLoadingExpenses: (isLoadingExpenses) => set({ isLoadingExpenses }),
  setIsLoadingDeposits: (isLoadingDeposits) => set({ isLoadingDeposits }),
  setIsLoadingAccounts: (isLoadingAccounts) => set({ isLoadingAccounts }),
  setIsLoadingChat: (isLoadingChat) => set({ isLoadingChat }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  updateDebt: (id, updates) =>
    set((state) => ({
      debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  addDebt: (debt) => set((state) => ({ debts: [...state.debts, debt] })),
  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  removeExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
  addDeposit: (deposit) => set((state) => ({ deposits: [deposit, ...state.deposits] })),
  removeDeposit: (id) =>
    set((state) => ({ deposits: state.deposits.filter((d) => d.id !== id) })),
}))
