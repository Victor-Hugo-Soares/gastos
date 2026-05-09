'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkRedirect() {
      const { getRedirectResult } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          router.replace('/')
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkRedirect()
  }, [router])

  async function signInWithGoogle() {
    setError(null)
    setLoading(true)
    try {
      const {
        GoogleAuthProvider,
        signInWithPopup,
        signInWithRedirect,
        setPersistence,
        browserLocalPersistence,
      } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')

      await setPersistence(auth, browserLocalPersistence)
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      try {
        await signInWithPopup(auth, provider)
        router.replace('/')
      } catch (popupErr) {
        const code = (popupErr as { code?: string }).code
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          await signInWithRedirect(auth, provider)
        } else {
          throw popupErr
        }
      }
    } catch (err) {
      setError('Não foi possível entrar com o Google. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-card bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-black">G</span>
          </div>
          <h1 className="text-3xl font-black text-text">Gastos</h1>
          <p className="text-sm text-muted mt-1">Controle suas dívidas com inteligência</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={signInWithGoogle}
            loading={loading}
            className="w-full bg-white text-text border border-border hover:bg-bg"
            size="lg"
          >
            <span className="flex items-center justify-center gap-3">
              <GoogleIcon />
              <span className="font-bold">Continuar com Google</span>
            </span>
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-btn p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <p className="text-xs text-center text-muted mt-2">
            Sua sessão fica salva no dispositivo — você só precisa entrar uma vez.
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}
