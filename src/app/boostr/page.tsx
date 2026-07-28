import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Boostr × Zoostr')}&sub=${encodeURIComponent('Boost ZABAL casts → earn points → claim fee share')}`

export const metadata: Metadata = {
  title: 'Boostr × Zoostr',
  description:
    'Boostr is the platform powering the Zoostr empire leaderboard. Like ZABAL casts on Farcaster → earn points → claim your $ZOOSTR fee share at splits.org.',
  openGraph: {
    title: 'Boostr × Zoostr',
    description:
      'Boost ZABAL casts on Farcaster. Earn points. Claim your share of $ZOOSTR trading fees at splits.org.',
    url: `${BASE_URL}/boostr`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Boostr × Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boostr × Zoostr',
    description: 'Like casts → earn points → claim fee share. Powered by Boostr.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:button:1': '⚡ Start boosting',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://boostr.itscashless.com',
    'fc:frame:button:2': '📊 Leaderboard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/leaderboard`,
  },
}

const STEPS = [
  {
    n: '1',
    title: 'Connect on Farcaster',
    body: 'Follow @zaal and @bettercallzaal on Warpcast. Boostr tracks likes on ZABAL casts on Farcaster.',
  },
  {
    n: '2',
    title: 'Like ZABAL casts',
    body: 'Every like on a ZABAL cast adds to your Boostr points. More consistent engagement = more points = larger fee share.',
  },
  {
    n: '3',
    title: 'Hit 10+ points',
    body: 'Minimum 10 points to be eligible for the fee split. Most active boosters earn far above this threshold.',
  },
  {
    n: '4',
    title: 'Weekly snapshot',
    body: 'Every Monday, ZOL runs a snapshot of the leaderboard. Weights update the 0xSplits contract on-chain.',
  },
  {
    n: '5',
    title: 'Claim at splits.org',
    body: 'Go to splits.org, connect your wallet, claim your share. No deadline — the fees accumulate and wait for you.',
  },
]

const STATS_CONTEXT = [
  { label: 'API endpoint', value: 'boostr.itscashless.com/api/zabaal/stats' },
  { label: 'Proxy (CORS-safe)', value: 'zoostr.xyz/api/boostr' },
  { label: 'Ranking metric', value: 'zabalLikesCount (primary) + followers_count (tiebreak)' },
  { label: 'Minimum threshold', value: '10 points (≥10 zabalLikesCount)' },
]

export default function BoostrPage() {
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
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-gold-400">⚡</span>
          boostr.itscashless.com · built by @cashlessman.eth
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Boostr × Zoostr
        </h1>

        <p className="text-slate-400 max-w-md leading-relaxed text-lg">
          Boostr is the platform powering the Zoostr empire leaderboard.
          Like ZABAL casts on Farcaster → earn points → claim your{' '}
          <span className="text-gold-400 font-semibold">$ZOOSTR</span> fee share.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
          How it works
        </h2>
        <div className="space-y-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-zao-card border border-zao-border rounded-xl p-5 flex gap-4">
              <div className="text-gold-400 text-xl font-black shrink-0 w-6">{s.n}</div>
              <div>
                <div className="font-bold text-white text-sm mb-1">{s.title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The team */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
          The people behind it
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-zao-card border border-zao-border rounded-xl p-5">
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              ZABAL — Creator
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              The music creator whose casts you're boosting. Every like on a ZABAL cast counts
              toward your empire points.
            </p>
            <div className="flex flex-col gap-1">
              <a
                href="https://warpcast.com/zaal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-400 hover:underline"
              >
                @zaal on Warpcast ↗
              </a>
              <a
                href="https://warpcast.com/bettercallzaal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-400 hover:underline"
              >
                @bettercallzaal on Warpcast ↗
              </a>
            </div>
          </div>
          <div className="bg-zao-card border border-zao-border rounded-xl p-5">
            <div className="text-xs font-bold text-zao-violet uppercase tracking-wider mb-2">
              Aziz — Boostr Co-builder
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Aziz built Boostr (boostr.itscashless.com) — the platform tracking Farcaster
              engagement and powering the Zoostr leaderboard API.
            </p>
            <a
              href="https://warpcast.com/cashlessman.eth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zao-violet hover:underline"
            >
              @cashlessman.eth on Warpcast ↗
            </a>
          </div>
        </div>
      </section>

      {/* Technical */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
          Technical details
        </h2>
        <div className="bg-zao-card border border-zao-border rounded-2xl divide-y divide-zao-border">
          {STATS_CONTEXT.map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-5 py-3 text-sm">
              <span className="text-slate-500">{label}</span>
              <code className="text-white font-mono text-xs bg-zao-dark px-2 py-0.5 rounded">{value}</code>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          The Boostr API doesn't send CORS headers, so Zoostr uses a server-side proxy at
          /api/boostr to fetch it for the leaderboard. Client-side fetch will fail.
        </p>
      </section>

      {/* CTAs */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap gap-3">
          <a
            href="https://boostr.itscashless.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-400 transition-colors"
          >
            ⚡ Start boosting ↗
          </a>
          <Link
            href="/leaderboard"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            📊 Leaderboard
          </Link>
          <Link
            href="/token"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            ⚡ $ZOOSTR token
          </Link>
          <Link
            href="/rewards"
            className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            💰 How rewards work
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          <Link href="/receipt" className="hover:text-slate-400 transition-colors">Weekly receipt</Link>
          <Link href="/rewards" className="hover:text-slate-400 transition-colors">Rewards</Link>
          <Link href="/token" className="hover:text-slate-400 transition-colors">$ZOOSTR token</Link>
          <Link href="/back" className="hover:text-slate-400 transition-colors">Back the empire</Link>
          <Link href="/faq" className="hover:text-slate-400 transition-colors">FAQ</Link>
        </div>
      </div>
    </main>
  )
}
