import { fetchBoostrStats } from '@/lib/boostr'
import LiveLeaderboard from '@/components/LiveLeaderboard'
import type { BoostrStats } from '@/lib/types'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? null

async function getStats(): Promise<BoostrStats | null> {
  try {
    return await fetchBoostrStats()
  } catch {
    return null
  }
}

export default async function Home() {
  const stats = await getStats()

  const FALLBACK: BoostrStats = {
    activeContributorsCount: 0,
    allTimeContributorsCount: 0,
    totalLikesGenerated: 0,
    totalCastsLiked: 0,
    contributors: [],
  }

  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </span>
          <div className="flex items-center gap-4 text-sm">
            <a href="/leaderboard" className="text-slate-400 hover:text-white transition-colors hidden sm:inline">Leaderboard</a>
            <a href="/receipt" className="text-slate-400 hover:text-gold-400 transition-colors hidden sm:inline">Weekly receipt</a>
            <a href="#tokenomics" className="text-slate-400 hover:text-white transition-colors hidden sm:inline">How it works</a>
            <a
              href="/launch"
              className="px-3 py-1.5 rounded-lg border border-zao-violet/50 text-zao-violet hover:bg-zao-violet/10 text-xs font-semibold transition-colors"
            >
              ⚡ Launch your token
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          A Sparkz Launch · powered by ZAO
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4">
          <span className="text-gradient-gold">ZOO</span>
          <span className="text-white">STR</span>
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-slate-300 mb-3">
          ZABAL × Boostr
        </p>

        <p className="text-2xl sm:text-3xl font-black text-gradient-gold mb-6">
          The empire pays back.
        </p>

        <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          The boost engine was already running before any token existed. You showed up for ZABAL.
          You boosted. You built the empire. Now $ZOOSTR is how it pays back — 50% of every
          trading fee, straight to the leaderboard by your points, every week, forever.
          No claiming. It just lands.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://boostr.itscashless.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold transition-colors"
          >
            Boost to earn ↗
          </a>
          <a
            href="#leaderboard"
            className="px-6 py-3 rounded-lg border border-zao-border hover:border-gold-500 text-white font-medium transition-colors"
          >
            See the leaderboard ↓
          </a>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="max-w-5xl mx-auto px-4 pb-20">
        <LiveLeaderboard initialData={stats ?? FALLBACK} />
      </section>

      {/* Token Launch Info */}
      <section id="token" className="max-w-5xl mx-auto px-4 pb-20">
        <div className="card-dark p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">The Token</h2>
          <p className="text-slate-400 mb-8">The boost engine runs without it. $ZOOSTR is how the empire pays back.</p>

          {/* Contract address banner — hidden until NEXT_PUBLIC_TOKEN_ADDRESS is set */}
          {TOKEN_ADDRESS ? (
            <div className="mb-8 p-4 rounded-xl bg-green-950/40 border border-green-700/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-green-400 uppercase tracking-widest mb-1 font-semibold">Token Live on Base</div>
                <code className="text-sm text-white font-mono break-all">{TOKEN_ADDRESS}</code>
              </div>
              <a
                href={`https://basescan.org/token/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-400 hover:text-green-300 font-medium whitespace-nowrap"
              >
                Verify on Basescan ↗
              </a>
            </div>
          ) : (
            <div className="mb-8 p-4 rounded-xl bg-zao-dark border border-zao-border flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse flex-shrink-0" />
              <span className="text-sm text-slate-400">Contract deploying soon — check back after launch</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow label="Token Name" value="Zoostr" />
              <InfoRow label="Ticker" value="$ZOOSTR" />
              <InfoRow label="Chain" value="Base" />
              <InfoRow label="Launcher" value="Clanker (v4 · 1% fee tier)" />
              <InfoRow label="Fee Recipient" value="0xSplits contract (on-chain, adjustable)" />
            </div>
            <div className="space-y-4">
              <InfoRow label="Creator" value="Zaal · @zaal / @bettercallzaal" link="https://warpcast.com/zaal" />
              <InfoRow label="Co-builder" value="Aziz · @cashlessman.eth" link="https://warpcast.com/cashlessman.eth" />
              <InfoRow label="Platform" value="Boostr · boostr.itscashless.com" link="https://boostr.itscashless.com" />
              <InfoRow
                label="Status"
                value={TOKEN_ADDRESS ? 'Live on Base ✓' : 'Launching soon — Zaal deploys'}
              />
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-zao-dark border border-gold-500/20">
            <p className="text-sm text-slate-400 leading-relaxed">
              <span className="text-gold-400 font-semibold">Important:</span> This site is for launch information only.
              Token perks reflect what community members enjoy today — not guaranteed future entitlements.
              Nothing here is financial advice.
            </p>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="max-w-5xl mx-auto px-4 pb-24">
        <div className="card-dark p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-slate-400 mb-10">
            Every trade generates a 1% fee. Half of it belongs to the people who built the empire.
            The other half keeps the lights on and the treasury growing.
          </p>

          {/* Fee split visual */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Trading Fee Split (1% per trade)
            </h3>
            <div className="space-y-3">
              <FeeBar label="Leaderboard Boosters" pct={50} color="from-gold-500 to-gold-400" note="distributed by points" />
              <FeeBar label="Creator & Operations" pct={25} color="from-violet-600 to-violet-500" note="Zaal · ZABAL" />
              <FeeBar label="Treasury" pct={25} color="from-slate-600 to-slate-500" note="future liquidity / community vote" />
            </div>
          </div>

          {/* How points → fees */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
              How Leaderboard Points → Fee Share
            </h3>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Your share equals your{' '}
                <span className="text-gold-400 font-semibold">Boost points</span> divided by the
                total points across all active boosters. 1,000 points out of 10,000 total = exactly
                10% of the leaderboard pool — mechanical, transparent, on-chain.
              </p>
              <p>
                Fees flow through a{' '}
                <span className="text-zao-violet font-semibold">0xSplits contract</span> whose
                recipient weights update weekly from the live leaderboard. The split is publicly
                readable and adjustable — unlike Clanker&apos;s fee settings, which freeze at
                deploy. Keeping the split live and on-chain is Sparkz&apos;s core architecture.
                The same pattern works for any creator shape: a collab splits fees between both
                artists (both have reason to share), a group crowdfund splits by contribution
                weight with holder votes. Multi-recipient, live, adjustable on-chain.
              </p>
            </div>
          </div>

          {/* ZAO stake */}
          <div className="p-5 rounded-xl border border-zao-border bg-zao-dark">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              ZAO&apos;s Stake
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              ZAO takes a <span className="text-zao-violet font-semibold">locked token stake</span> — not
              a fee slice. ZAO backs the creator by holding the token long-term, aligning interests instead
              of extracting rent. The empire wins together or not at all. Lock size and duration set at launch.
            </p>
          </div>
        </div>
      </section>

      {/* Collectables teaser */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-5">
              ✦ Earned, never purchased
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Boosters earn collectables.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Every weekly fee distribution mints an on-chain receipt for every contributor who
              earned a share. Not a badge you bought. A permanent record: week, your points, your
              percentage, your payout. ERC-1155. Non-transferable. On-chain SVG.
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Stack receipts over time. 52 weeks of showing up = 52 collectables, a timeline of
              contribution — not a balance sheet.
            </p>
            <a
              href="https://sparkz.xyz/collectables"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gold-400 hover:text-gold-300 font-semibold transition-colors"
            >
              How collectables work → sparkz.xyz ↗
            </a>
          </div>
          <div className="flex justify-center sm:justify-end">
            <ZoostrCollectableMock />
          </div>
        </div>
      </section>

      {/* Back the empire CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="card-dark glow-purple p-10 sm:p-14 text-center">
          <p className="text-3xl sm:text-4xl font-black text-white mb-3">Back the empire.</p>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Boost ZABAL on Boostr. Earn points. Collect your share of every trade — forever.
            The community that showed up first gets a real financial stake in what they helped build.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://boostr.itscashless.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-black text-lg transition-colors"
            >
              Start boosting ↗
            </a>
            <a
              href="/launch"
              className="px-8 py-4 rounded-xl border border-zao-violet/50 text-zao-violet hover:bg-zao-violet/10 font-bold text-lg transition-colors"
            >
              ⚡ Creator? Launch your token
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zao-border bg-zao-card">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-black text-lg mb-2">
                <span className="text-gradient-gold">ZOO</span>
                <span className="text-white">STR</span>
              </div>
              <p className="text-sm text-slate-500">
                A Sparkz launch · co-built with Boostr · powered by ZAO
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Site</h4>
              <div className="space-y-2">
                <SocialLink href="/leaderboard" label="Leaderboard" internal />
                <SocialLink href="/receipt" label="Weekly receipt" internal />
                <SocialLink href="/launch" label="Creator launch" internal />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Creator</h4>
              <div className="space-y-2">
                <SocialLink href="https://warpcast.com/zaal" label="@zaal on Farcaster" />
                <SocialLink href="https://warpcast.com/bettercallzaal" label="@bettercallzaal" />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Boostr</h4>
              <div className="space-y-2">
                <SocialLink href="https://boostr.itscashless.com" label="boostr.itscashless.com" />
                <SocialLink href="https://warpcast.com/cashlessman.eth" label="@cashlessman.eth on Farcaster" />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Not financial advice. Perks reflect what holders enjoy today — not guaranteed entitlements. Do your own research.
          </p>
        </div>
      </footer>
    </main>
  )
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-zao-border/50 pb-3">
      <span className="text-slate-500 flex-shrink-0">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium text-right hover:text-gold-400 transition-colors"
        >
          {value} ↗
        </a>
      ) : (
        <span className="text-white font-medium text-right">{value}</span>
      )}
    </div>
  )
}

function FeeBar({ label, pct, color, note }: { label: string; pct: number; color: string; note: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white font-medium">{label}</span>
        <span className="text-slate-400 text-xs">{note}</span>
      </div>
      <div className="h-8 rounded-lg bg-zao-dark overflow-hidden flex items-center">
        <div
          className={`h-full rounded-lg bg-gradient-to-r ${color} flex items-center justify-end pr-3`}
          style={{ width: `${pct}%` }}
        >
          <span className="text-xs font-bold text-black/70">{pct}%</span>
        </div>
      </div>
    </div>
  )
}

function SocialLink({ href, label, internal }: { href: string; label: string; internal?: boolean }) {
  if (internal) {
    return (
      <a href={href} className="text-sm text-slate-400 hover:text-gold-400 transition-colors block">
        {label}
      </a>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-slate-400 hover:text-gold-400 transition-colors block"
    >
      {label} ↗
    </a>
  )
}

function ZoostrCollectableMock() {
  return (
    <div
      style={{
        width: 240,
        background: '#0a0a14',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 12,
        padding: 18,
        fontFamily: 'monospace',
        boxShadow: '0 0 40px rgba(245,158,11,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Sparkz Collectable
          </div>
          <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 900, marginTop: 2, letterSpacing: -0.5 }}>
            ZOOSTR
          </div>
        </div>
        <div style={{ color: '#7c3aed', fontSize: 20 }}>⬡</div>
      </div>
      <div style={{ color: '#64748b', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
        Week 01 · 2026
      </div>
      <div style={{ borderTop: '1px solid rgba(245,158,11,0.15)', marginBottom: 10 }} />
      <div style={{ marginBottom: 8 }}>
        <div style={{ color: '#475569', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>Contributor</div>
        <div style={{ color: '#ffffff', fontSize: 12, marginTop: 2 }}>@username</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ color: '#475569', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>Points</div>
          <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, marginTop: 2 }}>342</div>
        </div>
        <div>
          <div style={{ color: '#475569', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>Share</div>
          <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, marginTop: 2 }}>8.4%</div>
        </div>
        <div>
          <div style={{ color: '#475569', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>Earned</div>
          <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, marginTop: 2 }}>0.0004Ξ</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(100,116,139,0.2)', marginBottom: 8 }} />
      <div style={{ color: '#1e293b', fontSize: 8, letterSpacing: 0.5, lineHeight: 1.5 }}>
        ERC-1155 · NON-TRANSFERABLE<br />
        BASE · 0xSPLITS · EARNED NEVER PURCHASED
      </div>
    </div>
  )
}
