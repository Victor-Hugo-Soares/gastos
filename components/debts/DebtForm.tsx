'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { debtSchema, type DebtFormValues } from '@/lib/validators'
import { addDebt } from '@/hooks/useDebts'
import { useAppStore } from '@/store/useAppStore'
import type { Debt } from '@/types'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface DebtFormProps {
  userId: string
  onSuccess?: () => void
}

const BANKS = ['INTER', 'BRADESCO', 'NUBANK', 'OUTROS'] as const

export function DebtForm({ userId, onSuccess }: DebtFormProps) {
  const { addDebt: addDebtToStore } = useAppStore()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(debtSchema) as any,
    defaultValues: { bank: 'NUBANK', isActive: true },
  })

  const selectedBank = watch('bank')

  async function onSubmit(data: DebtFormValues) {
    setServerError(null)
    const result = await addDebt(userId, { ...data, notes: data.notes ?? undefined })
    if (result.success) {
      const newDebt: Debt = {
        id: result.data,
        userId,
        ...data,
        notes: data.notes ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addDebtToStore(newDebt)
      reset()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onSuccess?.()
    } else {
      setServerError('Erro ao salvar. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold text-text mb-2 block">Banco</label>
        <div className="flex gap-2">
          {BANKS.map((bank) => (
            <button
              key={bank}
              type="button"
              onClick={() => setValue('bank', bank)}
              className={cn(
                'flex-1 h-11 rounded-btn border text-sm font-bold transition-all',
                selectedBank === bank
                  ? bank === 'INTER'
                    ? 'bg-inter-bg border-inter text-inter'
                    : bank === 'BRADESCO'
                    ? 'bg-bradesco-bg border-bradesco text-bradesco'
                    : bank === 'NUBANK'
                    ? 'bg-nubank-bg border-nubank text-nubank'
                    : 'bg-outros-bg border-outros text-outros'
                  : 'border-border text-muted bg-white'
              )}
            >
              {bank}
            </button>
          ))}
        </div>
        {errors.bank && <span className="text-xs text-red-500">{errors.bank.message}</span>}
      </div>

      <Input
        label="Nome da dívida"
        placeholder="Ex: TV Samsung"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Parcela atual"
          type="number"
          min={1}
          placeholder="Ex: 3"
          error={errors.currentInstallment?.message}
          {...register('currentInstallment')}
        />
        <Input
          label="Total de parcelas"
          type="number"
          min={1}
          placeholder="Ex: 12"
          error={errors.totalInstallments?.message}
          {...register('totalInstallments')}
        />
      </div>

      <Input
        label="Valor mensal (R$)"
        type="number"
        step="0.01"
        min={0}
        placeholder="Ex: 299.90"
        error={errors.monthlyAmount?.message}
        {...register('monthlyAmount')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-semibold text-text">
          Observações (opcional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Informações adicionais..."
          className="w-full rounded-btn border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
          {...register('notes')}
        />
      </div>

      {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}
      {success && <p className="text-sm text-green font-semibold text-center">Dívida adicionada!</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Adicionar dívida
      </Button>
    </form>
  )
}
