import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Spark Examples')}&sub=${encodeURIComponent('Tokenless templates — back the work, not a coin')}`

export const metadata: Metadata = {
  title: 'Spark Examples — Zoostr',
  description:
    'Concrete tokenless spark templates for artists, collabs, and communities. Start with a split, add a coin later (or never).',
  openGraph: {
    title: 'Spark Examples — Zoostr',
    description: 'Back the work, not a coin. Spark templates that work without a token.',
    url: `${BASE_URL}/examples`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Spark Examples' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spark Examples — Zoostr',
    description: 'Back the work, not a coin. Tokenless spark templates.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '💡 Explore spark templates',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/examples`,
    'fc:frame:button:2': '⚡ Back the empire',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/back`,
  },
}

type SplitEntry = { label: string; pct: number; note?: string }

type Example = {
  id: string
  category: 'solo' | 'collab' | 'crowd' | 'community' | 'zao'
  emoji: string
  title: string
  tagline: string
  useCase: string
  split: SplitEntry[]
  highlight: string
  why: string
  wizardSeed?: string
}

const EXAMPLES: Example[] = [
  {
    id: 'solo-ep',
    category: 'solo',
    emoji: '🎵',
    title: 'Solo artist EP',
    tagline: 'You made it. You keep most of it.',
    useCase: 'An artist drops a 5-track EP and wants fans to back it — no label, no co-writers.',
    split: [
      { label: 'Artist', pct: 90, note: 'flows into your 0xSplits wallet' },
      { label: 'Producer', pct: 5, note: 'beat credits, paid on-chain' },
      { label: 'Sparkz treasury', pct: 5, note: 'compute + platform upkeep' },
    ],
    highlight: '90% to you, on-chain from day 1',
    why:
      'Producer gets credited on-chain. No chasing invoices. They claim their share at splits.org. The treasury 5% funds the AI advisor that keeps the split tuned.',
    wizardSeed: 'solo-ep',
  },
  {
    id: 'collab-single',
    category: 'collab',
    emoji: '🤝',
    title: 'Collab single',
    tagline: 'Two artists. One split. Both incentivized to share.',
    useCase:
      'Two Farcaster artists drop a track together. Both are motivated to promote — every share earns both of them.',
    split: [
      { label: 'Artist A', pct: 47 },
      { label: 'Artist B', pct: 47 },
      { label: 'Sparkz treasury', pct: 6 },
    ],
    highlight: "Both artists earn every time it's streamed or shared",
    why:
      "The 0xSplits contract is immutable — neither artist can unilaterally change the other's cut. Trust is built into the code.",
    wizardSeed: 'collab-single',
  },
  {
    id: 'band-album',
    category: 'community',
    emoji: '🎸',
    title: 'Band album',
    tagline: 'Five members. Equal split. No disputes.',
    useCase:
      'A 5-piece band records a full album. Each member contributes equally and gets equal earnings.',
    split: [
      { label: 'Member 1', pct: 18 },
      { label: 'Member 2', pct: 18 },
      { label: 'Member 3', pct: 18 },
      { label: 'Member 4', pct: 18 },
      { label: 'Member 5', pct: 18 },
      { label: 'Sparkz treasury', pct: 10 },
    ],
    highlight: '~70% of music revenue disputes eliminated by locking the split pre-launch',
    why:
      "The split-sheet is attested to IPFS before any money moves. When it works out, everyone celebrates. When it doesn't, the contract holds.",
    wizardSeed: 'band-album',
  },
  {
    id: 'group-crowdfund',
    category: 'crowd',
    emoji: '🌐',
    title: 'Group crowdfund',
    tagline: 'f2dc-style: Farcaster community funds a real-world goal.',
    useCase:
      'A Farcaster community pools to fund a trip (e.g. Devcon). Backers get a slice of any future fee income proportional to their contribution.',
    split: [
      { label: 'Top backers pool', pct: 50, note: 'split by points / contribution size' },
      { label: 'Community treasury', pct: 30, note: 'funds the next community project' },
      { label: 'Organizer', pct: 15 },
      { label: 'Sparkz treasury', pct: 5 },
    ],
    highlight: 'Light Nouns DAO — proposals + holder votes, no governance theater',
    why:
      "Backers make proposals. Holders vote. The treasury funds the next proposal. Repeat. It's community ownership without the legal overhead.",
    wizardSeed: 'group-crowdfund',
  },
  {
    id: 'tour-event',
    category: 'community',
    emoji: '🎤',
    title: 'Tour / event',
    tagline: 'Co-headliners, venue, organizer — all paid on-chain.',
    useCase:
      'Two artists co-headline a 3-city tour. The venue gets a cut. The booking org gets a cut. All splits are transparent.',
    split: [
      { label: 'Headliner A', pct: 35 },
      { label: 'Headliner B', pct: 35 },
      { label: 'Venue', pct: 20, note: 'optional — can be off-chain' },
      { label: 'Booking org', pct: 10 },
    ],
    highlight: 'Promoters, venues, and artists on the same contract — no surprises',
    why:
      'Every city, every show, the split is the same. No renegotiating per venue. Transparent to the community.',
    wizardSeed: 'tour-event',
  },
  {
    id: 'podcast-collab',
    category: 'collab',
    emoji: '🎙',
    title: 'Podcast collab',
    tagline: 'Host + recurring guests. Splits by episode weight.',
    useCase:
      'A host runs a weekly show with rotating guests. Guests get a small cut of the episode they appeared on.',
    split: [
      { label: 'Host', pct: 70, note: 'consistent across all episodes' },
      { label: 'Episode guest', pct: 20, note: 'per-episode split, updated weekly' },
      { label: 'Editor', pct: 5 },
      { label: 'Sparkz treasury', pct: 5 },
    ],
    highlight: 'Guest splits update weekly — no manual invoicing',
    why:
      'Each episode has its own receipt. Guest earns from that episode. Host earns from all of them. Both are incentivized to promote.',
    wizardSeed: 'podcast-collab',
  },
  {
    id: 'fan-backed',
    category: 'crowd',
    emoji: '❤️',
    title: 'Fan-backed project',
    tagline: 'Fans back the album. Fans earn from its success.',
    useCase:
      'An artist gives a slice of future fee income to early backers. No token required — just back on Boostr, earn proportionally.',
    split: [
      { label: 'Artist', pct: 70 },
      { label: 'Fan backer pool', pct: 20, note: 'split by leaderboard points' },
      { label: 'Sparkz treasury', pct: 10 },
    ],
    highlight: "Back the album. Earn from its success. That's it.",
    why:
      '"Back the album, not a coin." The fan pool is a 0xSplits contract. When trading fees hit, backers claim proportionally — no token required.',
    wizardSeed: 'fan-backed',
  },
  {
    id: 'zao-backed',
    category: 'zao',
    emoji: '⬡',
    title: 'ZAO-backed launch',
    tagline: 'ZAO-curated. ZAO-staked. Not permissionless.',
    useCase:
      'A ZAO-vetted creator launches with a locked ZAO stake. The badge signals curation — scarcity as visible prestige.',
    split: [
      { label: 'Creator', pct: 88, note: 'via 0xSplits distribution wallet' },
      { label: 'ZAO locked stake', pct: 5, note: '12-month lock, 3-month cliff' },
      { label: 'Community treasury', pct: 4 },
      { label: 'Sparkz compute', pct: 3 },
    ],
    highlight: '1 of 50 ZAO-backed launches this quarter — badge + scarce allocation',
    why:
      "ZAO doesn't take a fee slice. ZAO takes a locked token stake. Aligned, not extractive. The lock is announced publicly.",
    wizardSeed: 'zao-backed',
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All templates' },
  { key: 'solo', label: 'Solo artist' },
  { key: 'collab', label: 'Collab' },
  { key: 'crowd', label: 'Crowdfund' },
  { key: 'community', label: 'Community' },
  { key: 'zao', label: 'ZAO-backed' },
]

const CATEGORY_COLORS: Record<string, string> = {
  solo: 'bg-gold-500/10 border-gold-500/30 text-gold-400',
  collab: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  crowd: 'bg-green-500/10 border-green-500/30 text-green-400',
  community: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  zao: 'bg-zao-violet/10 border-zao-violet/30 text-zao-violet',
}

const CATEGORY_LABELS: Record<string, string> = {
  solo: 'Solo',
  collab: 'Collab',
  crowd: 'Crowdfund',
  community: 'Community',
  zao: 'ZAO-backed',
}

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/advisor" className="text-slate-400 hover:text-gold-400 transition-colors hidden sm:inline text-xs">
              AI advisor →
            </Link>
            <Link href="/split-wizard" className="btn-gold text-xs py-1.5 px-3">
              Split wizard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          No token required to start
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Spark templates
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
          Real use cases. Real splits. Start any of these today — no token, no wallet needed.
          Add a coin <span className="text-gold-400">later</span>, or never.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          <span>✓ Splits locked on-chain before launch</span>
          <span>✓ ~70% of music revenue disputes eliminated</span>
          <span>✓ Token optional — add it at Stage 3 (Verified)</span>
        </div>
      </section>

      {/* Category pills */}
      <section className="max-w-5xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.key}
              className="px-3 py-1 rounded-full text-xs border border-zao-border text-slate-400 bg-zao-card"
            >
              {cat.label}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-3">
          {EXAMPLES.length} templates below — use any as a starting point in the split wizard
        </p>
      </section>

      {/* Examples grid */}
      <section className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.id}
            className="bg-zao-card border border-zao-border rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Card header */}
            <div className="p-6 pb-4 flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-black text-white text-lg">{ex.title}</h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-semibold ${CATEGORY_COLORS[ex.category]}`}
                  >
                    {CATEGORY_LABELS[ex.category]}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{ex.tagline}</p>
              </div>
            </div>

            {/* Use case */}
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-500 leading-relaxed">{ex.useCase}</p>
            </div>

            {/* Split breakdown */}
            <div className="px-6 pb-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Default split
              </div>
              <div className="space-y-2">
                {ex.split.map((entry) => (
                  <div key={entry.label} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-slate-300 font-medium">{entry.label}</span>
                        <span className="text-xs font-bold text-gold-400 tabular-nums">
                          {entry.pct}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-zao-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                          style={{ width: `${entry.pct}%` }}
                        />
                      </div>
                      {entry.note && (
                        <p className="text-xs text-slate-600 mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight */}
            <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-gold-500/5 border border-gold-500/20">
              <p className="text-xs text-gold-400 font-semibold">{ex.highlight}</p>
            </div>

            {/* Why */}
            <div className="px-6 pb-6 flex-1">
              <p className="text-xs text-slate-500 leading-relaxed">{ex.why}</p>
            </div>

            {/* CTAs */}
            <div className="px-6 pb-6 flex gap-3">
              <Link
                href={`/split-wizard?template=${ex.wizardSeed}`}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors"
              >
                Use this template →
              </Link>
              <Link
                href="/advisor"
                className="py-2.5 px-4 rounded-xl text-sm font-bold border border-zao-border text-slate-400 hover:border-zao-violet/50 hover:text-zao-violet transition-colors"
              >
                Ask AI
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-zao-card border border-gold-500/20 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-4">⚡</div>
          <h2 className="text-2xl font-black text-white mb-3">
            Don&rsquo;t see your use case?
          </h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            The split wizard lets you build any configuration from scratch — roles, percentages,
            collaborators. The AI advisor recommends one based on 3 questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/split-wizard" className="btn-gold py-3 px-8">
              Open split wizard →
            </Link>
            <Link
              href="/advisor"
              className="py-3 px-8 rounded-xl border border-zao-border text-slate-300 hover:border-gold-500/50 hover:text-gold-400 transition-colors text-sm font-semibold"
            >
              Ask the AI advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Templates are starting points. All splits are configurable. Splits attested to IPFS
            before any money moves.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/" className="text-slate-500 hover:text-slate-400 transition-colors">
              Home →
            </Link>
            <Link href="/leaderboard" className="text-slate-500 hover:text-slate-400 transition-colors">
              Leaderboard →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
