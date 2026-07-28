'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AudiusUser {
  id: string
  handle: string
  name: string
  follower_count: number
  track_count: number
  profile_picture?: { '150x150'?: string; '480x480'?: string }
  bio?: string
}

interface AudiusTrack {
  id: string
  title: string
  play_count: number
  favorite_count: number
  repost_count: number
  duration: number
  genre: string
  permalink: string
  artwork?: { '150x150'?: string }
}

interface SplitRow {
  label: string
  pct: number
}

const DEFAULT_SPLIT: SplitRow[] = [
  { label: 'Artist', pct: 90 },
  { label: 'Producer', pct: 5 },
  { label: 'Sparkz treasury', pct: 5 },
]

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export default function AudiusIntegration() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<AudiusUser | null>(null)
  const [tracks, setTracks] = useState<AudiusTrack[]>([])
  const [selectedTrack, setSelectedTrack] = useState<AudiusTrack | null>(null)
  const [split, setSplit] = useState<SplitRow[]>(DEFAULT_SPLIT)

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    if (!handle.trim()) return
    setLoading(true)
    setError(null)
    setUser(null)
    setTracks([])
    setSelectedTrack(null)
    setSplit(DEFAULT_SPLIT)
    try {
      const res = await fetch(`/api/audius?handle=${encodeURIComponent(handle.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Lookup failed')
      setUser(data.user)
      setTracks(data.tracks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  function updatePct(idx: number, val: number) {
    setSplit((prev) => prev.map((row, i) => (i === idx ? { ...row, pct: val } : row)))
  }

  const total = split.reduce((s, r) => s + r.pct, 0)
  const isBalanced = total === 100

  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/split-wizard" className="text-xs text-slate-400 hover:text-gold-400 transition-colors hidden sm:inline">
              Split wizard →
            </Link>
            <Link href="/examples" className="btn-gold text-xs py-1.5 px-3">
              Templates
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-purple-400">🎵</span>
          Audius × Sparkz integration
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Plug your Audius catalog
          <br />
          <span className="text-gradient-gold">into your spark</span>
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed mb-4">
          Pull your tracks from Audius, set a split per track, and wire streaming income
          directly to your 0xSplits contract — collaborators, producers, and fans all claim
          their share at splits.org, on-chain.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <span>✓ No token required</span>
          <span>✓ Per-track split configuration</span>
          <span>✓ Exports 0xSplits JSON</span>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-2xl mx-auto px-4 pb-10">
        <form onSubmit={lookup} className="flex gap-2">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Audius handle (e.g. deadmau5)"
            className="flex-1 bg-zao-card border border-zao-border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-gold-500/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-gold-500 text-black font-bold text-sm hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {loading ? '…' : 'Look up'}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
        )}
      </section>

      {/* Results */}
      {user && (
        <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
          {/* User card */}
          <div className="bg-zao-card border border-zao-border rounded-2xl p-6 flex items-start gap-5">
            {user.profile_picture?.['480x480'] && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.profile_picture['480x480']}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-black text-white">{user.name}</h2>
                <span className="text-slate-500 text-sm">@{user.handle}</span>
              </div>
              {user.bio && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{user.bio}</p>
              )}
              <div className="flex gap-6 text-sm">
                <span className="text-slate-400">
                  <span className="text-white font-bold">{fmtCount(user.follower_count)}</span> followers
                </span>
                <span className="text-slate-400">
                  <span className="text-white font-bold">{user.track_count}</span> tracks
                </span>
              </div>
            </div>
            <a
              href={`https://audius.co/${user.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs font-semibold transition-colors"
            >
              Audius ↗
            </a>
          </div>

          {/* Tracks */}
          {tracks.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Catalog — select a track to configure its split
              </div>
              <div className="space-y-2">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track === selectedTrack ? null : track)}
                    className={`w-full text-left bg-zao-card border rounded-xl px-5 py-3 flex items-center gap-4 transition-colors ${
                      selectedTrack?.id === track.id
                        ? 'border-gold-500/60 bg-gold-500/5'
                        : 'border-zao-border hover:border-zao-border/80'
                    }`}
                  >
                    {track.artwork?.['150x150'] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={track.artwork['150x150']}
                        alt={track.title}
                        width={40}
                        height={40}
                        className="rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{track.title}</div>
                      <div className="text-xs text-slate-500">{track.genre} · {fmtDuration(track.duration)}</div>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500 flex-shrink-0 hidden sm:flex">
                      <span>▶ {fmtCount(track.play_count)}</span>
                      <span>♥ {fmtCount(track.favorite_count)}</span>
                    </div>
                    {selectedTrack?.id === track.id && (
                      <span className="text-gold-400 text-xs font-bold flex-shrink-0">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Split configurator */}
          {selectedTrack && (
            <div className="bg-zao-card border border-gold-500/30 rounded-2xl p-6 space-y-5">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Split for: {selectedTrack.title}
                </div>
                <p className="text-xs text-slate-600">
                  Adjust the percentages below. When you export, this becomes a 0xSplits JSON
                  you can paste into app.splits.org to deploy on-chain.
                </p>
              </div>

              <div className="space-y-3">
                {split.map((row, i) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <span className="text-sm text-slate-300 w-36 flex-shrink-0 truncate">{row.label}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={row.pct}
                      onChange={(e) => updatePct(i, Number(e.target.value))}
                      className="flex-1 accent-yellow-500"
                    />
                    <span className="text-sm font-bold text-gold-400 w-10 text-right tabular-nums">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>

              <div className={`text-xs font-semibold ${isBalanced ? 'text-green-400' : 'text-red-400'}`}>
                Total: {total}% {isBalanced ? '✓ balanced' : `— ${total > 100 ? 'over' : 'under'} by ${Math.abs(100 - total)}%`}
              </div>

              {/* Export */}
              {isBalanced && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    0xSplits JSON — paste into app.splits.org
                  </div>
                  <pre className="bg-zao-dark rounded-xl p-4 text-xs text-slate-300 font-mono overflow-x-auto">
                    {JSON.stringify(
                      {
                        name: `Sparkz × Audius — ${selectedTrack.title}`,
                        recipients: split.map((r) => ({
                          address: '0x0000000000000000000000000000000000000000',
                          percentAllocation: r.pct,
                          note: r.label,
                        })),
                        distributorFeePercent: 0,
                        note: `Track: ${selectedTrack.title} · Artist: @${user.handle} on Audius`,
                      },
                      null,
                      2,
                    )}
                  </pre>
                  <p className="text-xs text-slate-600 mt-2">
                    Replace each <code className="bg-slate-800 px-1 rounded">0x000...</code> with
                    the real wallet address for that recipient.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* How it works — shown before any search or after */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-black text-white mb-6 text-center">How Audius × Sparkz works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              icon: '🎵',
              title: 'Connect your catalog',
              body: 'Enter your Audius handle. Sparkz pulls your tracks — no auth, no wallet, no token. Your music is already there.',
            },
            {
              step: '2',
              icon: '⚡',
              title: 'Set a split per track',
              body: 'Artist, producer, featured collaborator — each gets a percentage. The split attests to IPFS before any money moves.',
            },
            {
              step: '3',
              icon: '🏦',
              title: 'Deploy on-chain',
              body: 'Export the 0xSplits JSON, paste into app.splits.org, deploy on Base. Streaming income routes to the splits contract — recipients claim their share at splits.org, no invoicing.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zao-card border border-zao-border rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-xs font-black text-gold-400">
                  {item.step}
                </div>
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Viniapp integration note */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="text-3xl flex-shrink-0">🤝</div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
              Phase 2 — Viniapp miniapp integration
            </div>
            <h3 className="text-lg font-black text-white mb-2">
              Audius streaming dashboard inside Viniapp
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Phase 1 (now): connect your catalog and export split JSON. Phase 2: Sparkz
              as a Viniapp miniapp — your Audius streaming stats and split earnings live
              side by side, inside the Viniapp ecosystem. Credits-powered, no separate
              wallet. Chris Dolinski × Sparkz × Audius.
            </p>
          </div>
        </div>
      </section>

      {/* Why Audius */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-black text-white mb-4">
            Why Audius + 0xSplits is different
          </h3>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              Audius gives creators a decentralized home for their catalog — no label required,
              streaming income direct to their wallet. But Audius is a solo wallet model.
              It doesn&apos;t handle collaborations: if a track has two artists, one producer, and a
              featured vocalist, they&apos;re negotiating PayPal or Venmo after the fact.
            </p>
            <p>
              Sparkz wires <span className="text-gold-400 font-semibold">0xSplits</span> into the
              gap: a contract that receives streaming income and routes it to every contributor
              proportionally, on-chain. Recipients claim at splits.org — the split is set before the track drops.
              Both artists have reason to promote — every stream earns them both.
            </p>
            <p>
              This is the{' '}
              <span className="text-gold-400 font-semibold">music-native differentiator</span>:{' '}
              collab songs split fees between artists (both incentivized to share). A group album
              splits by contribution weight. A fan-backed EP gives early backers a slice of
              streaming income — not a token, just a split.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-zao-card border border-gold-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to configure your split?</h2>
          <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
            Use the split wizard to set up any configuration from scratch, or pick a
            template that matches your use case.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/split-wizard" className="btn-gold py-3 px-8">
              Open split wizard →
            </Link>
            <Link
              href="/examples"
              className="py-3 px-8 rounded-xl border border-zao-border text-slate-300 hover:border-gold-500/50 hover:text-gold-400 transition-colors text-sm font-semibold"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Audius data via the public Audius API. No login required. Splits deployed via app.splits.org on Base.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/" className="text-slate-500 hover:text-slate-400 transition-colors">Home →</Link>
            <Link href="/examples" className="text-slate-500 hover:text-slate-400 transition-colors">Templates →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
