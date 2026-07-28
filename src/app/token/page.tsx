import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('$ZOOSTR Token')}&sub=${encodeURIComponent('50% of every trade goes back to the empire.')}`

export const metadata: Metadata = {
  title: '$ZOOSTR — The Token',
  description:
    '$ZOOSTR is the Zoostr empire token on Base. 50% of trading fees flow to leaderboard participants by points. Claim your share at splits.org.',
  openGraph: {
    title: '$ZOOSTR — The Token',
    description: '50% of every $ZOOSTR trade goes back to the empire — by points, on-chain.',
    url: `${BASE_URL}/token`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: '$ZOOSTR Token' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$ZOOSTR Token',
    description: '50% of every trade → leaderboard by points. Claim at splits.org.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:button:1': '📊 Leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/leaderboard`,
    'fc:frame:button:2': '💰 Claim fees',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://splits.org',
  },
}

const SPLIT = [
  {
    pct: 50,
    label: 'Leaderboard pool',
    detail: 'Distributed weekly by points. Boost ZABAL casts → earn points → claim fee share.',
    color: 'from-gold-500 to-gold-400',
    accent: 'text-gold-400',
    border: 'border-gold-500/30',
    bg: 'bg-gold-500/5',
  },
  {
    pct: 25,
    label: 'Creator + operations',
    detail: 'Zaal (ZABAL) — the builder behind the empire. Sustains the platform.',
    color: 'from-violet-500 to-violet-400',
    accent: 'text-zao-violet',
    border: 'border-zao-violet/30',
    bg: 'bg-zao-violet/5',
  },
  {
    pct: 25,
    label: 'Treasury',
    detail: 'Future liquidity, partnerships, and empire expansion. Community-directed, not extracted.',
    color: 'from-slate-500 to-slate-400',
    accent: 'text-slate-400',
    border: 'border-zao-border',
    bg: 'bg-zao-card',
  },
]

const FACTS = [
  { label: 'Chain', value: 'Base' },
  { label: 'Launch rail', value: 'Clanker v4' },
  { label: 'Fee tier', value: '1% per trade' },
  { label: 'Community pool', value: '50% of fees' },
  { label: 'Distribution', value: 'Weekly snapshot → 0xSplits' },
  { label: 'Claiming', value: 'splits.org — pull model, no deadline' },
]

export default function TokenPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/leaderboard" className="hover:text-slate-300 transition-colors">Leaderboard</Link>
            <Link href="/back" className="hover:text-slate-300 transition-colors">Back it</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-2xl mx-auto px-4 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-gold-500/30 rounded-full px-4 py-1.5 text-xs text-gold-400 mb-6 font-semibold">
          <span>⚡</span>
          Base · Clanker v4 · 1% fee tier
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          $ZOOSTR
        </h1>

        <p className="text-slate-400 max-w-md leading-relaxed text-lg">
          The empire&rsquo;s token on Base. Not the starting point — the economic output
          of the community that showed up first.
        </p>

        <p className="text-slate-500 text-sm mt-3 max-w-md leading-relaxed">
          50% of every trade flows back to the people who built the empire —
          by points, on-chain, weekly. The coin didn&rsquo;t make the empire.
          The empire earned the coin.
        </p>
      </section>

      {/* Quick facts */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-zao-card border border-zao-border rounded-2xl divide-y divide-zao-border">
          {FACTS.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fee split */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
          Fee split — 1% per trade, every trade
        </h2>

        {/* Visual bar */}
        <div className="flex h-5 w-full overflow-hidden rounded-full mb-6 border border-zao-border">
          {SPLIT.map((s) => (
            <div
              key={s.label}
              className={`bg-gradient-to-r ${s.color}`}
              style={{ width: `${s.pct}%` }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {SPLIT.map((s) => (
            <div key={s.label} className={`bg-zao-card border ${s.border} rounded-xl p-5 flex gap-4`}>
              <div className={`text-2xl font-black tabular-nums ${s.accent} shrink-0 w-12`}>
                {s.pct}%
              </div>
              <div>
                <div className={`font-bold text-sm ${s.accent} mb-0.5`}>{s.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
          How to earn your slice
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              n: '1',
              title: 'Boost',
              body: 'Like ZABAL\'s casts on Farcaster. Every like adds to your Boostr points.',
            },
            {
              n: '2',
              title: 'Rank',
              body: 'Points accumulate on the leaderboard. Minimum 10 pts to be eligible for the split.',
            },
            {
              n: '3',
              title: 'Claim',
              body: 'Go to splits.org, connect your wallet, claim your share. No deadline — it waits.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="bg-zao-card border border-zao-border rounded-xl p-5">
              <div className="text-gold-400 text-2xl font-black mb-2">{n}</div>
              <div className="font-bold text-white text-sm mb-1">{title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 0xSplits pull model */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            0xSplits pull model
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            The community pool flows into a 0xSplits contract on Base. Weights update
            weekly based on the snapshot. Recipients connect their wallet at{' '}
            <a
              href="https://splits.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline"
            >
              splits.org
            </a>{' '}
            and pull their balance whenever they want. No auto-payout. No deadline.
            The fees wait for you.
          </p>
          <p className="text-xs text-slate-600">
            Pull model means only you can move your funds — Zoostr never touches them after they land in Splits.
          </p>
        </div>
      </section>

      {/* Not financial advice */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <p className="text-xs text-slate-600 leading-relaxed">
          $ZOOSTR is a community token, not an investment. Fee share reflects
          contribution, not a promise of profit. Not financial advice. Past community
          activity does not predict future fee volume.
        </p>
      </section>

      {/* CTAs */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/leaderboard"
            className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-400 transition-colors"
          >
            📊 Leaderboard
          </Link>
          <Link
            href="/back"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            ⚡ Back the empire
          </Link>
          <Link
            href="/rewards"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            💰 How rewards work
          </Link>
          <Link
            href="/faq"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            ❓ FAQ
          </Link>
        </div>
      </section>

      {/* Footer nav */}
      <div className="border-t border-zao-border">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          <Link href="/receipt" className="hover:text-slate-400 transition-colors">Weekly receipt</Link>
          <Link href="/rewards" className="hover:text-slate-400 transition-colors">Rewards</Link>
          <Link href="/back" className="hover:text-slate-400 transition-colors">Back it</Link>
          <Link href="/faq" className="hover:text-slate-400 transition-colors">FAQ</Link>
        </div>
      </div>
    </main>
  )
}
