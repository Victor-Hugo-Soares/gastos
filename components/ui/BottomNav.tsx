'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Casa' },
  { href: '/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/novo', icon: Plus, label: 'Novo', special: true },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 pb-safe"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, special }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (special) {
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white shadow-lg shadow-accent/30 active:scale-95 transition-transform -mt-4"
                aria-label={label}
              >
                <Icon size={24} strokeWidth={2.5} />
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-pill transition-colors min-w-[60px]',
                isActive ? 'text-accent' : 'text-muted'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
