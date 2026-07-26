import { fetchBoostrStats, sortedContributors, isEligible, eligibleTotalPoints } from '@/lib/boostr'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Discover Sparks')}&sub=${encodeURIComponent('Live feed — top builders, trending contributions, rewards')}`

export const metadata: Metadata = {
  title: 'Discover — Zoostr',
  description:
    'Live discovery feed: top builders, trending contributors, and reward rankings. Back the empire — no token needed.',
  openGraph: {
    title: 'Discover Sparks — Zoostr',
    description: 'Live feed of top contributors, rewards, and trending sparks.',
    url: `${BASE_URL}/discover`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Discover Sparks' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Sparks — Zoostr',
    description: 'Live discovery feed — top builders and contribution rewards.',
    images: [OG_URL],
  },
}

const DAILY_VOLUME = 10_000
const FEE_TIER = 0.01
const COMMUNITY_SHARE = Number(process.env.NEXT_PUBLIC_COMMUNITY_SHARE_PCT ?? 50) / 100
const DAYS = 7

function fmtUsd(n: number) {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(1)}k`
}

// Trending score: weighted mix of points + repost velocity proxy
function trendScore(points: number, rank: number) {
  return points / Math.sqrt(rank + 1)
}

const FEATURED_SPARKS = [
  {
    id: 'zoostr',
    name: 'Zoostr',
    tagline: 'ZABAL × Boostr — the empire that pays back',
    category: 'Creator Coin',
    status: 'launching' as const,
    slug: '/',
    badge: 'ZAO-vetted',
  },
  {
    id: 'collab-single',
    name: 'Collab template',
    tagline: '50/50 split — both artists earn on every stream',
    category: 'Collab spark',
    status: 'template' as const,
    slug: '/examples',
    badge: null,
  },
  {
    id: 'fan-backed',
    name: 'Fan-backed EP',
    tagline: '70/20/10 — fans earn from the album they backed',
    category: 'Crowdfund spark',
    status: 'template' as const,
    slug: '/examples',
    badge: null,
  },
]

export default async function DiscoverPage() {
  let stats = null
  try {
    stats = await fetchBoostrStats()
  } catch {
    // fall through to empty state
  }

  const all = stats ? sortedContributors(stats) : []
  const eligible = all.filter(isEligible)
  const total = stats ? eligibleTotalPoints(stats) : 0
  const weeklyPool = DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * DAYS

  // Trending = top 5 by trend score
  const trending = eligible
    .map((u, i) => ({ ...u, trend: trendScore(u.zabalLikesCount, i) }))
    .sort((a, b) => b.trend - a.trend)
    .slice(0, 5)

  // Rising = ranks 6–15 (showing momentum outside the top 5)
  const rising = eligible.slice(5, 15)

  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors hidden sm:inline text-xs">
              Full leaderboard →
            </Link>
            <Link href="/back" className="btn-gold text-xs py-1.5 px-3">
              Back it
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-3 py-1 text-xs text-slate-400 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Live · updates every minute
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Discover</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Top builders · trending contributors · rewards by contribution
            </p>
          </div>
          {stats && (
            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-xl font-black text-gold-400">{eligible.length}</div>
                <div className="text-xs text-slate-600">eligible builders</div>
              </div>
              <div>
                <div className="text-xl font-black text-white">{fmtUsd(weeklyPool)}</div>
                <div className="text-xs text-slate-600">weekly reward pool</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-300">{stats.totalLikesGenerated.toLocaleString()}</div>
                <div className="text-xs text-slate-600">total likes</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main feed — left 2 cols */}
        <div className="lg:col-span-2 space-y-8">

          {/* Featured sparks */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Featured sparks
            </div>
            <div className="space-y-3">
              {FEATURED_SPARKS.map((spark) => (
                <Link
                  key={spark.id}
                  href={spark.slug}
                  className="block bg-zao-card border border-zao-border rounded-xl p-4 hover:border-gold-500/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white group-hover:text-gold-400 transition-colors">
                          {spark.name}
                        </span>
                        {spark.badge && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-zao-violet/40 text-zao-violet font-semibold">
                            ⬡ {spark.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{spark.tagline}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-xs text-slate-600">{spark.category}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          spark.status === 'launching'
                            ? 'border-gold-500/40 text-gold-400 bg-gold-500/10'
                            : 'border-zao-border text-slate-500'
                        }`}
                      >
                        {spark.status === 'launching' ? '⚡ Launching' : 'Template'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending contributors */}
          {trending.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Trending contributors
                </div>
                <Link href="/leaderboard" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                  Full board →
                </Link>
              </div>
              <div className="space-y-2">
                {trending.map((u, i) => {
                  const pct = total > 0 ? (u.zabalLikesCount / total) * 100 : 0
                  const earned = (pct / 100) * weeklyPool
                  return (
                    <div key={u.fid} className="bg-zao-card border border-zao-border rounded-xl px-4 py-3 flex items-center gap-4">
                      <div className="text-xs text-slate-600 w-5 text-right tabular-nums shrink-0">
                        {i + 1}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.pfp_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.fid}`}
                        alt={u.username}
                        width={32}
                        height={32}
                        className="rounded-full shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <a
                          href={`https://warpcast.com/${u.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-white hover:text-gold-400 transition-colors"
                        >
                          @{u.username}
                        </a>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="h-1 rounded-full bg-zao-border overflow-hidden w-20">
                            <div
                              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                              style={{ width: `${Math.min(pct * 3, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{pct.toFixed(1)}% of pool</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-bold text-gold-400">{fmtUsd(earned)}</div>
                        <div className="text-xs text-slate-600">/week est.</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rising (ranks 6–15) */}
          {rising.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Rising — watch these
              </div>
              <div className="grid grid-cols-2 gap-3">
                {rising.map((u, i) => {
                  const pct = total > 0 ? (u.zabalLikesCount / total) * 100 : 0
                  const earned = (pct / 100) * weeklyPool
                  return (
                    <div key={u.fid} className="bg-zao-card border border-zao-border rounded-xl p-3 flex items-center gap-3">
                      <span className="text-xs text-slate-600 tabular-nums shrink-0">#{i + 6}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.pfp_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.fid}`}
                        alt={u.username}
                        width={24}
                        height={24}
                        className="rounded-full shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <a
                          href={`https://warpcast.com/${u.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-white hover:text-gold-400 transition-colors truncate block"
                        >
                          @{u.username}
                        </a>
                        <div className="text-xs text-gold-400 font-bold">{fmtUsd(earned)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!stats && (
            <div className="bg-zao-card border border-zao-border rounded-xl p-8 text-center">
              <p className="text-slate-500 text-sm">Could not load live data — try refreshing.</p>
              <a
                href="https://boostr.itscashless.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-gold-400 hover:underline"
              >
                Visit Boostr directly ↗
              </a>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Reward mechanics */}
          <div className="bg-zao-card border border-gold-500/20 rounded-2xl p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              How rewards work
            </div>
            <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs flex items-center justify-center font-bold shrink-0">1</div>
                <p>Boost ZABAL on Boostr — every like earns you points.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs flex items-center justify-center font-bold shrink-0">2</div>
                <p>Points = your share of the weekly pool. No governance. No voting. Contribution → reward.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs flex items-center justify-center font-bold shrink-0">3</div>
                <p>Fees flow into the 0xSplits contract. Claim anytime at splits.org — no deadline.</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-zao-border">
              <div className="text-xs text-slate-600 mb-3">Weekly pool at ${(DAILY_VOLUME / 1000).toFixed(0)}k/day volume</div>
              <div className="text-2xl font-black text-gold-400">{fmtUsd(weeklyPool)}</div>
              <div className="text-xs text-slate-600">split across {eligible.length} eligible builders by points</div>
            </div>
            <Link href="/back" className="mt-4 block btn-gold text-center text-xs py-2">
              Back the empire →
            </Link>
          </div>

          {/* Quick links */}
          <div className="bg-zao-card border border-zao-border rounded-2xl p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Explore
            </div>
            <div className="space-y-2">
              {[
                { href: '/leaderboard', label: '📊 Full leaderboard' },
                { href: '/receipt', label: '🧾 Weekly receipt' },
                { href: '/examples', label: '⚡ Spark templates' },
                { href: '/audius', label: '🎵 Audius integration' },
                { href: '/advisor', label: '🤖 AI advisor' },
                { href: '/split-wizard', label: '⚙️ Split wizard' },
                { href: '/vetted', label: '⬡ ZAO-vetted' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Launch CTA */}
          <div className="bg-zao-card border border-zao-violet/30 rounded-2xl p-5 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-sm font-black text-white mb-2">Launch your spark</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Creator token, collab split, or fan-backed project — no token required to start.
            </p>
            <Link href="/launch" className="block py-2 px-4 rounded-xl bg-zao-violet/20 border border-zao-violet/40 text-zao-violet hover:bg-zao-violet/30 text-xs font-bold transition-colors">
              Start building →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
