'use client'

import { useState } from 'react'
import type { Contributor } from '@/lib/types'

type Props = {
  contributors: Contributor[]
  totalPoints: number
  minPoints?: number
}

export default function EarningsCalc({ contributors, totalPoints, minPoints = 0 }: Props) {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const visibleRows = query
    ? contributors.filter((r) => r.username.toLowerCase().includes(query))
    : contributors

  return (
    <div>
      {/* Status */}
      <div className="card-dark p-5 mb-6">
        <div className="text-sm font-semibold text-white mb-0.5">Points and rank</div>
        <div className="text-xs text-slate-500">
          No fees are live yet. The leaderboard shows who is backing Zoostr.
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
            ? `${visibleRows.length} of ${contributors.length}`
            : `${contributors.filter((r) => r.zabalEnabled && r.zabalLikesCount >= minPoints).length} eligible · ${contributors.length} total`}
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
                <th className="text-right py-3 px-4">Share of points</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((c) => {
                const globalRank = contributors.indexOf(c)
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
                      {eligible ? (
                        `${share.toFixed(2)}%`
                      ) : !c.zabalEnabled ? (
                        'enable Boostr'
                      ) : (
                        `${minPoints - c.zabalLikesCount} pts to unlock`
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {contributors.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">No contributors yet.</div>
        )}
        {contributors.length > 0 && visibleRows.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No booster found for &ldquo;{search}&rdquo;. Check your Farcaster username.
          </div>
        )}
      </div>
    </div>
  )
}
