import { fetchBoostrStats, sortedContributors, totalPoints } from '@/lib/boostr'
import EarningsCalc from '@/components/EarningsCalc'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Empire Leaderboard — Zoostr',
  description:
    'Every ZABAL booster ranked by points with projected $ZOOSTR weekly earnings at your chosen trading volume.',
  openGraph: {
    title: 'Empire Leaderboard — Zoostr',
    description: 'See your fee share and weekly earnings projection from $ZOOSTR trading fees.',
  },
}

export default async function LeaderboardPage() {
  let contributors: Awaited<ReturnType<typeof sortedContributors>> = []
  let total = 0
  let activeCount = 0
  let totalLikes = 0

  try {
    const stats = await fetchBoostrStats()
    contributors = sortedContributors(stats)
    total = totalPoints(stats)
    activeCount = stats.activeContributorsCount
    totalLikes = stats.totalLikesGenerated
  } catch {
    // show empty state below
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
            <Link
              href="/#tokenomics"
              className="text-slate-400 hover:text-white transition-colors hidden sm:inline"
            >
              How it works
            </Link>
            <a
              href="https://boostr.itscashless.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold transition-colors"
            >
              Boost to earn ↗
            </a>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 pt-14 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Empire Leaderboard</h1>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              Every booster ranked by points. Your share of the leaderboard pool = your points ÷ total
              points. Fees flow to your wallet automatically — no claiming.
            </p>
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

      <section className="max-w-5xl mx-auto px-4 pb-24">
        {contributors.length > 0 ? (
          <EarningsCalc contributors={contributors} totalPoints={total} />
        ) : (
          <div className="text-center py-20 text-slate-500">
            Could not load leaderboard — try refreshing.
          </div>
        )}
      </section>
    </main>
  )
}
