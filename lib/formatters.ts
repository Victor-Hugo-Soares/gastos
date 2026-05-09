const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatMonth(date: Date): string {
  return `${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`
}

export function formatMonthShort(date: Date): string {
  return `${MONTHS_PT[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
}

export function formatShortDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = String(date.getFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}
