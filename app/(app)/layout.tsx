'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import { BottomNav } from '@/components/ui/BottomNav'
import { useDebts } from '@/hooks/useDebts'
import { useExpenses } from '@/hooks/useExpenses'
import { useAccounts } from '@/hooks/useAccounts'
import { useDeposits } from '@/hooks/useDeposits'

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useDebts(user?.uid ?? null)
  useExpenses(user?.uid ?? null)
  useAccounts(user?.uid ?? null)
  useDeposits(user?.uid ?? null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted font-semibold">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-bg pb-20">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  )
}
