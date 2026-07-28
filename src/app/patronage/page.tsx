import type { Metadata } from 'next'
import Link from 'next/link'
import PatronageBuilder from '@/components/PatronageBuilder'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Patronage Tiers')}&sub=${encodeURIComponent('Tokenless backing tiers — no wallet needed')}`

export const metadata: Metadata = {
  title: 'Patronage Tiers — Sparkz by ZAO',
  description:
    'Build tokenless backing tiers for your community. Fans back with a card — no wallet, no gas. 88% of community builders monetize this way.',
  openGraph: {
    title: 'Patronage Tiers — Sparkz by ZAO',
    description:
      'Tokenless backing tiers. Fans back with a card. Leaderboard weight. No crypto required.',
    url: `${BASE_URL}/patronage`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Patronage Tiers — Sparkz' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patronage Tiers — Sparkz',
    description: 'Tokenless memberships. Card payments. No wallet.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '💎 Build backing tiers',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/patronage`,
    'fc:frame:button:2': '⚡ Back the empire',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/back`,
  },
}

export default function PatronagePage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Patronage Tiers · No token required
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-green-400">🎶</span>
          No token · No wallet · Card-first
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Patronage Tiers
        </h1>

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Recurring memberships that don&apos;t need a token. Fans pay $5, $25, or $100 a month
          with a card. They earn leaderboard weight. You earn consistent income.{' '}
          <strong className="text-white">No crypto required on either side.</strong>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ 88% of community builders monetize this way</span>
          <span>✓ Token-optional (add later, if ever)</span>
          <span>✓ Start collecting on day 1</span>
        </div>
      </section>

      {/* Context row */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '💳',
              title: 'Card, not crypto',
              body: '85% of fans are non-crypto. A card payment form removes the #1 barrier to community backing.',
            },
            {
              icon: '📅',
              title: 'Recurring, not one-time',
              body: 'Monthly subscriptions build predictable income. One-time drops are spiky; memberships compound.',
            },
            {
              icon: '🏆',
              title: 'Leaderboard weight',
              body: 'Patrons earn points just like on-chain boosters. Same leaderboard, same fee-share eligibility — minus the wallet.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zao-card border border-zao-border rounded-xl p-5 flex flex-col gap-2"
            >
              <div className="text-2xl">{item.icon}</div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Builder */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Build your tier template</h2>
          <p className="text-xs text-slate-500">Customize the defaults — or export as-is</p>
        </div>
        <PatronageBuilder />
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Patronage tiers are tokenless. No blockchain interaction required from fans. Card
            backing activates when STRIPE_SECRET_KEY is set.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/back"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Back the empire →
            </Link>
            <Link
              href="/launch"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              ⚡ Launch your token →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
