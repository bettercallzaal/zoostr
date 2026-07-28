import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const SPARKZ_URL = process.env.NEXT_PUBLIC_SPARKZ_URL ?? 'https://trysparkz.com'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Vetted by ZAO')}&sub=${encodeURIComponent('Curated launches · Scarcity by design · 1 of 50 this quarter')}`

export const metadata: Metadata = {
  title: 'Vetted by ZAO — Sparkz',
  description:
    'The "Vetted by ZAO" badge marks curated, ZAO-backed creator launches. Scarcity by design: 1 of 50 ZAO-backed collabs per quarter. Prestige, not permissionless farming.',
  openGraph: {
    title: 'Vetted by ZAO — Sparkz',
    description:
      'Curated launches. Scarcity by design. 1 of 50 ZAO-backed collabs per quarter.',
    url: `${BASE_URL}/vetted`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Vetted by ZAO — Sparkz' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vetted by ZAO — Sparkz',
    description: '1 of 50 ZAO-backed collabs per quarter. Curation as prestige.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '🏅 Apply for ZAO vetting',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/vetted`,
    'fc:frame:button:2': '⭕ Culture circles',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/circles`,
  },
}

const CRITERIA = [
  {
    icon: '🎵',
    title: 'Proven creative track record',
    body: 'Active output, consistent community engagement, collaborative work across multiple projects.',
  },
  {
    icon: '🤝',
    title: 'Collab-first ethos',
    body: 'Multiple contributors, real split-sheet agreements, distributed fee shares. Not a solo farming play.',
  },
  {
    icon: '⚖️',
    title: 'Extraction-free economics',
    body: 'Creator-first fee defaults. No team dumping on launch day. Transparent allocation visible on-chain.',
  },
  {
    icon: '🌱',
    title: 'Community before token',
    body: 'Existing community engagement pre-token. Not launching a coin into a vacuum.',
  },
]

const BENEFITS = [
  {
    label: 'Badge on your Zoostr profile',
    sub: 'Visible on leaderboard, receipt page, and OG images',
  },
  {
    label: 'ZAO co-promotion',
    sub: 'Featured in ZAO launch threads on Farcaster and X',
  },
  {
    label: 'ZAO locked stake (aligned incentive)',
    sub: 'ZAO holds your token for 12 months. We win when you win.',
  },
  {
    label: 'Access to ZAO advisory channel',
    sub: 'Direct line to the ZAO team on splits, mechanics, and growth',
  },
  {
    label: 'Included in the quarterly ZAO collab drop',
    sub: '1 of 50 slots — each slot announced publicly',
  },
]

export default function VettedPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-zao-violet" />
            ZAO Curation Program
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        {/* Badge preview */}
        <div className="inline-flex items-center gap-2 bg-zao-violet/15 border border-zao-violet/40 rounded-full px-5 py-2 text-sm font-bold text-zao-violet mb-8">
          <span className="text-base">⬡</span>
          Vetted by ZAO
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Curation as prestige.
        </h1>

        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          The <strong className="text-zao-violet">Vetted by ZAO</strong> badge is scarce by design.
          50 slots per quarter. ZAO backs the creator with a locked token stake — not a fee cut.
          The badge means the empire already checked their work.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ 50 slots / quarter</span>
          <span>✓ ZAO co-promotion</span>
          <span>✓ Aligned stake — not a skim</span>
        </div>
      </section>

      {/* This quarter */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-zao-card border border-zao-violet/30 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Q3 2026 — 1 of 50 ZAO-backed collabs this quarter
              </div>
              <h2 className="text-2xl font-black text-white">
                <span className="text-gradient-gold">ZOO</span>
                <span className="text-white">STR</span>
                <span className="ml-3 inline-flex items-center gap-1.5 text-sm font-bold text-zao-violet bg-zao-violet/15 border border-zao-violet/40 rounded-full px-3 py-0.5">
                  <span>⬡</span> Vetted by ZAO
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                ZABAL × Boostr · 34 proven boosters · 655 total likes generated
              </p>
            </div>
            <div className="shrink-0">
              <div className="text-center">
                <div className="text-4xl font-black text-white tabular-nums">49</div>
                <div className="text-xs text-slate-500">slots remaining</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Criteria */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-black text-white mb-6">What ZAO checks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CRITERIA.map((c) => (
            <div key={c.title} className="bg-zao-card border border-zao-border rounded-xl p-5 flex gap-4">
              <div className="text-2xl shrink-0">{c.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-black text-white mb-6">What you get</h2>
        <div className="bg-zao-card border border-zao-border rounded-2xl divide-y divide-zao-border overflow-hidden">
          {BENEFITS.map((b) => (
            <div key={b.label} className="px-5 py-4 flex items-start gap-3">
              <span className="text-zao-violet mt-0.5 shrink-0">⬡</span>
              <div>
                <div className="text-sm font-semibold text-white">{b.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Apply CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-zao-violet/20 to-transparent border border-zao-violet/40 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">⬡</div>
          <h2 className="text-2xl font-black text-white mb-2">Apply for a Q3 slot</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Cast a thread showing your work, your community, and your proposed split. Tag{' '}
            <strong className="text-white">@bettercallzaal</strong>. ZAO reviews within 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://warpcast.com/~/compose?text=applying+for+a+%40bettercallzaal+ZAO+vetted+slot+%F0%9F%A4%9D%0A%0Ahere%27s+my+work%3A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-zao-violet text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Cast your application ↗
            </a>
            <Link
              href={`${SPARKZ_URL}`}
              className="px-6 py-3 rounded-xl border border-zao-border text-slate-400 font-bold text-sm hover:border-slate-500 transition-colors"
            >
              See all Sparkz launches →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            ZAO curation is not a guarantee of token performance. The badge signals alignment and
            community verification — not investment advice.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/launch" className="text-slate-500 hover:text-slate-400 transition-colors">
              ⚡ Launch your token →
            </Link>
            <Link href="/" className="text-slate-500 hover:text-slate-400 transition-colors">
              Home →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
