import type { BoostrStats, Contributor } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeContributors(raw: any): Contributor[] {
  // API may return array directly or under various field names
  const list: unknown[] = Array.isArray(raw)
    ? raw
    : raw?.contributors ?? raw?.boosters ?? raw?.users ?? raw?.data?.contributors ?? []

  return (list as Contributor[]).filter(
    (c) => c && typeof c === 'object' && ('fid' in c || 'username' in c)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStats(raw: any, contributors: Contributor[]): BoostrStats {
  const empire = raw?.empire ?? raw?.stats ?? raw
  return {
    activeContributorsCount:
      empire?.activeContributorsCount ?? empire?.active_contributors ?? contributors.length,
    totalLikesGenerated:
      empire?.totalLikesGenerated ?? empire?.total_likes ?? 0,
    totalCastsLiked:
      empire?.totalCastsLiked ?? empire?.total_casts_liked ?? 0,
    contributors,
  }
}

export async function fetchBoostrStats(): Promise<BoostrStats> {
  const res = await fetch('https://boostr.itscashless.com/api/zabaal/stats', {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Boostr API error: ${res.status}`)

  const raw = await res.json()
  const contributors = normalizeContributors(raw)
  return normalizeStats(raw, contributors)
}

export function sortedContributors(stats: BoostrStats) {
  const list = stats?.contributors ?? []
  return [...list].sort((a, b) => {
    if (b.zabalLikesCount !== a.zabalLikesCount) return b.zabalLikesCount - a.zabalLikesCount
    return b.followers_count - a.followers_count
  })
}

export function totalPoints(stats: BoostrStats): number {
  return (stats?.contributors ?? []).reduce((sum, c) => sum + (c.zabalLikesCount ?? 0), 0)
}

export function feeSharePct(points: number, total: number): string {
  if (total === 0) return '0.00'
  return ((points / total) * 100).toFixed(2)
}
