'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { depositSchema, type DepositFormValues } from '@/lib/validators'
import { addDeposit } from '@/hooks/useDeposits'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/cn'
import type { AccountBank, Deposit } from '@/types'

interface DepositModalProps {
  userId: string
  initialAccount?: AccountBank
  onClose: () => void
}

const ACCOUNTS: { value: AccountBank; label: string; activeClass: string }[] = [
  { value: 'NUBANK', label: 'Nubank', activeClass: 'bg-nubank-bg border-nubank text-nubank' },
  { value: 'INTER', label: 'Inter', activeClass: 'bg-inter-bg border-inter text-inter' },
]

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function DepositModal({ userId, initialAccount = 'NUBANK', onClose }: DepositModalProps) {
  const { addDeposit: addToStore } = useAppStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DepositFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(depositSchema) as any,
    defaultValues: { account: initialAccount, date: todayISO(), description: '' },
  })

  const selectedAccount = watch('account')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(data: DepositFormValues) {
    const date = new Date(`${data.date}T12:00:00`)
    const result = await addDeposit(userId, {
      account: data.account,
      amount: data.amount,
      description: data.description,
      date,
    })
    if (result.success) {
      const newDeposit: Deposit = {
        id: result.data,
        userId,
        account: data.account,
        amount: data.amount,
        description: data.description,
        date,
        createdAt: new Date(),
      }
      addToStore(newDeposit)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-t-card sm:rounded-card p-5 pb-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-text">Recarregar saldo</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-muted"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

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
                    selectedAccount === a.value
                      ? a.activeClass
                      : 'border-border text-muted bg-white'
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Descrição"
            placeholder="Ex: Salário, Pix recebido"
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

          <Button type="submit" loading={isSubmitting} className="w-full">
            Adicionar entrada
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
