import {
  fetchBoostrStats,
  sortedContributors,
  isEligible,
  eligibleTotalPoints,
  MIN_POINTS,
} from '@/lib/boostr'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const SPLITS_ADDRESS = process.env.NEXT_PUBLIC_SPLITS_ADDRESS ?? null
const ASSUMED_DAILY_VOLUME = 10_000
const FEE_TIER = 0.01
// Set NEXT_PUBLIC_COMMUNITY_SHARE_PCT in Vercel env vars to match the on-chain split.
// At launch (97/2/1): 1. After evolving to 50/25/25: 50.
const COMMUNITY_SHARE = Number(process.env.NEXT_PUBLIC_COMMUNITY_SHARE_PCT ?? 50) / 100
const DAYS = 7

export const metadata: Metadata = {
  title: 'Weekly Receipt — Zoostr',
  description: 'Live snapshot: who earned what in the Zoostr leaderboard pool this week.',
  openGraph: {
    title: 'Zoostr Weekly Receipt — back the empire',
    description: 'Live leaderboard snapshot: top earners + empire stats.',
    images: [`${BASE_URL}/api/og?title=Zoostr+Weekly+Receipt&sub=Live+leaderboard+snapshot`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr Weekly Receipt — back the empire',
    description: 'Live leaderboard: who earned what from $ZOOSTR trading fees this week.',
    images: [`${BASE_URL}/api/og?title=Zoostr+Weekly+Receipt&sub=Live+leaderboard+snapshot`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${BASE_URL}/api/og?title=Zoostr+Weekly+Receipt&sub=Live+leaderboard+snapshot`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '📊 Full leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/leaderboard`,
    'fc:frame:button:2': '⚡ Start boosting',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://boostr.itscashless.com',
  },
}

function formatUsd(n: number): string {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(1)}k`
}

function weekLabel(): string {
  const d = new Date()
  const start = new Date(d)
  start.setDate(d.getDate() - d.getDay() + 1) // Monday
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function ReceiptPage() {
  let stats = null
  try {
    stats = await fetchBoostrStats()
  } catch {
    // show error state below
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-zao-dark flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-3">⚠</div>
          <p>Could not load receipt — try refreshing.</p>
        </div>
      </main>
    )
  }

  const all = sortedContributors(stats)
  const eligible = all.filter(isEligible)
  const total = eligibleTotalPoints(stats)
  const weeklyPool = ASSUMED_DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * DAYS

  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">Week of {weekLabel()}</span>
            <Link
              href="/leaderboard"
              className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-semibold"
            >
              Full leaderboard →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-24 space-y-6">
        {/* Receipt header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-semibold mb-5">
            ZOOSTR WEEKLY RECEIPT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Week of {weekLabel()}
          </h1>
          <p className="text-slate-500 text-sm">
            Live snapshot — updates when leaderboard changes
          </p>
        </div>

        {/* Empire stats */}
        <div className="card-dark p-6 font-mono">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Empire stats
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'active boosters', value: stats.activeContributorsCount },
              { label: 'eligible (≥10 pts)', value: eligible.length },
              { label: 'total likes', value: stats.totalLikesGenerated.toLocaleString() },
              { label: 'casts liked', value: stats.totalCastsLiked.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xl font-black text-gold-400">{value}</div>
                <div className="text-xs text-slate-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pool breakdown */}
        <div className="card-dark p-6 font-mono">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Leaderboard pool · at ${(ASSUMED_DAILY_VOLUME / 1000).toFixed(0)}k/day volume
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {formatUsd(weeklyPool)}
          </div>
          <div className="text-xs text-slate-600">
            1% fee × {COMMUNITY_SHARE * 100}% community share × 7 days
            · split across {eligible.length} eligible boosters by points
          </div>
          <div className="text-xs text-slate-700 mt-2">
            Minimum threshold: {MIN_POINTS} pts · boosters below threshold not included
          </div>
        </div>

        {/* Top earners */}
        <div className="card-dark overflow-hidden font-mono">
          <div className="px-5 py-4 border-b border-zao-border">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Distribution weights — top {Math.min(eligible.length, 15)} boosters
            </div>
          </div>
          <div className="divide-y divide-zao-border/50">
            {eligible.slice(0, 15).map((u, i) => {
              const pct = total > 0 ? (u.zabalLikesCount / total) * 100 : 0
              const earned = (pct / 100) * weeklyPool
              return (
                <div key={u.fid} className="px-5 py-3 flex items-center gap-4">
                  <div className="text-slate-600 w-5 text-right text-xs tabular-nums flex-shrink-0">
                    {i + 1}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.pfp_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.fid}`}
                    alt={u.username}
                    width={24}
                    height={24}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={`https://warpcast.com/${u.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-semibold hover:text-gold-400 transition-colors"
                    >
                      @{u.username}
                    </a>
                  </div>
                  <div className="text-xs text-slate-600 tabular-nums flex-shrink-0 hidden sm:block">
                    {u.zabalLikesCount} pts
                  </div>
                  <div className="text-xs text-slate-400 tabular-nums flex-shrink-0 w-12 text-right">
                    {pct.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gold-400 font-bold tabular-nums flex-shrink-0 w-16 text-right">
                    {formatUsd(earned)}
                  </div>
                </div>
              )
            })}
            {eligible.length > 15 && (
              <div className="px-5 py-3 text-xs text-slate-600 text-center">
                + {eligible.length - 15} more boosters
              </div>
            )}
          </div>
        </div>

        {/* On-chain anchor */}
        <div className="card-dark p-5 font-mono">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Verified on-chain
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-slate-600 w-24 flex-shrink-0">Split contract</span>
              <span className="text-white font-mono">
                {SPLITS_ADDRESS ?? '[set after deploy]'}
              </span>
            </div>
            {SPLITS_ADDRESS && (
              <div className="flex gap-3">
                <span className="text-slate-600 w-24 flex-shrink-0">Basescan</span>
                <a
                  href={`https://basescan.org/address/${SPLITS_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  basescan.org ↗
                </a>
              </div>
            )}
            <div className="flex gap-3">
              <span className="text-slate-600 w-24 flex-shrink-0">Claim at</span>
              <a
                href="https://app.splits.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                app.splits.org ↗
              </a>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center py-4">
          <p className="text-xl font-black text-gold-400">Back the empire. 🟡</p>
          <p className="text-xs text-slate-600 mt-2">
            Projections at ${(ASSUMED_DAILY_VOLUME / 1000).toFixed(0)}k/day volume ·{' '}
            <Link href="/leaderboard" className="text-slate-500 hover:text-slate-400 underline">
              adjust volume on leaderboard →
            </Link>
          </p>
        </div>

        {/* Share CTA */}
        <div className="card-dark p-5 border-gold-500/20 text-center">
          <p className="text-sm text-slate-400 mb-3">
            Share this receipt to show your community what they&rsquo;ve built.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`zoostr weekly receipt 🟡\n\n${eligible.length} boosters · top earner: ${eligible[0]?.username ?? '—'}\n\nback the empire → ${BASE_URL}/receipt`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-zao-violet/20 border border-zao-violet/30 text-zao-violet hover:bg-zao-violet/30 text-sm font-semibold transition-colors"
            >
              Cast on Farcaster ↗
            </a>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(`zoostr weekly receipt 🟡\n\n${eligible.length} boosters · top earner: @${eligible[0]?.username ?? '—'}\n\nback the empire → ${BASE_URL}/receipt`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/40 text-slate-300 hover:bg-slate-700/50 text-sm font-semibold transition-colors"
            >
              Post on X ↗
            </a>
            <Link href="/leaderboard" className="btn-gold text-sm py-2 px-4">
              Full leaderboard →
            </Link>
          </div>
        </div>

        {/* How to join */}
        <div className="card-dark p-5 border-zao-border/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Not on the leaderboard yet?
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Boost ZABAL on Boostr — like his casts, and get others to like them too. Every {MIN_POINTS}+ points
            puts you in the weekly split. The top 15 are on this receipt.
          </p>
          <a
            href="https://boostr.itscashless.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-sm font-semibold transition-colors"
          >
            Start boosting ↗
          </a>
        </div>
      </div>
    </main>
  )
}
