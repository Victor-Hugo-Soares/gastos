'use client'

import { Search, X } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Buscar dívidas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-11 w-full rounded-btn border border-border bg-white pl-9 pr-9 text-sm text-text placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all min-h-[44px]"
        aria-label="Buscar dívidas"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
