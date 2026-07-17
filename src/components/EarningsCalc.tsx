'use client'

import { useState, useMemo } from 'react'
import type { Contributor } from '@/lib/types'

const FEE_TIER = 0.01
const COMMUNITY_SHARE = 0.50
const DAYS_PER_WEEK = 7

const VOLUME_PRESETS = [
  { label: '$1k/day', value: 1_000 },
  { label: '$10k/day', value: 10_000 },
  { label: '$50k/day', value: 50_000 },
  { label: '$100k/day', value: 100_000 },
  { label: '$500k/day', value: 500_000 },
]

function formatUsd(n: number): string {
  if (n < 0.01) return '<$0.01'
  if (n < 1) return `$${n.toFixed(2)}`
  if (n < 10_000) return `$${Math.round(n).toLocaleString()}`
  return `$${(n / 1_000).toFixed(1)}k`
}

type Row = Contributor & { weeklyEarnings: number }

type Props = {
  contributors: Contributor[]
  totalPoints: number
}

export default function EarningsCalc({ contributors, totalPoints }: Props) {
  const [dailyVolume, setDailyVolume] = useState(10_000)
  const [search, setSearch] = useState('')

  const weeklyPool = dailyVolume * FEE_TIER * COMMUNITY_SHARE * DAYS_PER_WEEK

  const rows: Row[] = useMemo(
    () =>
      contributors.map((c) => ({
        ...c,
        weeklyEarnings:
          totalPoints > 0 ? (c.zabalLikesCount / totalPoints) * weeklyPool : 0,
      })),
    [contributors, totalPoints, weeklyPool]
  )

  const query = search.trim().toLowerCase()
  const visibleRows = query
    ? rows.filter((r) => r.username.toLowerCase().includes(query))
    : rows

  return (
    <div>
      {/* Volume selector */}
      <div className="card-dark p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white mb-0.5">Earnings calculator</div>
            <div className="text-xs text-slate-500">1% fee · 50% to leaderboard · weekly distribution</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {VOLUME_PRESETS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setDailyVolume(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  dailyVolume === value
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : 'bg-zao-dark border-zao-border text-slate-400 hover:border-gold-500/50 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">Weekly leaderboard pool</div>
            <div className="text-xl font-black text-gold-400">{formatUsd(weeklyPool)}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Find your username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-zao-card border border-zao-border rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50"
        />
        <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
          {query ? `${visibleRows.length} of ${rows.length}` : `${rows.length} boosters`}
        </span>
      </div>

      {/* Table */}
      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zao-border text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Booster</th>
                <th className="text-right py-3 px-4">Points</th>
                <th className="text-right py-3 px-4 hidden sm:table-cell">Followers</th>
                <th className="text-right py-3 px-4">Share</th>
                <th className="text-right py-3 px-4">$/week</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((c) => {
                const globalRank = rows.indexOf(c)
                const share = totalPoints > 0 ? (c.zabalLikesCount / totalPoints) * 100 : 0
                return (
                  <tr
                    key={c.fid}
                    className={`border-b border-zao-border/50 hover:bg-white/3 transition-colors ${
                      globalRank < 3 ? 'bg-gold-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-500 font-mono">{globalRank + 1}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://warpcast.com/${c.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <img
                          src={c.pfp_url}
                          alt={c.username}
                          width={32}
                          height={32}
                          className="rounded-full flex-shrink-0"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${c.fid}`
                          }}
                        />
                        <div className="font-medium text-white group-hover:text-gold-400 transition-colors">
                          @{c.username}
                        </div>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gold-400 tabular-nums">
                      {c.zabalLikesCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 tabular-nums hidden sm:table-cell">
                      {c.followers_count.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                      {share.toFixed(2)}%
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold tabular-nums ${
                        c.weeklyEarnings >= 1 ? 'text-gold-400' : 'text-slate-500'
                      }`}
                    >
                      {formatUsd(c.weeklyEarnings)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">No contributors yet.</div>
        )}
        {rows.length > 0 && visibleRows.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No booster found for &ldquo;{search}&rdquo; — check your Farcaster username.
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 text-center mt-4">
        Projections are estimates based on selected daily trading volume. Actual earnings depend on
        market activity. Nothing here is financial advice.
      </p>
    </div>
  )
}
