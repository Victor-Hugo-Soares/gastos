'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | undefined

    async function init() {
      const { onAuthStateChanged } = await import('firebase/auth')
      const { auth } = await import('./firebase')
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      })
    }

    init().catch(console.error)

    return () => {
      unsub?.()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
