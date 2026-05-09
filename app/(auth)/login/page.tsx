'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/lib/validators'

export default function LoginPage() {
  const router = useRouter()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    async function checkMagicLink() {
      const { isSignInWithEmailLink, signInWithEmailLink } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')

      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem('emailForSignIn')
        if (!email) return

        try {
          await signInWithEmailLink(auth, email, window.location.href)
          window.localStorage.removeItem('emailForSignIn')
          router.replace('/')
        } catch (err) {
          setError((err as Error).message)
        }
      }
    }

    checkMagicLink().catch(console.error)
  }, [router])

  async function onSubmit(data: LoginFormValues) {
    setError(null)
    const { sendSignInLinkToEmail } = await import('firebase/auth')
    const { auth } = await import('@/lib/firebase')

    const settings = {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    }

    try {
      await sendSignInLinkToEmail(auth, data.email, settings)
      window.localStorage.setItem('emailForSignIn', data.email)
      setSent(true)
    } catch (err) {
      setError('Erro ao enviar link. Verifique o e-mail e tente novamente.')
      console.error(err)
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

        {sent ? (
          <div className="bg-accent-light border border-accent/20 rounded-card p-5 text-center">
            <p className="text-base font-bold text-accent mb-1">Link enviado!</p>
            <p className="text-sm text-muted">
              Verifique seu e-mail e clique no link para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-btn p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              Entrar com Magic Link
            </Button>

            <p className="text-xs text-center text-muted">
              Você receberá um link de acesso no seu e-mail. Sem senha necessária.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
