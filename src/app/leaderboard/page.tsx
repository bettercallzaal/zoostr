import { fetchBoostrStats, sortedContributors, eligibleTotalPoints } from '@/lib/boostr'
import LeaderboardTable from '@/components/LeaderboardTable'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_IMAGE = `${BASE_URL}/api/og`

export const metadata: Metadata = {
  title: 'Empire Leaderboard — Zoostr',
  description:
    'Every ZABAL booster ranked by points. Free to join and optional. Not live yet.',
  openGraph: {
    title: 'Empire Leaderboard — Zoostr',
    description: 'See your points and rank on the Zoostr leaderboard.',
    type: 'website',
    url: `${BASE_URL}/leaderboard`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Zoostr Live Leaderboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr Leaderboard',
    description: 'See your points and rank.',
    images: [OG_IMAGE],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_IMAGE,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '📊 Points and rank',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/leaderboard`,
    'fc:frame:button:2': '⚡ Boost on Boostr',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://boostr.itscashless.com',
  },
}

export default async function LeaderboardPage() {
  let contributors: Awaited<ReturnType<typeof sortedContributors>> = []
  let total = 0
  let activeCount = 0
  let totalLikes = 0
  let apiDown = false

  try {
    const stats = await fetchBoostrStats()
    contributors = sortedContributors(stats)
    total = eligibleTotalPoints(stats)
    activeCount = stats.activeContributorsCount
    totalLikes = stats.totalLikesGenerated
  } catch {
    apiDown = true
  }

  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://boostr.itscashless.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold transition-colors"
            >
              Boost on Boostr ↗
            </a>
          </div>
        </div>
      </nav>

      {apiDown && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 px-5 py-3 text-sm text-amber-400">
            Boostr API unavailable — leaderboard data may be stale. Reload to try again.
          </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto px-4 pt-14 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Empire Leaderboard</h1>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              Every booster ranked by points. Free to join and optional. Points and rank on the
              leaderboard. No payouts or fee sharing are promised. Not live yet.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zao-violet/10 border border-zao-violet/20 text-zao-violet text-xs font-medium">
                🎖 Weekly proof-of-contribution collectable (v2)
              </span>
            </div>
          </div>

          {contributors.length > 0 && (
            <div className="flex gap-6 text-center flex-shrink-0">
              <div>
                <div className="text-2xl font-black text-gold-400">{activeCount}</div>
                <div className="text-xs text-slate-500 mt-0.5">active boosters</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{totalLikes.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-0.5">total likes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{contributors.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">all boosters</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        {contributors.length > 0 ? (
          <LeaderboardTable contributors={contributors} totalPoints={total} showAll />
        ) : (
          <div className="text-center py-20 text-slate-500">
            {apiDown
              ? 'Boostr API unavailable — leaderboard is loading. Try refreshing.'
              : 'No boosters yet — be the first.'}
          </div>
        )}
      </section>
    </main>
  )
}
