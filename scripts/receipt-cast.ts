/**
 * receipt-cast.ts
 *
 * Generates a Farcaster-ready weekly receipt cast for the Zoostr leaderboard.
 * Prints to stdout — review before posting.
 *
 * Usage:
 *   npx ts-node scripts/receipt-cast.ts
 *   VOLUME=50000 npx ts-node scripts/receipt-cast.ts
 *
 * VOLUME = assumed daily trading volume in USD (default: 10000)
 */

import type { BoostrApiResponse, BoostrStats, Contributor } from '../src/lib/types'

const BOOSTR_URL = 'https://boostr.itscashless.com/api/zabaal/stats'
const FEE_TIER = 0.01
const COMMUNITY_SHARE = 0.5
const DAYS_PER_WEEK = 7
const TOP_N = 5

const DAILY_VOLUME = Number(process.env.VOLUME ?? 10_000)

function weeklyPool(): number {
  return DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * DAYS_PER_WEEK
}

function earningsForPoints(points: number, total: number): number {
  if (total === 0) return 0
  return (points / total) * weeklyPool()
}

function formatUsd(n: number): string {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(2)}k`
}

async function fetchStats(): Promise<BoostrStats> {
  const res = await fetch(BOOSTR_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Boostr API error: ${res.status}`)
  const raw: BoostrApiResponse = await res.json()
  if (!raw.success || !raw.stats) throw new Error('Unexpected API shape')
  const s = raw.stats
  return {
    totalCastsLiked: s.totalCastsLiked ?? 0,
    activeContributorsCount: s.activeContributorsCount ?? 0,
    allTimeContributorsCount: s.allTimeContributorsCount ?? 0,
    totalLikesGenerated: s.totalLikesGenerated ?? 0,
    contributors: s.zabalUsers ?? [],
  }
}

function sortContributors(stats: BoostrStats): Contributor[] {
  return [...stats.contributors].sort((a, b) => {
    if (b.zabalLikesCount !== a.zabalLikesCount) return b.zabalLikesCount - a.zabalLikesCount
    return b.followers_count - a.followers_count
  })
}

async function main() {
  const stats = await fetchStats()
  const sorted = sortContributors(stats)
  const total = sorted.reduce((sum, c) => sum + c.zabalLikesCount, 0)
  const pool = weeklyPool()
  const top = sorted.slice(0, TOP_N)

  const today = new Date().toISOString().slice(0, 10)

  // Cast 1: Empire receipt header
  const cast1 = `📜 ZOOSTR RECEIPT — ${today}

weekly leaderboard → fees
assumed volume: ${formatUsd(DAILY_VOLUME)}/day

🏆 top ${TOP_N} this week:
${top.map((c, i) => {
  const earned = earningsForPoints(c.zabalLikesCount, total)
  const pct = total > 0 ? ((c.zabalLikesCount / total) * 100).toFixed(1) : '0.0'
  return `${i + 1}. @${c.username} — ${c.zabalLikesCount.toLocaleString()} pts (${pct}%) → ~${formatUsd(earned)}/wk`
}).join('\n')}

total leaderboard pool → ${formatUsd(pool)}/wk
${stats.activeContributorsCount} active boosters · ${total.toLocaleString()} total points`

  // Cast 2: Empire stats + CTA
  const cast2 = `${stats.totalLikesGenerated.toLocaleString()} likes generated
${stats.totalCastsLiked.toLocaleString()} casts liked
${stats.allTimeContributorsCount} all-time boosters

every week. every trade. your share.

boost on ZABAL → earn from $ZOOSTR
boostr.itscashless.com

not financial advice. projections at assumed volume.`

  console.log('=== CAST 1 (receipt) ===')
  console.log(cast1)
  console.log()
  console.log('=== CAST 2 (stats + CTA) ===')
  console.log(cast2)
  console.log()
  console.log(`--- ${cast1.length} chars (cast 1) | ${cast2.length} chars (cast 2) | Farcaster limit: 1024 ---`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
