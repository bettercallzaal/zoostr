/**
 * /zol — ZOL Meme Engine admin
 *
 * Human-in-the-loop draft/approve UI for the v1 Meme Engine loop:
 *   flag moment → draft 3 variants → approve → post → Community Swarm remix → reward + receipt
 *
 * This page is unlisted (not in sitemap/nav). ZOL and Zaal use it directly.
 * Approval always goes through Warpcast compose (human click = final gate).
 * Optional: NEYNAR_API_KEY enables direct posting from the /api/zol/post route.
 */

import type { Metadata } from 'next'
import {
  fetchBoostrStats,
  sortedContributors,
  eligibleTotalPoints,
  isEligible,
} from '@/lib/boostr'
import ZolApprovePanel from '@/components/ZolApprovePanel'

export const revalidate = 60

const DAILY_VOLUME = Number(process.env.ZOL_ASSUMED_VOLUME ?? 10_000)
const FEE_TIER = 0.01
const COMMUNITY_SHARE = 0.5
const SPLITS_ADDRESS = process.env.NEXT_PUBLIC_SPLITS_ADDRESS ?? null
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'

export const metadata: Metadata = {
  title: 'ZOL — Meme Engine',
  robots: { index: false, follow: false },
}

function fmt(n: number): string {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(1)}k`
}

function pct(points: number, total: number): string {
  if (total === 0) return '0.0%'
  return `${((points / total) * 100).toFixed(1)}%`
}

function earnings(points: number, total: number): string {
  if (total === 0) return '$0'
  const pool = DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * 7
  return fmt((points / total) * pool)
}

function buildDrafts(stats: Awaited<ReturnType<typeof fetchBoostrStats>>, today: string) {
  const sorted = sortedContributors(stats)
  const eligible = sorted.filter(isEligible)
  const total = eligibleTotalPoints(stats)
  const pool = fmt(DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * 7)
  const top5 = eligible.slice(0, 5)
  const top = top5[0]
  const splitsLine = SPLITS_ADDRESS ? `\nsplits: basescan.org/address/${SPLITS_ADDRESS}` : ''
  const receiptLine = `\nfull receipt → ${BASE_URL}/receipt`

  const v1 = `ZOOSTR WEEKLY RECEIPT · ${today}

empire stats:
📊 ${stats.activeContributorsCount} active boosters
❤️ ${stats.totalLikesGenerated.toLocaleString()} total likes
💰 ${pool}/week in the pool

top earners:
${top5.map((u, i) => `${i + 1}. @${u.username} — ${pct(u.zabalLikesCount, total)} — ${earnings(u.zabalLikesCount, total)}/week`).join('\n')}${splitsLine}${receiptLine}`

  const v2 = `the empire doesn't lie.

@${top?.username ?? 'the community'} is #1 this week — ${top ? `${pct(top.zabalLikesCount, total)} of the pool, ${earnings(top.zabalLikesCount, total)}/week` : ''}

${stats.activeContributorsCount} people showed up before $ZOOSTR existed. that's the empire.

every trade now pays them back. weekly. on-chain. claim at splits.org.${receiptLine}`

  const v3 = `${stats.activeContributorsCount} people built the empire.

they didn't wait for a coin. they just showed up — liked the casts, boosted the reach, kept the leaderboard moving.

now ${pool}/week flows to them. proportional to what they put in. forever.

that's what "back the work" looks like.${receiptLine}`

  return [
    { variant: 1 as const, angle: 'announcement / stats', text: v1 },
    { variant: 2 as const, angle: 'proof / leaderboard (calls out #1)', text: v2 },
    { variant: 3 as const, angle: 'anthem / "back the work"', text: v3 },
  ]
}

async function getStats() {
  try {
    return await fetchBoostrStats()
  } catch {
    return null
  }
}

export default async function ZolPage() {
  const today = new Date().toISOString().slice(0, 10)
  const stats = await getStats()
  const pool = fmt(DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * 7)

  const sorted = stats ? sortedContributors(stats) : []
  const eligible = sorted.filter(isEligible)
  const total = stats ? eligibleTotalPoints(stats) : 0
  const drafts = stats ? buildDrafts(stats, today) : []

  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOL</span>
            <span className="text-white"> · Meme Engine</span>
          </span>
          <span className="text-xs text-slate-500">v1 · {today}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 space-y-8">

        {!stats && (
          <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 px-5 py-3 text-sm text-amber-400">
            Boostr API unavailable — showing cached data if available, otherwise reload in a moment.
          </div>
        )}

        {/* Empire stats */}
        <div className="card-dark p-6">
          <div className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4">
            Current empire stats
          </div>
          {stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active boosters', value: stats.activeContributorsCount.toString() },
                { label: 'Total likes', value: stats.totalLikesGenerated.toLocaleString() },
                { label: 'Weekly pool', value: pool },
                { label: 'Eligible for split', value: eligible.length.toString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-600 text-sm">Stats unavailable — Boostr API did not respond.</div>
          )}
        </div>

        {/* Top earners preview */}
        <div className="card-dark p-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Top 5 earners (current)
          </div>
          {eligible.length > 0 ? (
            <div className="space-y-2">
              {eligible.slice(0, 5).map((u, i) => (
                <div key={u.fid} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 w-4 text-right tabular-nums">{i + 1}</span>
                    {u.pfp_url && (
                      <img src={u.pfp_url} alt={u.username} width={24} height={24} className="rounded-full" />
                    )}
                    <span className="text-white font-medium">@{u.username}</span>
                  </div>
                  <div className="flex gap-4 text-right tabular-nums">
                    <span className="text-slate-400">{pct(u.zabalLikesCount, total)}</span>
                    <span className="text-gold-400 font-bold">{earnings(u.zabalLikesCount, total)}/wk</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-600 text-sm">{stats ? 'No eligible boosters yet.' : 'Leaderboard unavailable.'}</div>
          )}
        </div>

        {/* Draft variants + approve panel */}
        <div>
          <div className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4">
            Draft cast variants — pick one to approve
          </div>
          {drafts.length > 0 ? (
            <ZolApprovePanel drafts={drafts} />
          ) : (
            <div className="card-dark p-6 text-slate-600 text-sm">
              Draft generation requires live Boostr data. Reload when the API is back.
            </div>
          )}
        </div>

        {/* Loop guide */}
        <div className="card-dark p-6 border-zao-violet/20">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            V1 Meme Engine loop
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { step: '1. Flag + draft', desc: 'This page auto-detects the weekly receipt moment and generates 3 variants from live data' },
              { step: '2. Approve + post', desc: 'You pick a variant, optionally edit it, then click the Warpcast compose link. One human click = final gate.' },
              { step: '3. Swarm + receipt', desc: 'After posting, watch quote-casts for 24h. Top remixers get flagged for the next snapshot points bonus.' },
            ].map(({ step, desc }) => (
              <div key={step}>
                <div className="font-bold text-white mb-1">{step}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-700 mt-4 leading-relaxed">
            ZOL drafts. Zaal approves. No cast posts without explicit human selection.
            This guardrail is non-negotiable in v1.
          </p>
        </div>

      </div>
    </main>
  )
}
