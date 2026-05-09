# Gastos — Contexto do Projeto

PWA de controle financeiro pessoal do Victor. Instalável no iPhone 12 via Safari.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS v3 |
| Banco | Firebase Firestore |
| Auth | Firebase Auth (email magic link) |
| Estado global | Zustand (`store/useAppStore.ts`) |
| Formulários | React Hook Form + Zod |
| Animações | Framer Motion |
| IA | Anthropic API — `claude-sonnet-4-6` |
| PWA | next-pwa (workbox) |
| Ícones | Lucide React |
| Fonte | Nunito (next/font/google) |

---

## Estrutura de Pastas

```
app/
  (auth)/login/          → Tela de login (magic link)
  (app)/                 → Shell com BottomNav
    page.tsx             → Aba Casa (dashboard)
    agenda/              → Aba Agenda (timeline 4 meses)
    novo/                → Aba Novo gasto (formulário)
    ia/                  → Aba IA (chat com Claude)
  api/
    chat/route.ts        → POST — chama Anthropic com contexto real do usuário
    summary/route.ts     → GET — totais calculados
  layout.tsx             → Root layout + meta tags iOS PWA
  manifest.ts            → PWA manifest dinâmico

components/
  ui/                    → Button, Card, Avatar, Badge, Input, ProgressBar, BottomNav
  dashboard/             → HeroCard, TotalsRow, SearchBar
  debts/                 → DebtCard, DebtList, DebtForm, DebtEditModal
  agenda/                → MonthGroup, PaymentGroup
  chat/                  → ChatMessages, ChatInput, TypingIndicator

hooks/
  useDebts.ts            → CRUD de dívidas no Firestore
  useSummary.ts          → Cálculos de totais
  useChat.ts             → Estado do chat IA
  useSearch.ts           → Busca filtrada

lib/
  firebase.ts            → Singleton Firebase (db + auth)
  AuthContext.tsx         → Contexto de autenticação React
  anthropic.ts           → Cliente Anthropic
  calculations.ts        → Toda lógica financeira (ver seção abaixo)
  formatters.ts          → formatCurrency, formatMonth (pt-BR)
  validators.ts          → Schemas Zod
  seedData.ts            → Dados iniciais do Victor (carregados no 1º login)
  cn.ts                  → clsx helper

store/
  useAppStore.ts         → Zustand — estado global

types/
  index.ts               → Debt, Subscription, ChatMessage, Bank, Result<T>
```

---

## Firebase — Estrutura do Firestore

```
users/{userId}
  - email, name, createdAt

users/{userId}/debts/{debtId}
  - name, bank, currentInstallment, totalInstallments
  - monthlyAmount, notes?, isActive, createdAt, updatedAt

users/{userId}/subscriptions/{subId}
  - name, monthlyAmount, emoji, isActive

users/{userId}/chatMessages/{msgId}
  - role ('user'|'assistant'), content, createdAt
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Copiar de `.env.local.example` → `.env.local`.

---

## Lógica de Negócio (lib/calculations.ts)

### Vencimentos por banco
- Inter → dia 07
- Bradesco → dia 07
- Nubank → dia 20

### calcMonthlyInstallments(debts)
Soma `monthlyAmount` de todas as dívidas ativas. Não inclui assinaturas.

### calcTotalOwed(debts)
Soma de todas as parcelas restantes de cada dívida ativa.
- Parcelas restantes = `totalInstallments - currentInstallment + 1` (inclui a atual)
- **Caso especial — Empréstimo Nubank:** a última parcela (23/23) vale R$ 250,00, não R$ 880,00.

### calcMonthlyTotal(debts, subs)
`calcMonthlyInstallments` + soma das assinaturas ativas.

### calcMonthProjection(debts, monthOffset)
Para o mês `monthOffset` (0 = atual, 1 = próximo...):
- Inclui apenas dívidas onde `currentInstallment + monthOffset <= totalInstallments`
- Retorna `{ day07, day20, total, items07, items20 }`

---

## Dados do Victor (Seed)

### Dívidas — carregadas em `lib/seedData.ts`

| Nome | Banco | Parcela | Total | Valor/mês |
|------|-------|---------|-------|-----------|
| Parcelamento Fatura | INTER | 2 | 4 | R$ 226,18 |
| GetNinjas | INTER | 3 | 3 | R$ 238,66 |
| Autoescola | INTER | 6 | 10 | R$ 73,77 |
| Curso | INTER | 6 | 12 | R$ 29,82 |
| Óculos | BRADESCO | 3 | 10 | R$ 90,10 |
| Relógio | BRADESCO | 3 | 5 | R$ 58,33 |
| ArtWalk | BRADESCO | 2 | 6 | R$ 264,99 |
| TV | NUBANK | 7 | 10 | R$ 194,94 |
| GetNinjas | NUBANK | 2 | 2 | R$ 122,30 |
| Shopee | NUBANK | 3 | 4 | R$ 43,90 |
| Saque | NUBANK | 2 | 12 | R$ 197,16 |
| **Empréstimo Nubank** | NUBANK | 1 | 23 | R$ 880,00 |

> Empréstimo Nubank: última parcela (23/23) = R$ 250,00. Antecipação possível por ~R$ 10.000,00.

### Assinaturas

| Nome | Valor/mês |
|------|-----------|
| 📱 Vivo | R$ 75,00 |
| 🎬 HBO Max | R$ 25,00 |
| 🎵 Spotify | R$ 20,00 |

### Totais de referência (base maio 2025)
- Dia 07 (Inter + Bradesco): **R$ 981,85**
- Dia 20 (Nubank): **R$ 1.438,30**
- Assinaturas: **R$ 120,00**
- **Total mensal: R$ 2.540,15**
- **Total em aberto: ~R$ 27.034,15**

---

## Design System (Tailwind)

```
cores:
  bg:       #f5f5f0   fundo geral
  white:    #ffffff   cards
  text:     #1a1a2e   texto principal
  muted:    #6b7280   texto secundário
  border:   #e8e8e2   bordas
  accent:   #2563eb   azul principal
  inter:    #0ea5e9   cor do Inter
  bradesco: #f97316   cor do Bradesco
  nubank:   #7c3aed   cor do Nubank
  green:    #16a34a

border-radius:
  card: 16px  chip: 12px  pill: 20px  btn: 14px

fonte: Nunito
```

---

## Padrões de Código

- Retornos tipados: `async function fn(userId: string): Promise<Debt[]>`
- Erros: `Result<T> = { success: true; data: T } | { success: false; error: string }`
- Constantes: `SCREAMING_SNAKE_CASE`
- Moeda: sempre via `formatCurrency()` de `lib/formatters.ts`
- Cálculos financeiros: sempre via `lib/calculations.ts`, nunca inline
- Validação de inputs de API: Zod antes de qualquer operação no Firestore

---

## Dev Server

```bash
npm run dev   # localhost:3000
```

Configuração salva em `.claude/launch.json`.

---

## PWA — iOS

Meta tags obrigatórias no `app/layout.tsx`:
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Gastos" />
<meta name="theme-color" content="#f5f5f0" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

Otimizado para iPhone 12 (375px). Touch targets mínimo 44px. Safe area insets aplicados.
