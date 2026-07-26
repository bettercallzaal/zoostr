import { fetchBoostrStats, sortedContributors, isEligible, eligibleTotalPoints } from '@/lib/boostr'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Empire Rewards')}&sub=${encodeURIComponent('Contribution → points → fee share. No governance.')}`

export const metadata: Metadata = {
  title: 'Empire Rewards — Zoostr',
  description:
    'How Empire rewards work: contribution → points → weekly fee share → claim at splits.org. No governance. No voting. Contribution is the only currency.',
  openGraph: {
    title: 'Empire Rewards — Zoostr',
    description: 'Contribution → points → fee share. No governance, no voting.',
    url: `${BASE_URL}/rewards`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Empire Rewards — Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empire Rewards — Zoostr',
    description: 'Contribution → points → fee share. No governance.',
    images: [OG_URL],
  },
}

const DAILY_VOLUME = 10_000
const FEE_TIER = 0.01
const COMMUNITY_SHARE = Number(process.env.NEXT_PUBLIC_COMMUNITY_SHARE_PCT ?? 50) / 100
const DAYS = 7

const BOOSTER_TIERS = [
  {
    id: 'spark',
    label: 'Spark',
    price: '$5/mo',
    multiplier: 1,
    desc: 'Base leaderboard entry. Points accumulate from day 1.',
    color: 'border-slate-600/50 bg-slate-800/20',
    textColor: 'text-slate-300',
  },
  {
    id: 'booster',
    label: 'Booster',
    price: '$25/mo',
    multiplier: 5,
    desc: 'Boosted weight. 5× more fee-share per contribution point.',
    color: 'border-gold-500/50 bg-gold-500/5 glow-gold',
    textColor: 'text-gold-400',
  },
  {
    id: 'patron',
    label: 'Patron',
    price: '$100/mo',
    multiplier: 20,
    desc: 'Maximum weight. Direct ZAO access. "ZAO Patron" label.',
    color: 'border-zao-violet/50 bg-zao-violet/5',
    textColor: 'text-zao-violet',
  },
]

const WEEKLY_STEPS = [
  {
    day: 'Mon 00:00 UTC',
    step: 'Detect moment',
    who: 'ZOL agent',
    detail: '`npm run detect-moment` — checks for milestones (new #1, likes thresholds, leaderboard changes). Writes 3 cast variants.',
  },
  {
    day: 'Mon morning',
    step: 'Approve + post',
    who: 'Zaal (human)',
    detail: 'Reviews the 3 draft variants → `npm run post-cast -- --approve N`. Never posts autonomously.',
  },
  {
    day: 'Mon (same day)',
    step: 'Snapshot',
    who: 'ZOL agent',
    detail: '`npm run snapshot` — fetches fresh leaderboard, computes weights, overwrites splits-update.json.',
  },
  {
    day: 'Mon (after snapshot)',
    step: 'Split weights update',
    who: 'Zaal (human)',
    detail: 'Reviews splits-update.json → app.splits.org → Update recipients → verify on Basescan.',
  },
  {
    day: 'Mon (after update)',
    step: 'Weekly receipt',
    who: 'ZOL agent',
    detail: '`npm run receipt` — generates live receipt with top earners. Zaal reviews and posts to Farcaster.',
  },
  {
    day: '24h after cast',
    step: 'Track remixes',
    who: 'ZOL agent',
    detail: '`npm run track-remix` — scores quote-casts and replies. Top remixers get bonus points in next snapshot.',
  },
]

function fmtUsd(n: number) {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(1)}k`
}

export default async function RewardsPage() {
  let stats = null
  try {
    stats = await fetchBoostrStats()
  } catch {
    // fall through
  }

  const all = stats ? sortedContributors(stats) : []
  const eligible = all.filter(isEligible)
  const total = stats ? eligibleTotalPoints(stats) : 0
  const weeklyPool = DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * DAYS

  // Illustrative example: top earner
  const top = eligible[0]
  const topPct = top && total > 0 ? (top.zabalLikesCount / total) * 100 : null
  const topEarned = topPct !== null ? (topPct / 100) * weeklyPool : null

  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/leaderboard" className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:inline">
              Leaderboard →
            </Link>
            <Link href="/back" className="btn-gold text-xs py-1.5 px-3">
              Back it
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-gold-500/30 rounded-full px-4 py-1.5 text-xs text-gold-400 mb-6 font-semibold">
          ⬡ Contribution is the only currency
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Empire Rewards
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed mb-6">
          Boost → earn points → claim your share of every $ZOOSTR trade.
          No governance. No voting. Contribution maps directly to reward — mechanical, transparent, on-chain.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-black text-gold-400">{eligible.length || '—'}</div>
            <div className="text-xs text-slate-600">eligible builders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{fmtUsd(weeklyPool)}</div>
            <div className="text-xs text-slate-600">weekly pool est.</div>
          </div>
          {topEarned !== null && top && (
            <div className="text-center">
              <div className="text-2xl font-black text-gold-400">{fmtUsd(topEarned)}</div>
              <div className="text-xs text-slate-600">top earner @{top.username}/week</div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-12">

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-black text-white mb-6">How Empire rewards work</h2>

          <div className="grid sm:grid-cols-4 gap-4">
            {[
              {
                n: '1',
                icon: '⚡',
                title: 'Boost on Boostr',
                body: 'Like ZABAL\'s casts, get others to like them. Every like = points on the leaderboard.',
              },
              {
                n: '2',
                icon: '📊',
                title: 'Points → pool share',
                body: 'Your points ÷ total eligible points = your percentage of the weekly pool. Mechanical. Transparent.',
              },
              {
                n: '3',
                icon: '🔄',
                title: 'Weekly snapshot',
                body: 'Every Monday, ZOL runs a snapshot. Weights update the 0xSplits contract. New split is live on-chain.',
              },
              {
                n: '4',
                icon: '🏦',
                title: 'Claim at splits.org',
                body: 'Fees accumulate in the contract. Claim anytime — your share waits. No deadline. Pull model.',
              },
            ].map((item) => (
              <div key={item.n} className="bg-zao-card border border-zao-border rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-xs font-black text-gold-400">
                    {item.n}
                  </div>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The math */}
        <section className="bg-zao-card border border-gold-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-black text-white mb-2">The math — no black boxes</h2>
          <p className="text-slate-500 text-sm mb-6">
            Every number is public and verifiable on-chain. This is how your share is calculated.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="font-mono text-sm">
                <div className="text-slate-500 mb-1">Weekly pool</div>
                <div className="bg-zao-dark rounded-xl px-4 py-3 text-gold-400 font-bold">
                  daily_volume × 1% fee × {COMMUNITY_SHARE * 100}% community share × 7 days
                </div>
                <div className="text-xs text-slate-600 mt-1 px-4">
                  At ${(DAILY_VOLUME / 1000).toFixed(0)}k/day → <strong className="text-white">{fmtUsd(weeklyPool)}/week</strong>
                </div>
              </div>

              <div className="font-mono text-sm">
                <div className="text-slate-500 mb-1">Your share</div>
                <div className="bg-zao-dark rounded-xl px-4 py-3 text-white">
                  (your_points / total_eligible_points) × weekly_pool
                </div>
                {topPct !== null && top && (
                  <div className="text-xs text-slate-600 mt-1 px-4">
                    @{top.username}: {top.zabalLikesCount} pts / {total} total = {topPct.toFixed(1)}% → {fmtUsd(topEarned!)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-400">Fee split (1% per trade)</div>
              {[
                { label: 'Leaderboard pool', pct: COMMUNITY_SHARE * 100, color: 'from-gold-500 to-gold-400', note: 'allocated by points weekly' },
                { label: 'Creator + operations', pct: 25, color: 'from-violet-600 to-violet-500', note: 'Zaal · ZABAL' },
                { label: 'Treasury', pct: 25, color: 'from-slate-600 to-slate-500', note: 'future liquidity' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{bar.label}</span>
                    <span className="text-white font-bold">{bar.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zao-border overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${bar.color} rounded-full`}
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{bar.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zao-border flex flex-wrap gap-4 text-xs text-slate-500">
            <span>✓ 0xSplits contract — anyone can read the weights on-chain</span>
            <span>✓ Snapshot source: Boostr API (public)</span>
            <span>✓ Minimum 10 points to be eligible</span>
          </div>
        </section>

        {/* Booster tiers */}
        <section>
          <h2 className="text-2xl font-black text-white mb-2">Booster tiers</h2>
          <p className="text-slate-500 text-sm mb-6">
            Card-backed tiers multiply your leaderboard weight. No wallet needed.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {BOOSTER_TIERS.map((tier) => (
              <div key={tier.id} className={`border rounded-2xl p-5 flex flex-col gap-3 ${tier.color}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-black ${tier.textColor}`}>{tier.label}</span>
                  <span className="text-xs text-slate-500">{tier.price}</span>
                </div>
                <div className={`text-3xl font-black ${tier.textColor}`}>
                  {tier.multiplier}×
                  <span className="text-sm font-normal text-slate-500 ml-1">weight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                <Link
                  href="/back"
                  className={`mt-auto text-center text-xs font-bold py-2 rounded-lg border transition-colors ${
                    tier.id === 'booster'
                      ? 'bg-gold-500/20 border-gold-500/40 text-gold-400 hover:bg-gold-500/30'
                      : 'border-zao-border text-slate-400 hover:border-slate-500'
                  }`}
                >
                  Back as {tier.label} →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Tier multipliers apply to leaderboard weight, not raw Boostr points. Final split = (boostr_points × tier_multiplier) ÷ total_weighted_points.
          </p>
        </section>

        {/* Remix rewards */}
        <section className="bg-zao-card border border-zao-border rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-black text-white mb-2">Remix rewards — bonus points</h2>
          <p className="text-slate-400 text-sm mb-6">
            After each weekly cast, ZOL tracks quote-casts, replies, and likes from the community.
            Top remixers earn bonus points added to their next snapshot — rewarding the builders
            who amplify the signal.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { action: 'Recast', points: 5, icon: '🔁' },
              { action: 'Reply', points: '3 + likes', icon: '💬' },
              { action: 'Like', points: 1, icon: '❤️' },
            ].map((item) => (
              <div key={item.action} className="bg-zao-dark rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-lg font-black text-gold-400">{item.points}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.action}</div>
              </div>
            ))}
          </div>

          <div className="bg-zao-dark rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-300">How it runs:</strong> 24 hours after the weekly cast,{' '}
            <code className="bg-slate-800 px-1 rounded text-slate-400">npm run track-remix</code>{' '}
            fetches Neynar data (quote-casts, replies, likes), scores remixers, and writes{' '}
            <code className="bg-slate-800 px-1 rounded text-slate-400">remix-rewards-YYYY-MM-DD.json</code>.
            Top remixers get bonus points in the next Monday snapshot — noted in the weekly receipt cast.
          </div>
        </section>

        {/* Weekly cadence */}
        <section>
          <h2 className="text-2xl font-black text-white mb-2">Weekly ops cadence</h2>
          <p className="text-slate-500 text-sm mb-6">
            Order matters — detect-moment reads last week&apos;s baseline; snapshot overwrites it.
            Never swap steps 1 and 3.
          </p>
          <div className="space-y-3">
            {WEEKLY_STEPS.map((step, i) => (
              <div key={step.step} className="bg-zao-card border border-zao-border rounded-xl px-5 py-4 flex gap-5 items-start">
                <div className="h-6 w-6 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-xs font-black text-gold-400 shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-white">{step.step}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      step.who === 'Zaal (human)'
                        ? 'border-zao-violet/40 text-zao-violet bg-zao-violet/10'
                        : 'border-slate-600/50 text-slate-500'
                    }`}>
                      {step.who}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 hidden sm:block">{step.day}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4 px-1">
            ZOL drafts. Humans decide. No step removes a human gate.
            See <Link href="/zol" className="text-slate-500 hover:text-slate-400 underline">ZOL admin →</Link>
          </p>
        </section>

        {/* Collectables — v2 */}
        <section className="bg-zao-card border border-zao-border rounded-2xl p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-500 mb-4">
            v2 — launching with first split distribution
          </div>
          <h2 className="text-xl font-black text-white mb-2">Collectables</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Every weekly snapshot mints an ERC-1155 receipt for every eligible contributor.
            Not a badge you bought. A permanent record: week, your points, your percentage, your share.
            On-chain SVG. Non-transferable. 52 weeks of showing up = 52 collectables.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>✓ ERC-1155 · Non-transferable</span>
            <span>✓ On-chain SVG — no IPFS dependency</span>
            <span>✓ Earned, never purchased</span>
            <span>✓ Launches with first split update</span>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-black text-white mb-3">Start earning</h2>
          <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
            Boost ZABAL on Boostr today. 10+ points puts you in the weekly split.
            Claim your share at splits.org — it waits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://boostr.itscashless.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold py-3 px-8"
            >
              Boost on Boostr ↗
            </a>
            <Link href="/leaderboard" className="py-3 px-8 rounded-xl border border-zao-border text-slate-300 hover:border-gold-500/50 hover:text-gold-400 transition-colors text-sm font-semibold">
              View leaderboard →
            </Link>
            <Link href="/back" className="py-3 px-8 rounded-xl border border-zao-border text-slate-300 hover:border-zao-violet/50 hover:text-zao-violet transition-colors text-sm font-semibold">
              Back with a card →
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Reward projections at ${(DAILY_VOLUME / 1000).toFixed(0)}k/day volume · Not financial advice · Perks = what holders enjoy today.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/receipt" className="text-slate-500 hover:text-slate-400 transition-colors">Receipt →</Link>
            <Link href="/discover" className="text-slate-500 hover:text-slate-400 transition-colors">Discover →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
