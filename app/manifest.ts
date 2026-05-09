import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gastos - Controle Financeiro',
    short_name: 'Gastos',
    description: 'Controle suas dívidas e assinaturas',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f0',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
