import type { BoostrApiResponse, BoostrStats, Contributor } from './types'

// Override only for local dev against a fixture; production always hits the live API.
const BOOSTR_URL = process.env.BOOSTR_STATS_URL ?? 'https://boostr.itscashless.com/api/zabaal/stats'

// Must match snapshot-split.ts MIN_POINTS so leaderboard eligibility = allocation eligibility
export const MIN_POINTS = 10

export function isEligible(c: Contributor): boolean {
  return c.zabalEnabled && c.zabalLikesCount >= MIN_POINTS
}

export async function fetchBoostrStats(): Promise<BoostrStats> {
  const res = await fetch(BOOSTR_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Boostr API error: ${res.status}`)

  const raw: BoostrApiResponse = await res.json()

  if (!raw.success || !raw.stats) throw new Error('Unexpected Boostr API shape')

  const s = raw.stats
  return {
    totalCastsLiked: s.totalCastsLiked ?? 0,
    activeContributorsCount: s.activeContributorsCount ?? 0,
    allTimeContributorsCount: s.allTimeContributorsCount ?? 0,
    totalLikesGenerated: s.totalLikesGenerated ?? 0,
    contributors: s.zabalUsers ?? [],
  }
}

export function sortedContributors(stats: BoostrStats) {
  const list = stats?.contributors ?? []
  return [...list].sort((a, b) => {
    if (b.zabalLikesCount !== a.zabalLikesCount) return b.zabalLikesCount - a.zabalLikesCount
    return b.followers_count - a.followers_count
  })
}

// Competition ranking: everyone on the same points shares a rank (1,1,1,4...).
// Boostr ties are common - 15 contributors sat on 74 boosts at time of writing.
export function rankedContributors(stats: BoostrStats) {
  const sorted = sortedContributors(stats)
  let rank = 0
  let lastPoints: number | null = null
  return sorted.map((c, i) => {
    if (c.zabalLikesCount !== lastPoints) {
      rank = i + 1
      lastPoints = c.zabalLikesCount
    }
    return { ...c, rank }
  })
}

// Points over ALL contributors (for display denominators that include everyone)
export function totalPoints(stats: BoostrStats): number {
  return (stats?.contributors ?? []).reduce((sum, c) => sum + (c.zabalLikesCount ?? 0), 0)
}

// Points over ELIGIBLE contributors only — matches snapshot-split.ts allocation denominator
export function eligibleTotalPoints(stats: BoostrStats): number {
  return (stats?.contributors ?? [])
    .filter(isEligible)
    .reduce((sum, c) => sum + (c.zabalLikesCount ?? 0), 0)
}

export function feeSharePct(points: number, total: number): string {
  if (total === 0) return '0.00'
  return ((points / total) * 100).toFixed(2)
}
