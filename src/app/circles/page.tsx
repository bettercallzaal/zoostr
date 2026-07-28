import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Culture Circles')}&sub=${encodeURIComponent('Composable backing — sparks that boost each other.')}`

export const metadata: Metadata = {
  title: 'Culture Circles — Zoostr',
  description:
    'Culture Circles: creators who back each other\'s sparks before any token exists. Composable, pre-token, creator-to-creator. The network effect Sparkz was built for.',
  openGraph: {
    title: 'Culture Circles — Zoostr',
    description: 'Back the work together. Sparks that boost each other — composable, pre-token.',
    url: `${BASE_URL}/circles`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Culture Circles — Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Culture Circles — Zoostr',
    description: 'Composable pre-token backing. Sparks that boost each other.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '⭕ Explore circles',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/circles`,
    'fc:frame:button:2': '⚡ Launch your spark',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/launch`,
  },
}

const ZOOSTR_CIRCLE = {
  name: 'ZABAL × Boostr',
  slug: 'zabal-boostr',
  stage: 'Emerging',
  stageColor: 'text-gold-400 border-gold-500/40 bg-gold-500/10',
  members: [
    { handle: 'zaal', role: 'Creator', note: 'ZABAL — the spark' },
    { handle: 'cashlessman.eth', role: 'Platform', note: 'Aziz — Boostr co-founder' },
    { handle: 'bettercallzaal', role: 'ZAO', note: 'ZAO backing + ZOL agent' },
  ],
  description:
    'The first Zoostr circle. ZABAL and Boostr co-built the empire — 30+ active contributors, 1,000s of likes — before $ZOOSTR had a price. Now every trade pays the whole circle back.',
  backingFlow: [
    { from: 'ZABAL', to: 'Boostr', label: 'platform reach' },
    { from: 'Boostr', to: 'ZABAL', label: 'community liquidity' },
    { from: 'ZAO', to: 'ZABAL × Boostr', label: 'locked stake + ZOL agent' },
  ],
  liveLink: '/leaderboard',
}

const EXAMPLE_CIRCLES = [
  {
    name: 'Collab Tracks',
    icon: '🎶',
    description:
      'Two musicians release a track together. Each backs the other\'s spark. Fans back both. Fee splits route to all contributors via 0xSplits — both artists are incentivized to share.',
    stage: 'Template',
    stageColor: 'text-slate-400 border-slate-600/40 bg-slate-700/20',
  },
  {
    name: 'f2dc — Farcaster-to-Devcon',
    icon: '✈️',
    description:
      'Group crowdfunding circle. Contributors back the trip collectively; each backer gets proportional fee weight. Proposals voted by token holders — a light Nouns DAO with liquid tokens.',
    stage: 'Template',
    stageColor: 'text-slate-400 border-slate-600/40 bg-slate-700/20',
  },
  {
    name: 'ZAO Collab Quarter',
    icon: '⬡',
    description:
      '1 of 50 ZAO-backed collabs this quarter. Vetted creators form a circle — each gets the ZAO badge, scarce supply, and cross-circle reach. Curation as visible prestige.',
    stage: 'Proposed',
    stageColor: 'text-zao-violet border-zao-violet/40 bg-zao-violet/10',
  },
]

const LIFECYCLE = [
  { stage: 'Proposed', color: 'bg-slate-600', label: 'Creators signal intent. No token, no commit.' },
  { stage: 'Emerging', color: 'bg-gold-500', label: 'Active mutual backing. Leaderboard live. Collectables on.' },
  { stage: 'Verified', color: 'bg-green-500', label: 'ZAO-vetted. Token is an option — opt-in, not required.' },
  { stage: 'Established', color: 'bg-blue-500', label: 'Token launched. Fee splits on-chain. Claims at splits.org.' },
  { stage: 'Federated', color: 'bg-purple-500', label: 'Circle backs other circles. Network effect compounds.' },
]

export default function CirclesPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors hidden sm:inline">Leaderboard</Link>
            <Link href="/discover" className="text-slate-400 hover:text-gold-400 transition-colors hidden sm:inline">Discover</Link>
            <Link href="/examples" className="text-slate-400 hover:text-gold-400 transition-colors hidden sm:inline">Templates</Link>
            <Link href="/launch" className="px-3 py-1.5 rounded-lg border border-zao-violet/50 text-zao-violet hover:bg-zao-violet/10 text-xs font-semibold transition-colors">
              ⚡ Launch your spark
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          Pre-token composable backing · Sparkz by ZAO
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-4">
          Culture <span className="text-gradient-gold">Circles</span>
        </h1>
        <p className="text-xl text-slate-300 font-semibold mb-3">
          Back the work together.
        </p>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          A circle = creators who back each other&rsquo;s sparks before any token exists. Composable,
          creator-to-creator, mutual. The collab song where both artists are incentivized to share.
          The crowdfund where every backer earns from every trade.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><span className="text-gold-400">✓</span> No token required to start</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-400">✓</span> Creator-to-creator backing</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-400">✓</span> 0xSplits routes fees to all members</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-400">✓</span> ZAO-vetted circles get the badge</span>
        </div>
      </section>

      {/* Live circle: Zoostr */}
      <section className="max-w-4xl mx-auto px-4 mb-14">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-black text-white">Live circle</h2>
          <span className="text-xs px-2 py-0.5 rounded-full border font-bold text-gold-400 border-gold-500/40 bg-gold-500/10">
            Emerging
          </span>
        </div>
        <div className="rounded-2xl border border-gold-500/30 bg-zao-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-1">{ZOOSTR_CIRCLE.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{ZOOSTR_CIRCLE.description}</p>

              {/* Members */}
              <div className="mb-5">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Circle members</div>
                <div className="space-y-2">
                  {ZOOSTR_CIRCLE.members.map((m) => (
                    <div key={m.handle} className="flex items-center gap-3 p-3 rounded-xl bg-zao-dark border border-zao-border/50">
                      <a
                        href={`https://warpcast.com/${m.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        @{m.handle}
                      </a>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{m.role}</span>
                      <span className="text-xs text-slate-600 ml-auto hidden sm:block">{m.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backing flows */}
              <div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Backing flows</div>
                <div className="space-y-2">
                  {ZOOSTR_CIRCLE.backingFlow.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="font-semibold text-white">{f.from}</span>
                      <span className="text-slate-600">→</span>
                      <span className="font-semibold text-white">{f.to}</span>
                      <span className="text-xs text-slate-600 ml-1">({f.label})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats CTA */}
            <div className="shrink-0 flex flex-col gap-3 sm:w-44">
              <Link
                href={ZOOSTR_CIRCLE.liveLink}
                className="btn-gold text-sm py-2 px-4 text-center"
              >
                Live leaderboard →
              </Link>
              <Link
                href="/receipt"
                className="text-center text-xs py-2 px-4 rounded-lg border border-zao-border text-slate-400 hover:border-slate-500 transition-colors"
              >
                Weekly receipt →
              </Link>
              <a
                href="https://boostr.itscashless.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs py-2 px-4 rounded-lg border border-zao-border text-slate-400 hover:border-slate-500 transition-colors"
              >
                Join on Boostr ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How circles work */}
      <section className="max-w-4xl mx-auto px-4 mb-14">
        <h2 className="text-lg font-black text-white mb-6">How a circle works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: '⭕',
              title: 'Two sparks meet',
              body: 'Creator A backs Creator B\'s spark. Creator B backs Creator A\'s. Before any token. No commitment needed — a cast is enough to signal intent.',
            },
            {
              icon: '💧',
              title: 'Fees flow to everyone',
              body: 'When either spark launches, the fee split runs through a shared 0xSplits contract. Every circle member earns from every trade — proportional to their contribution.',
            },
            {
              icon: '🌐',
              title: 'Circles back circles',
              body: 'At Stage 5 (Federated), a circle can boost other circles. The network effect compounds: backing one spark means reaching everyone connected to it.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-zao-card border border-zao-border rounded-xl p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* The music-native differentiator callout */}
        <div className="rounded-2xl border border-zao-violet/30 bg-zao-violet/5 p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl flex-shrink-0">🎵</div>
            <div>
              <h3 className="text-sm font-black text-zao-violet mb-1">The music-native edge</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nobody else does this. A collab song splits fees between both artists via 0xSplits
                — both are incentivized to share the track because both earn from every listen and
                trade. The group crowdfund splits by crowdfunders who make proposals, holders vote.
                Generative, not extractive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Circle lifecycle */}
      <section className="max-w-4xl mx-auto px-4 mb-14">
        <h2 className="text-lg font-black text-white mb-6">Circle lifecycle</h2>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-zao-border hidden sm:block" />
          <div className="space-y-3">
            {LIFECYCLE.map((s) => (
              <div key={s.stage} className="flex items-start gap-4 sm:pl-8 relative">
                <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full ${s.color} flex items-center justify-center shrink-0 hidden sm:flex`} />
                <div className="flex-1 bg-zao-card border border-zao-border rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black text-white">{s.stage}</span>
                    <div className={`hidden sm:block h-2 w-2 rounded-full ${s.color}`} />
                  </div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-4 text-center">
          Token = Stage 4 (Established). A circle can thrive at Stage 2 indefinitely — no token required.
        </p>
      </section>

      {/* Example circle templates */}
      <section className="max-w-4xl mx-auto px-4 mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white">Circle templates</h2>
          <Link href="/examples" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
            All templates →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAMPLE_CIRCLES.map((c) => (
            <div key={c.name} className="bg-zao-card border border-zao-border rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${c.stageColor}`}>
                  {c.stage}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{c.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Start a circle CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-zao-card to-zao-dark p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Start your circle.</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-7 leading-relaxed">
            A spark + one other creator is a circle. No token needed. Signal intent on Farcaster
            → configure your split → ZAO reviews → badge + launch when ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/launch" className="btn-gold py-3 px-6 text-sm font-bold">
              ⚡ Launch your spark →
            </Link>
            <Link href="/split-wizard" className="py-3 px-6 text-sm font-bold rounded-xl border border-zao-border text-slate-300 hover:border-slate-500 transition-colors">
              Configure your split →
            </Link>
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent('i want to start a culture circle on zoostr ⭕\n\n@zaal @bettercallzaal — zoostr.xyz/circles')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 text-sm font-bold rounded-xl border border-zao-violet/40 text-zao-violet hover:bg-zao-violet/10 transition-colors"
            >
              Signal on Farcaster →
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            Not sure what split to use?{' '}
            <Link href="/advisor" className="text-slate-500 hover:text-slate-400 underline">
              Try the AI advisor →
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Culture Circles = Brandon&rsquo;s &ldquo;Culture Circles&rdquo; concept. Pre-token mutual backing.
            Generative, not extractive.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/leaderboard" className="text-slate-500 hover:text-slate-400 transition-colors">Leaderboard →</Link>
            <Link href="/examples" className="text-slate-500 hover:text-slate-400 transition-colors">Templates →</Link>
            <Link href="/discover" className="text-slate-500 hover:text-slate-400 transition-colors">Discover →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
