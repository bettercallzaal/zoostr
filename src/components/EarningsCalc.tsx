'use client'

import { useState, useMemo } from 'react'
import type { Contributor } from '@/lib/types'

const FEE_TIER = 0.01
// NEXT_PUBLIC_COMMUNITY_SHARE_PCT: Zoostr launches with 50% community pool. Default is 50.
const COMMUNITY_SHARE = Number(process.env.NEXT_PUBLIC_COMMUNITY_SHARE_PCT ?? 50) / 100
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
  minPoints?: number
}

export default function EarningsCalc({ contributors, totalPoints, minPoints = 0 }: Props) {
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
            <div className="text-xs text-slate-500">1% fee · {COMMUNITY_SHARE * 100}% to leaderboard · weekly distribution</div>
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
          {query
            ? `${visibleRows.length} of ${rows.length}`
            : `${rows.filter((r) => r.zabalEnabled && r.zabalLikesCount >= minPoints).length} eligible · ${rows.length} total`}
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
                const eligible = c.zabalEnabled && c.zabalLikesCount >= minPoints
                const share = eligible && totalPoints > 0 ? (c.zabalLikesCount / totalPoints) * 100 : 0
                return (
                  <tr
                    key={c.fid}
                    className={`group border-b border-zao-border/50 hover:bg-white/3 transition-colors ${
                      !eligible ? 'opacity-50' : globalRank < 3 ? 'bg-gold-500/5' : ''
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
                      {eligible ? `${share.toFixed(2)}%` : '—'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold tabular-nums ${
                        eligible && c.weeklyEarnings >= 1 ? 'text-gold-400' : 'text-slate-500'
                      }`}
                    >
                      {eligible ? (
                        <span className="flex items-center justify-end gap-2">
                          <span>{formatUsd(c.weeklyEarnings)}</span>
                          <a
                            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`i'm #${globalRank + 1} on the Zoostr leaderboard\n\n@${c.username} — ${share.toFixed(1)}% of the pool — ${formatUsd(c.weeklyEarnings)}/week\n\nthe empire pays its builders\nboost to earn → zoostr.xyz/leaderboard`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Cast your rank on Farcaster"
                            className="text-slate-600 hover:text-zao-violet transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ↗
                          </a>
                        </span>
                      ) : !c.zabalEnabled
                        ? 'enable Boostr'
                        : `${minPoints - c.zabalLikesCount} pts to unlock`}
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

      {/* Claiming guide */}
      <div className="mt-8 card-dark p-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          How to claim your earnings
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            {
              n: '1',
              label: 'Fees accumulate on-chain',
              desc: `Every $ZOOSTR trade sends 1% to the 0xSplits contract. ${COMMUNITY_SHARE * 100}% of that is your leaderboard pool.`,
            },
            {
              n: '2',
              label: 'Monday: split updates',
              desc: 'ZOL runs the weekly snapshot, Zaal reviews and calls updateSplit() — weights update to match the current leaderboard.',
            },
            {
              n: '3',
              label: 'Claim at app.splits.org',
              desc: 'Connect your wallet on Base, find the Zoostr split contract, and withdraw. No claiming deadline — funds wait.',
            },
          ].map(({ n, label, desc }) => (
            <div key={n} className="flex gap-3">
              <div className="text-2xl font-black text-gold-500/20 flex-shrink-0 w-6 text-center tabular-nums">
                {n}
              </div>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-3 border-t border-zao-border">
          <a
            href="https://app.splits.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            app.splits.org →
          </a>
          <span className="text-slate-600 text-sm">·</span>
          <span className="text-xs text-slate-600 self-center">
            Split contract address is published in each weekly receipt cast
          </span>
        </div>
      </div>
    </div>
  )
}
