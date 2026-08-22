import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('About Zoostr')}&sub=${encodeURIComponent('ZABAL × Boostr — the origin story')}`

export const metadata: Metadata = {
  title: 'About Zoostr — ZABAL × Boostr',
  description:
    'Zoostr is the first Sparkz community: ZABAL (creator) × Boostr (tool). 50+ boosters built a real leaderboard before $ZOOSTR existed. Culture first, token second.',
  openGraph: {
    title: 'About Zoostr',
    description: 'ZABAL × Boostr. 50+ people built the leaderboard before the token existed. The community pulled — Zoostr answered with $ZOOSTR.',
    url: `${BASE_URL}/about`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'About Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Zoostr',
    description: 'ZABAL × Boostr. Culture first, token second.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:button:1': '📊 Leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/leaderboard`,
    'fc:frame:button:2': '⚡ How it works',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/how-it-works`,
  },
}

const CREATORS = [
  {
    handle: '@zaal',
    role: 'ZABAL creator',
    what: 'Music creator building the ZABAL empire on Farcaster. ZABAL is the culture at the center of Zoostr — every cast, every moment, every remix. $ZOOSTR is how the empire pays back the people who showed up first.',
    link: 'https://warpcast.com/zaal',
    linkLabel: '@zaal on Warpcast ↗',
  },
  {
    handle: '@cashlessman.eth',
    role: 'Boostr builder',
    what: 'Aziz built Boostr — the social contribution layer that makes Zoostr possible. Boostr tracks Farcaster engagement on ZABAL casts and converts likes into leaderboard points. Without Boostr, there is no proof-of-contribution for Zoostr.',
    link: 'https://boostr.itscashless.com',
    linkLabel: 'boostr.itscashless.com ↗',
  },
]

const TIMELINE = [
  {
    moment: 'Before the token',
    what: '50+ boosters showed up and started liking ZABAL casts on Farcaster — tracked by Boostr. No token existed. No promises were made. Pure culture.',
  },
  {
    moment: 'Community pull',
    what: 'The leaderboard filled up. People asked: "Is there going to be a way to participate economically?" That question — from the community, not the creator — is the graduation trigger.',
  },
  {
    moment: '0xSplits first',
    what: 'Before the token was announced, the 0xSplits contract was configured. The 50/25/25 split was locked in before launch day. The fee recipient address was set before a single trade happened.',
  },
  {
    moment: 'Clanker launch',
    what: '$ZOOSTR launched on Clanker v4 with a 1% fee tier. Fee recipient = the 0xSplits address. The community pool was live from block 1.',
  },
  {
    moment: 'Weekly snapshots begin',
    what: 'ZOL runs a weekly snapshot of the Boostr leaderboard → updates 0xSplits weights → community claims at splits.org. The cycle runs every week.',
  },
]

const STATS = [
  { label: 'Boosters (all-time)', value: '34+' },
  { label: 'Active boosters', value: '50+' },
  { label: 'Likes via Boostr', value: '1,800+' },
  { label: 'ZABAL casts liked', value: '36' },
  { label: 'Eligible for first split', value: '28+' },
  { label: 'Minimum qualifying pts', value: '10' },
  { label: 'Chain', value: 'Base' },
  { label: 'Token', value: '$ZOOSTR (Clanker v4, 1% fee)' },
  { label: 'Community pool', value: '50% of all trading fees' },
]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 space-y-14">
      {/* Header */}
      <section>
        <p className="text-gold-400 text-sm font-semibold mb-3 uppercase tracking-wider">
          The origin story
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">About Zoostr</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Zoostr is ZABAL × Boostr — a music creator and a social tool builder who
          built something real before a token existed. 50+ people showed up for the
          culture. $ZOOSTR is how that culture pays back the people who showed up first.
        </p>
      </section>

      {/* The people */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5">The people</h2>
        <div className="space-y-4">
          {CREATORS.map((c) => (
            <div key={c.handle} className="bg-zao-card border border-zao-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-white">{c.handle}</span>
                    <span className="text-xs text-gold-400 font-semibold">{c.role}</span>
                  </div>
                  <div className="text-slate-400 text-sm leading-relaxed mb-3">{c.what}</div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-400 text-xs hover:underline"
                  >
                    {c.linkLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5">How it happened</h2>
        <div className="space-y-1">
          {TIMELINE.map((t, i) => (
            <div key={t.moment} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                {i < TIMELINE.length - 1 && (
                  <div className="w-0.5 bg-zao-border flex-1 mt-1 mb-1" />
                )}
              </div>
              <div className="pb-6">
                <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  {t.moment}
                </div>
                <div className="text-slate-300 text-sm leading-relaxed">{t.what}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">The numbers</h2>
        <div className="bg-zao-card border border-zao-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {STATS.map((s, i) => (
                <tr key={s.label} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                  <td className="px-4 py-3 text-slate-400 text-xs font-medium w-1/2">{s.label}</td>
                  <td className="px-4 py-3 text-white text-xs">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-xs mt-2">Stats as of 2026-07-17. Live data: /api/boostr</p>
      </section>

      {/* Culture first principle */}
      <section className="bg-zao-card border border-gold-400/20 rounded-2xl p-6">
        <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">
          The Sparkz principle
        </div>
        <p className="text-white font-semibold text-lg mb-2">
          Culture before the coin. Always.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          The token is the community&rsquo;s economic output — not its starting point. Zoostr started
          with ZABAL&rsquo;s music, Aziz&rsquo;s tool, and 50+ people who showed up because the
          culture was real. $ZOOSTR came second. That order matters.
        </p>
      </section>

      {/* CTAs */}
      <section className="flex flex-wrap gap-3">
        <Link
          href="/leaderboard"
          className="bg-gold-400 text-black px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-gold-300 transition-colors"
        >
          📊 Leaderboard
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
        >
          ⚡ How it works
        </Link>
        <Link
          href="/token"
          className="rounded-lg border border-zao-border px-5 py-2.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
        >
          💎 $ZOOSTR token
        </Link>
      </section>

      {/* Footer nav */}
      <div className="border-t border-zao-border">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          <Link href="/how-it-works" className="hover:text-slate-400 transition-colors">How it works</Link>
          <Link href="/token" className="hover:text-slate-400 transition-colors">$ZOOSTR token</Link>
          <Link href="/rewards" className="hover:text-slate-400 transition-colors">Rewards</Link>
          <Link href="/back" className="hover:text-slate-400 transition-colors">Back it</Link>
          <Link href="/discover" className="hover:text-slate-400 transition-colors">Discover</Link>
        </div>
      </div>
    </main>
  )
}
