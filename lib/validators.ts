import { z } from 'zod'

export const debtSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  bank: z.enum(['INTER', 'BRADESCO', 'NUBANK', 'OUTROS']),
  currentInstallment: z.preprocess((v) => Number(v), z.number().int().min(1, 'Mínimo 1')),
  totalInstallments: z.preprocess((v) => Number(v), z.number().int().min(1, 'Mínimo 1')),
  monthlyAmount: z.preprocess((v) => Number(v), z.number().positive('Valor deve ser positivo')),
  notes: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
})

export type DebtFormValues = z.infer<typeof debtSchema>

export const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(100),
  amount: z.preprocess((v) => Number(v), z.number().positive('Valor deve ser positivo')),
  paymentMethod: z.enum(['DEBITO', 'PIX']),
  account: z.enum(['INTER', 'NUBANK']),
  category: z.enum(['ALIMENTACAO', 'TRANSPORTE', 'MERCADO', 'LAZER', 'SAUDE', 'CASA', 'OUTROS']),
  date: z.string().min(1, 'Data é obrigatória'),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export const depositSchema = z.object({
  account: z.enum(['INTER', 'NUBANK']),
  amount: z.preprocess((v) => Number(v), z.number().positive('Valor deve ser positivo')),
  description: z.string().min(1, 'Descrição é obrigatória').max(100),
  date: z.string().min(1, 'Data é obrigatória'),
})

export type DepositFormValues = z.infer<typeof depositSchema>

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  userId: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
