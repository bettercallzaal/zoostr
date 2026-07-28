import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('How Zoostr Works')}&subtitle=${encodeURIComponent('Boost → Rank → Claim — the full cycle')}`

export const metadata: Metadata = {
  title: 'How Zoostr Works — Boost, Rank, Claim',
  description:
    'The full Zoostr cycle: boost ZABAL casts with Boostr → climb the leaderboard → weekly snapshot → fees flow to 0xSplits → claim your share at splits.org.',
  openGraph: {
    title: 'How Zoostr Works',
    description: 'Boost → Rank → Claim. Every trade generates $ZOOSTR fees. 50% goes to the community pool. Boosters claim their proportional share at splits.org.',
    url: `${BASE_URL}/how-it-works`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'How Zoostr Works' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Zoostr Works',
    description: 'Boost → Rank → Claim. The full cycle explained.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:button:1': '📊 Leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/leaderboard`,
    'fc:frame:button:2': '💰 Start boosting',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://boostr.itscashless.com',
  },
}

const STEPS = [
  {
    n: '1',
    icon: '⚡',
    title: 'Follow ZABAL on Farcaster',
    body: 'Find @zaal (or @bettercallzaal) on Warpcast and follow. ZABAL casts are the content that Boostr picks up for point accumulation.',
    cta: null,
  },
  {
    n: '2',
    icon: '🔗',
    title: 'Connect on Boostr',
    body: 'Sign into boostr.itscashless.com with your Farcaster account. Boostr tracks your likes on ZABAL casts and converts them to points automatically.',
    cta: { label: 'Open Boostr ↗', href: 'https://boostr.itscashless.com', external: true },
  },
  {
    n: '3',
    icon: '❤️',
    title: 'Like ZABAL casts to earn points',
    body: 'Every like on a ZABAL cast earns you Boostr points. The ranking metric is zabalLikesCount. A minimum of 10 points is needed to qualify for the weekly pool.',
    cta: null,
  },
  {
    n: '4',
    icon: '📊',
    title: 'Weekly leaderboard snapshot',
    body: 'Every week, ZOL (the Sparkz agent) takes a snapshot of the leaderboard. Your proportional share of the community pool = your points ÷ total points across all boosters.',
    cta: { label: 'View leaderboard', href: '/leaderboard', external: false },
  },
  {
    n: '5',
    icon: '🔄',
    title: '0xSplits weights updated on-chain',
    body: 'The snapshot converts your proportional share to an integer weight (out of 1,000,000). ZOL calls updateSplit() on the 0xSplits contract — this is a human-gated transaction, not automatic.',
    cta: null,
  },
  {
    n: '6',
    icon: '💰',
    title: 'Claim your share at splits.org',
    body: 'Pull model: you claim when you want. Go to splits.org, connect your wallet, and withdraw your accumulated $ZOOSTR fee share. No deadline. No minimum. Fees accumulate indefinitely.',
    cta: { label: 'Claim at splits.org ↗', href: 'https://splits.org', external: true },
  },
]

const POOL_MATH = [
  { label: 'Community pool share', value: '50% of all $ZOOSTR trading fees' },
  { label: 'Your cut', value: 'your points ÷ total leaderboard points × 50%' },
  { label: 'Fee tier', value: '1% on every trade' },
  { label: 'Example at $10k/day volume', value: '~$350/week to the community pool' },
  { label: 'Minimum to qualify', value: '10 Boostr points' },
  { label: 'Snapshot cadence', value: 'Weekly' },
  { label: 'Claim deadline', value: 'None — accumulates indefinitely' },
]

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 space-y-14">
      {/* Header */}
      <section>
        <p className="text-gold-400 text-sm font-semibold mb-3 uppercase tracking-wider">
          The Zoostr cycle
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">How Zoostr Works</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Zoostr turns cultural participation into economic participation. You boost
          ZABAL&rsquo;s creative output, you rank on the leaderboard, and you earn a
          proportional share of every $ZOOSTR trade. Here&rsquo;s the complete cycle.
        </p>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5">The 6-step cycle</h2>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-zao-card border border-zao-border rounded-xl p-5 flex gap-4">
              <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                <div className="text-lg">{s.icon}</div>
                <div className="text-gold-400 font-black text-sm">{s.n}</div>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                <div className="text-slate-400 text-xs leading-relaxed mb-2">{s.body}</div>
                {s.cta && (
                  s.cta.external ? (
                    <a
                      href={s.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-400 text-xs hover:underline"
                    >
                      {s.cta.label}
                    </a>
                  ) : (
                    <Link href={s.cta.href} className="text-gold-400 text-xs hover:underline">
                      {s.cta.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pool math */}
      <section>
        <h2 className="text-xl font-bold text-white mb-2">Pool math</h2>
        <p className="text-slate-400 text-sm mb-5">
          What you actually earn depends on your share of total leaderboard points.
        </p>
        <div className="bg-zao-card border border-zao-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {POOL_MATH.map((f, i) => (
                <tr key={f.label} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                  <td className="px-4 py-3 text-slate-400 text-xs font-medium w-1/2">
                    {f.label}
                  </td>
                  <td className="px-4 py-3 text-white text-xs">{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The 50/25/25 split */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">The 50/25/25 split</h2>
        <div className="bg-zao-card border border-zao-border rounded-xl p-5">
          <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-800 mb-4">
            <div className="bg-gold-400" style={{ width: '50%' }} title="Community pool — 50%" />
            <div className="bg-blue-400" style={{ width: '25%' }} title="Creator + ops — 25%" />
            <div className="bg-slate-500" style={{ width: '25%' }} title="Treasury — 25%" />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-gold-400" />
              50% community pool
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
              25% creator + ops
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />
              25% treasury
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every $ZOOSTR trade generates a 1% fee. That fee is split 50/25/25. The 50%
            community pool lives in a 0xSplits contract and distributes to boosters by
            points — pull model, claim at splits.org.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="flex flex-wrap gap-3">
        <a
          href="https://boostr.itscashless.com"
          target="_blank"
          rel="noreferrer"
          className="bg-gold-400 text-black px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-gold-300 transition-colors"
        >
          ⚡ Start boosting
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
          💎 $ZOOSTR token
        </Link>
        <Link
          href="/faq"
          className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
        >
          ❓ FAQ
        </Link>
      </section>

      {/* Footer nav */}
      <div className="border-t border-zao-border">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          <Link href="/token" className="hover:text-slate-400 transition-colors">$ZOOSTR token</Link>
          <Link href="/rewards" className="hover:text-slate-400 transition-colors">Rewards</Link>
          <Link href="/back" className="hover:text-slate-400 transition-colors">Back the empire</Link>
          <Link href="/faq" className="hover:text-slate-400 transition-colors">FAQ</Link>
          <Link href="/discover" className="hover:text-slate-400 transition-colors">Discover</Link>
        </div>
      </div>
    </main>
  )
}
