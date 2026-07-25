import type { Metadata } from 'next'
import Link from 'next/link'
import AdvisorFlow from '@/components/AdvisorFlow'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('AI Advisor')}&sub=${encodeURIComponent('3 questions → recommended split + token timing')}`

export const metadata: Metadata = {
  title: 'AI Advisor — Sparkz by ZAO',
  description:
    '3 questions. ZOL recommends a fee split, token timing, and earnings estimate — tailored to your creator shape. No token required to start.',
  openGraph: {
    title: 'AI Advisor — Sparkz by ZAO',
    description:
      '3 questions → recommended split + token timing + weekly earnings estimate. No wallet needed.',
    url: `${BASE_URL}/advisor`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Sparkz AI Advisor' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sparkz AI Advisor',
    description: '3 questions → split recommendation + token timing.',
    images: [OG_URL],
  },
}

export default function AdvisorPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            Sparkz Advisor · Beta
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-gold-400">⚡</span>
          ZOL · AI advisor
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          What split is right for you?
        </h1>

        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          3 questions. ZOL recommends a fee split, token timing, and weekly earnings
          estimate — tailored to your creator shape.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ Solo · collab · collective · crowdfund</span>
          <span>✓ Token now / later / never</span>
          <span>✓ No wallet needed</span>
        </div>
      </section>

      {/* Flow */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <AdvisorFlow />
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Recommendations are based on your inputs — not financial advice. Splits are configured
            in the Sparkz launcher and deployed on-chain via 0xSplits.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/launch" className="text-slate-500 hover:text-slate-400 transition-colors">
              ⚡ Launch →
            </Link>
            <Link
              href="/leaderboard"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Leaderboard →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
