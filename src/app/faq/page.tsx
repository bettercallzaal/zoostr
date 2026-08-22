import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('FAQ — Zoostr')}&sub=${encodeURIComponent('Common questions: leaderboard, fee share, claiming, token')}`

export const metadata: Metadata = {
  title: 'FAQ — Zoostr',
  description:
    'Common questions about $ZOOSTR, the leaderboard, the 0xSplits fee share, and how to back the empire.',
  openGraph: {
    title: 'FAQ — Zoostr',
    description: 'Common questions: leaderboard, fee share, claiming, token, wallet.',
    url: `${BASE_URL}/faq`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'FAQ — Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ — Zoostr',
    description: 'Common questions about the $ZOOSTR empire.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '❓ FAQ',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/faq`,
    'fc:frame:button:2': '⚡ Back the empire',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/back`,
  },
}

const FAQS = [
  {
    section: 'The basics',
    items: [
      {
        q: 'What is Zoostr?',
        a: 'Zoostr is the first Sparkz launch — a creator token co-built by ZABAL and the Boostr community. The token is $ZOOSTR. 50% of every $ZOOSTR trading fee goes to the people who boosted ZABAL on Boostr, ranked by their points. The other 50% goes to the creator and ZAO. All fee routing happens on-chain via 0xSplits.',
      },
      {
        q: 'What is the leaderboard?',
        a: 'The leaderboard ranks every Boostr contributor by their ZABAL boost points (zabalLikesCount). The more you boost, the higher you rank, and the larger your share of the weekly fee pool. Your share = your points ÷ total eligible points.',
      },
      {
        q: 'Do I need a wallet or crypto to participate?',
        a: 'You need a wallet to claim your fee share at splits.org, but you do not need a wallet to start boosting. Back the empire with a card via the /back page — no wallet, no gas needed. Card backing earns leaderboard weight and fee-share access.',
      },
    ],
  },
  {
    section: 'The fee share',
    items: [
      {
        q: 'How is the fee share calculated?',
        a: 'Every $ZOOSTR trade on Clanker (1% fee tier) routes 50% of that fee into a 0xSplits contract. Your share of that pool = your zabalLikesCount ÷ total eligible points. The earnings calculator on the leaderboard page lets you plug in any trading volume to see projected weekly earnings.',
      },
      {
        q: 'What is the minimum points threshold?',
        a: 'You need at least 10 boost points to be eligible. Boosters below the threshold are excluded from the weekly fee pool to prevent dust distributions that cost more in gas than they pay out.',
      },
      {
        q: 'When can I claim my share?',
        a: "Anytime — there is no deadline. Fees accumulate in the 0xSplits contract on Base. Go to app.splits.org, connect your wallet, and claim whenever you want. The pull model means nothing auto-routes to your wallet; you pull it when you're ready.",
      },
      {
        q: 'How do I claim?',
        a: 'Go to app.splits.org → connect your wallet → find the Zoostr split contract → distribute and withdraw. The contract address is shown on the /receipt page (set after deploy). You pay a small gas fee on Base; everything else is on-chain.',
      },
    ],
  },
  {
    section: 'The token',
    items: [
      {
        q: 'When does the $ZOOSTR token launch?',
        a: 'Zoostr is fully configured — the split contract, the leaderboard mechanics, the tokenomics. The deploy is one human click on clanker.world. Zaal will announce the launch on Farcaster (@bettercallzaal) before it happens.',
      },
      {
        q: 'What is the token split (50/25/25)?',
        a: '50% of every trading fee goes to the leaderboard pool (split by booster points). 25% goes to the creator/ZABAL. 25% goes to ZAO. This is the Zoostr-specific split — other Sparkz launches use different defaults (the platform default is 1/1/98).',
      },
      {
        q: 'Is this an investment? Should I buy $ZOOSTR to earn?',
        a: 'No. You earn leaderboard fee share by boosting ZABAL on Boostr — not by holding $ZOOSTR. The fee share is for contributors, not for buyers. Nothing here is financial advice. Do not buy anything expecting a return.',
      },
    ],
  },
  {
    section: 'Boosting and backing',
    items: [
      {
        q: 'How do I get on the leaderboard?',
        a: 'Boost ZABAL on Boostr (boostr.itscashless.com). Like his casts and get others to like them. Every 10+ points puts you in the eligible pool. Points stack over time — the more you boost, the higher you rank.',
      },
      {
        q: 'What is card backing (/back page)?',
        a: 'You can also back the empire with a card at $5, $25, or $100 — no wallet, no gas. Card backing earns leaderboard weight (point multipliers) and community recognition. V1 is one-time backing; recurring billing is v2. Powered by Stripe.',
      },
      {
        q: 'Can I back without holding $ZOOSTR?',
        a: 'Yes. You do not need to hold any $ZOOSTR to earn fee share. Your leaderboard position comes from your boost points, not token balance. Back the work — not the coin.',
      },
    ],
  },
  {
    section: 'ZAO and Sparkz',
    items: [
      {
        q: 'What is ZAO?',
        a: 'ZAO (Zaal Anthropy Organization) is the creative collective behind Zoostr and the Sparkz platform. ZAO curates which projects launch on Sparkz, takes a locked token stake (not an extractive fee), and provides ZOL — an AI agent that runs the Meme Engine for approved projects.',
      },
      {
        q: 'What is Sparkz?',
        a: 'Sparkz (trysparkz.com) is the configurable creator-coin launcher that powers Zoostr. Any creator can configure their own split, fee model, and community mechanics. Zoostr is the first launch; others are coming.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors hidden sm:inline text-xs">
              Leaderboard →
            </Link>
            <Link
              href="/back"
              className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition-colors"
            >
              Back it
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          ❓ Frequently asked questions
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">FAQ</h1>
        <p className="text-slate-400 leading-relaxed">
          Common questions about $ZOOSTR, the leaderboard, the fee share, and how the empire works.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-24 space-y-12">
        {FAQS.map((section) => (
          <div key={section.section}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
              {section.section}
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.q} className="bg-zao-card border border-zao-border rounded-xl p-5">
                  <h2 className="font-black text-white mb-2 text-sm">{item.q}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Not financial advice. Perks are what backers enjoy today, not guaranteed entitlements.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/leaderboard" className="text-slate-500 hover:text-slate-400 transition-colors">
              Leaderboard →
            </Link>
            <Link href="/receipt" className="text-slate-500 hover:text-slate-400 transition-colors">
              Weekly receipt →
            </Link>
            <Link href="/back" className="text-slate-500 hover:text-slate-400 transition-colors">
              Back it →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
