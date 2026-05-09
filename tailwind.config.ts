import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f5f0',
        white: '#ffffff',
        text: '#1a1a2e',
        muted: '#6b7280',
        border: '#e8e8e2',
        accent: '#2563eb',
        'accent-light': '#eff6ff',
        inter: { DEFAULT: '#0ea5e9', bg: '#f0f9ff' },
        bradesco: { DEFAULT: '#f97316', bg: '#fff7ed' },
        nubank: { DEFAULT: '#7c3aed', bg: '#f5f3ff' },
        outros: { DEFAULT: '#475569', bg: '#f1f5f9' },
        green: '#16a34a',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        chip: '12px',
        pill: '20px',
        btn: '14px',
      },
    },
  },
  plugins: [],
}

export default config
