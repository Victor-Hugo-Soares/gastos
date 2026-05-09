'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validators'
import { addExpense } from '@/hooks/useExpenses'
import { useAppStore } from '@/store/useAppStore'
import type { Expense, ExpenseCategory, PaymentMethod, AccountBank } from '@/types'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ExpenseFormProps {
  userId: string
  onSuccess?: () => void
}

const ACCOUNTS: { value: AccountBank; label: string; activeClass: string }[] = [
  { value: 'NUBANK', label: 'Nubank', activeClass: 'bg-nubank-bg border-nubank text-nubank' },
  { value: 'INTER', label: 'Inter', activeClass: 'bg-inter-bg border-inter text-inter' },
]

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'DEBITO', label: 'Débito' },
  { value: 'PIX', label: 'Pix' },
]

const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'ALIMENTACAO', label: 'Alimentação', emoji: '🍔' },
  { value: 'MERCADO', label: 'Mercado', emoji: '🛒' },
  { value: 'TRANSPORTE', label: 'Transporte', emoji: '🚗' },
  { value: 'LAZER', label: 'Lazer', emoji: '🎮' },
  { value: 'SAUDE', label: 'Saúde', emoji: '💊' },
  { value: 'CASA', label: 'Casa', emoji: '🏠' },
  { value: 'OUTROS', label: 'Outros', emoji: '📦' },
]

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function ExpenseForm({ userId, onSuccess }: ExpenseFormProps) {
  const { addExpense: addToStore } = useAppStore()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      account: 'NUBANK',
      paymentMethod: 'DEBITO',
      category: 'ALIMENTACAO',
      date: todayISO(),
    },
  })

  const selectedAccount = watch('account')
  const selectedMethod = watch('paymentMethod')
  const selectedCategory = watch('category')

  async function onSubmit(data: ExpenseFormValues) {
    setServerError(null)
    const date = new Date(`${data.date}T12:00:00`)
    const result = await addExpense(userId, {
      description: data.description,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      account: data.account,
      category: data.category,
      date,
    })
    if (result.success) {
      const newExpense: Expense = {
        id: result.data,
        userId,
        description: data.description,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        account: data.account,
        category: data.category,
        date,
        createdAt: new Date(),
      }
      addToStore(newExpense)
      reset({
        account: data.account,
        paymentMethod: data.paymentMethod,
        category: data.category,
        date: todayISO(),
        description: '',
        amount: 0,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      onSuccess?.()
    } else {
      setServerError('Erro ao salvar. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold text-text mb-2 block">Conta</label>
        <div className="flex gap-2">
          {ACCOUNTS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setValue('account', a.value)}
              className={cn(
                'flex-1 h-11 rounded-btn border text-sm font-bold transition-all',
                selectedAccount === a.value ? a.activeClass : 'border-border text-muted bg-white'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-text mb-2 block">Forma de pagamento</label>
        <div className="flex gap-2">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setValue('paymentMethod', m.value)}
              className={cn(
                'flex-1 h-11 rounded-btn border text-sm font-bold transition-all',
                selectedMethod === m.value
                  ? 'bg-accent-light border-accent text-accent'
                  : 'border-border text-muted bg-white'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Descrição"
        placeholder="Ex: Almoço no shopping"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min={0}
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <Input
          label="Data"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-text mb-2 block">Categoria</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue('category', c.value)}
              className={cn(
                'h-11 rounded-btn border text-sm font-bold transition-all flex items-center justify-center gap-2',
                selectedCategory === c.value
                  ? 'bg-accent-light border-accent text-accent'
                  : 'border-border text-muted bg-white'
              )}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}
      {success && <p className="text-sm text-green font-semibold text-center">Gasto registrado!</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Adicionar gasto
      </Button>
    </form>
  )
}
