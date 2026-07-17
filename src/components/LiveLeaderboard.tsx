'use client'

import { useEffect, useState, useCallback } from 'react'
import type { BoostrStats } from '@/lib/types'
import { sortedContributors, totalPoints } from '@/lib/boostr'
import EmpireStats from './EmpireStats'
import Podium from './Podium'
import LeaderboardTable from './LeaderboardTable'

type Props = {
  initialData: BoostrStats
}

const REFRESH_MS = 60_000

export default function LiveLeaderboard({ initialData }: Props) {
  const [data, setData] = useState<BoostrStats>(initialData)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/boostr')
      if (res.ok) {
        const fresh = await res.json()
        setData(fresh)
        setLastUpdated(new Date())
      }
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  const sorted = sortedContributors(data)
  const total = totalPoints(data)
  const top3 = sorted.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Live badge + last updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Live</span>
        </div>
        <div className="flex items-center gap-3">
          {refreshing && (
            <svg className="animate-spin h-3 w-3 text-gold-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <span className="text-xs text-slate-500">
            Updated {lastUpdated.toLocaleTimeString()} · refreshes every 60s
          </span>
        </div>
      </div>

      {/* Empire stats */}
      <EmpireStats
        activeContributorsCount={data.activeContributorsCount}
        totalLikesGenerated={data.totalLikesGenerated}
        totalCastsLiked={data.totalCastsLiked}
      />

      {/* Podium */}
      <div className="card-dark p-6 sm:p-10">
        <Podium top3={top3} totalPoints={total} />
      </div>

      {/* Full table */}
      <div className="card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-zao-border">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Full Leaderboard · {sorted.length} boosters
          </h2>
        </div>
        <LeaderboardTable contributors={sorted} totalPoints={total} />
      </div>
    </div>
  )
}
