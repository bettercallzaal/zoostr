import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        zao: {
          purple: '#7c3aed',
          violet: '#8b5cf6',
          dark: '#0a0a14',
          card: '#12121e',
          border: '#1e1e38',
        },
        // Landing page palette - ink, bone, one accent
        zoostr: {
          ink: '#08080a',
          line: '#1c1c19',
          bone: '#ede9e0',
          dim: '#7e7a70',
          acid: '#c2f53c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
