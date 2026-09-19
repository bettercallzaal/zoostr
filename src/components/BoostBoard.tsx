'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { rankedContributors } from '@/lib/boostr'
import type { BoostrStats } from '@/lib/types'

const POLL_MS = 60_000

const fmt = (n: number) => n.toLocaleString('en-US')

function Avatar({ src, name, size }: { src: string; name: string; size: number }) {
  const [broken, setBroken] = useState(false)
  const letter = name.replace(/[^a-zA-Z0-9]/g, '')[0]?.toUpperCase() ?? '?'

  if (broken || !src) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full border border-zoostr-line bg-zoostr-line/60 font-display font-bold text-zoostr-dim"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {letter}
      </span>
    )
  }

  return (
    // Remote pfp hosts are unbounded (imagedelivery, cloudinary, ipfs gateways) - plain img by design
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      className="shrink-0 rounded-full border border-zoostr-line object-cover"
      style={{ width: size, height: size }}
    />
  )
}

function StatCell({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="flex flex-col gap-1 sm:border-l sm:border-zoostr-line sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-zoostr-dim">
        {live ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-zoostr-acid" />
            {label}
          </span>
        ) : (
          label
        )}
      </span>
      <span className="font-display text-2xl font-bold tabular-nums text-zoostr-bone sm:text-3xl">
        {value}
      </span>
    </div>
  )
}

export default function BoostBoard({ initial }: { initial: BoostrStats | null }) {
  const [stats, setStats] = useState<BoostrStats | null>(initial)
  const [error, setError] = useState(!initial)
  const [tick, setTick] = useState(0)
  const mounted = useRef(false)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/boostr', { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const next: BoostrStats = await res.json()
      setStats(next)
      setError(false)
      setTick((t) => t + 1)
    } catch {
      // keep showing the last good board; only show the offline note if we never had one
      setStats((prev) => {
        if (!prev) setError(true)
        return prev
      })
    }
  }, [])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      if (!initial) void refresh()
    }
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [initial, refresh])

  const rows = stats ? rankedContributors(stats) : []
  const leader = rows[0]
  const rest = rows.slice(1)
  const topPoints = leader?.zabalLikesCount ?? 1
  const tiedAtTop = leader ? rows.filter((r) => r.zabalLikesCount === leader.zabalLikesCount).length : 0

  // "=04" marks a shared rank, the way a scoreboard does it
  const tieCount = new Map<number, number>()
  for (const r of rows) tieCount.set(r.zabalLikesCount, (tieCount.get(r.zabalLikesCount) ?? 0) + 1)

  return (
    <div className="w-full">
      {/* Live counters */}
      <section
        key={`stats-${tick}`}
        className={`grid grid-cols-2 gap-x-6 gap-y-6 border-y border-zoostr-line px-1 py-6 sm:grid-cols-4 sm:gap-x-4 ${
          tick > 0 ? 'flash-acid' : ''
        }`}
      >
        <StatCell label="Active contributors" value={fmt(stats?.activeContributorsCount ?? 0)} live />
        <StatCell label="Boosts generated" value={fmt(stats?.totalLikesGenerated ?? 0)} />
        <StatCell label="Casts boosted" value={fmt(stats?.totalCastsLiked ?? 0)} />
        <StatCell label="All time" value={fmt(stats?.allTimeContributorsCount ?? 0)} />
      </section>

      {error && !stats && (
        <p className="mt-10 font-mono text-sm text-zoostr-dim">
          Boostr is not answering right now. This page retries every 60 seconds.
        </p>
      )}

      {/* Featured leader */}
      {leader && (
        <section className="relative mt-14 overflow-hidden border-b border-zoostr-line pb-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -right-3 select-none font-display text-[9rem] font-extrabold leading-none text-zoostr-line/70 sm:text-[13rem]"
          >
            01
          </span>
          <div className="relative flex flex-col gap-6">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-zoostr-acid">
              {tiedAtTop > 1 ? `Leading pack - ${tiedAtTop} tied at the top` : 'Leading the empire'}
            </span>
            <div className="flex items-center gap-5">
              <Avatar src={leader.pfp_url} name={leader.username} size={88} />
              <div className="min-w-0">
                <a
                  href={`https://farcaster.xyz/${leader.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`block break-all font-display font-extrabold leading-[0.95] tracking-tight text-zoostr-bone transition-colors hover:text-zoostr-acid ${
                    leader.username.length > 11 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
                  }`}
                >
                  @{leader.username}
                </a>
                <p className="mt-2 font-mono text-xs text-zoostr-dim">
                  {fmt(leader.followers_count)} followers · fid {leader.fid}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-extrabold leading-none tabular-nums text-zoostr-acid sm:text-7xl">
                {fmt(leader.zabalLikesCount)}
              </span>
              <span className="pb-2 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-zoostr-dim">
                boosts
              </span>
            </div>
          </div>
        </section>
      )}

      {/* The list */}
      {rest.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between font-mono text-[0.625rem] uppercase tracking-[0.22em] text-zoostr-dim">
            <span>The rest of the empire</span>
            <span>Boosts</span>
          </div>

          <ol>
            {rest.map((c, i) => {
              const width = Math.max(2, (c.zabalLikesCount / topPoints) * 100)
              return (
                <li
                  key={c.fid}
                  style={{ ['--i' as string]: i }}
                  className="row-in group relative border-b border-zoostr-line/70"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-zoostr-acid/[0.06] transition-[width] duration-700"
                    style={{ width: `${width}%` }}
                  />
                  <a
                    href={`https://farcaster.xyz/${c.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative grid grid-cols-[2.25rem_auto_1fr_auto] items-center gap-3 py-3 sm:gap-4"
                  >
                    <span className="font-mono text-xs tabular-nums text-zoostr-dim">
                      {(tieCount.get(c.zabalLikesCount) ?? 1) > 1 ? '=' : ''}
                      {String(c.rank).padStart(2, '0')}
                    </span>
                    <Avatar src={c.pfp_url} name={c.username} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-sm text-zoostr-bone transition-colors group-hover:text-zoostr-acid">
                        @{c.username}
                      </span>
                      <span className="block font-mono text-[0.625rem] text-zoostr-dim">
                        {fmt(c.followers_count)} followers
                      </span>
                    </span>
                    <span className="font-display text-lg font-bold tabular-nums text-zoostr-bone sm:text-xl">
                      {fmt(c.zabalLikesCount)}
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
