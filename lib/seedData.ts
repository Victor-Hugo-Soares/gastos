import type { Bank } from '@/types'

interface SeedDebt {
  name: string
  bank: Bank
  currentInstallment: number
  totalInstallments: number
  monthlyAmount: number
  notes?: string
}

interface SeedSubscription {
  name: string
  monthlyAmount: number
  emoji: string
}

export const DEBTS_SEED: SeedDebt[] = [
  // INTER (due day 07)
  { name: 'Parcelamento Fatura', bank: 'INTER', currentInstallment: 2, totalInstallments: 4, monthlyAmount: 226.18 },
  { name: 'GetNinjas', bank: 'INTER', currentInstallment: 3, totalInstallments: 3, monthlyAmount: 238.66 },
  { name: 'Autoescola', bank: 'INTER', currentInstallment: 6, totalInstallments: 10, monthlyAmount: 73.77 },
  { name: 'Curso', bank: 'INTER', currentInstallment: 6, totalInstallments: 12, monthlyAmount: 29.82 },

  // BRADESCO (due day 07)
  { name: 'Óculos', bank: 'BRADESCO', currentInstallment: 3, totalInstallments: 10, monthlyAmount: 90.10 },
  { name: 'Relógio', bank: 'BRADESCO', currentInstallment: 3, totalInstallments: 5, monthlyAmount: 58.33 },
  { name: 'ArtWalk', bank: 'BRADESCO', currentInstallment: 2, totalInstallments: 6, monthlyAmount: 264.99 },

  // NUBANK (due day 20)
  { name: 'TV', bank: 'NUBANK', currentInstallment: 7, totalInstallments: 10, monthlyAmount: 194.94 },
  { name: 'GetNinjas', bank: 'NUBANK', currentInstallment: 2, totalInstallments: 2, monthlyAmount: 122.30 },
  { name: 'Shopee', bank: 'NUBANK', currentInstallment: 3, totalInstallments: 4, monthlyAmount: 43.90 },
  { name: 'Saque', bank: 'NUBANK', currentInstallment: 2, totalInstallments: 12, monthlyAmount: 197.16 },
  {
    name: 'Empréstimo Nubank',
    bank: 'NUBANK',
    currentInstallment: 1,
    totalInstallments: 23,
    monthlyAmount: 880.00,
    notes: 'Valor total: R$ 18.135,47 | Antecipação possível por ~R$ 10.000,00 | Última parcela: R$ 250,00 (menor que as demais)',
  },

  // EXTRAS
  { name: 'Saque Inter', bank: 'INTER', currentInstallment: 1, totalInstallments: 2, monthlyAmount: 450 },
  {
    name: 'Empréstimo Ricardo',
    bank: 'OUTROS',
    currentInstallment: 1,
    totalInstallments: 4,
    monthlyAmount: 300,
    notes: 'Total R$ 1.200 · prazo flexível combinado com Ricardo',
  },
]

export const SUBSCRIPTIONS_SEED: SeedSubscription[] = [
  { name: 'Vivo', monthlyAmount: 75.00, emoji: '📱' },
  { name: 'HBO Max', monthlyAmount: 25.00, emoji: '🎬' },
  { name: 'Spotify', monthlyAmount: 20.00, emoji: '🎵' },
]
