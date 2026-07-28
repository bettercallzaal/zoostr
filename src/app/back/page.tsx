import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const STRIPE_READY = Boolean(process.env.STRIPE_SECRET_KEY)
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Back the Empire')}&sub=${encodeURIComponent('No wallet. No gas. One-time founding backing — Spark $5 / Booster $25 / Patron $100.')}`

export const metadata: Metadata = {
  title: 'Back the Empire — Zoostr',
  description:
    'Support ZABAL × Boostr with a card — no wallet, no gas. Three backing tiers unlock community recognition and fee-share access.',
  openGraph: {
    title: 'Back the Empire — Zoostr',
    description: 'No wallet. No gas. Back the empire with a card and earn your share.',
    url: `${BASE_URL}/back`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Back the Empire — Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Back the Empire — Zoostr',
    description: 'No wallet. No gas. Card backing for the empire.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '⚡ Back the empire',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/back`,
    'fc:frame:button:2': '🏆 See the leaderboard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/leaderboard`,
  },
}

const TIERS = [
  {
    id: 'spark',
    label: 'Spark',
    price: 5,
    description: 'Get in the door. Your name on the leaderboard. Community recognition.',
    perks: [
      'Leaderboard entry — points start accumulating',
      'Community recognition badge',
      'Weekly receipt notifications',
    ],
    cta: 'Back for $5',
    highlight: false,
  },
  {
    id: 'booster',
    label: 'Booster',
    price: 25,
    description: 'The real deal. Meaningful fee-share weight + early access to Sparkz launches.',
    perks: [
      'Everything in Spark',
      'Boosted leaderboard weight (5× multiplier)',
      'Early access to new Sparkz creator launches',
      'ZAO-backed community Discord access',
    ],
    cta: 'Back for $25',
    highlight: true,
  },
  {
    id: 'patron',
    label: 'Patron',
    price: 100,
    description: 'Top-tier backing. Maximum weight. Direct access to ZAO.',
    perks: [
      'Everything in Booster',
      'Maximum leaderboard weight (20× multiplier)',
      'Direct ZAO advisory channel',
      '"ZAO Patron" label on your profile',
      'Invited to quarterly creator roundtables',
    ],
    cta: 'Back for $100',
    highlight: false,
  },
]

export default async function BackPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; tier?: string }>
}) {
  const { success, error, tier: successTier } = await searchParams
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
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            Card backing · No wallet needed
          </div>
        </div>
      </nav>

      {/* Success / error banners */}
      {success === '1' && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-green-400/10 border border-green-400/30 rounded-xl px-5 py-4 text-sm text-green-300">
            <strong>You&rsquo;re in the empire.</strong> Your backing is confirmed. Points start accumulating — claim your fee share anytime at{' '}
            <a href="https://splits.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-200">splits.org</a>.
            {successTier && <span className="text-green-500 ml-2">({successTier})</span>}
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-5 py-4 text-sm text-red-300">
            Something went wrong with your backing ({error}). Try again below or{' '}
            <a href="https://boostr.itscashless.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-200">back on Boostr</a>.
          </div>
        </div>
      )}

      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-gold-400">💳</span>
          No wallet · No gas · No crypto
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Back the Empire
        </h1>

        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Pay with a card. Earn your share of every{' '}
          <span className="text-gold-400 font-semibold">$ZOOSTR</span> trading fee — by points,
          weekly, forever. No wallet required.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ One-time founding backing</span>
          <span>✓ Points accumulate immediately</span>
          <span>✓ Claim fee share at splits.org</span>
        </div>
      </section>

      {/* Coming soon banner (shown when Stripe not configured) */}
      {!STRIPE_READY && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-gold-400 text-lg">⚡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gold-300">Card backing coming soon</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Card payments activate when the operator sets{' '}
                <code className="text-slate-300 bg-slate-800 px-1 rounded">STRIPE_SECRET_KEY</code>
                . Until then,{' '}
                <a
                  href="https://boostr.itscashless.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:underline"
                >
                  back on Boostr
                </a>{' '}
                to earn points today.
              </p>
            </div>
            <a
              href="https://boostr.itscashless.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 rounded-lg bg-gold-500 text-black text-xs font-bold hover:bg-gold-400 transition-colors"
            >
              Back on Boostr →
            </a>
          </div>
        </div>
      )}

      {/* Tiers */}
      <section className="max-w-3xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl border p-6 flex flex-col gap-4 ${
              tier.highlight
                ? 'border-gold-500/60 bg-zao-card glow-gold'
                : 'border-zao-border bg-zao-card'
            }`}
          >
            {tier.highlight && (
              <div className="inline-flex self-start items-center gap-1.5 bg-gold-500/15 border border-gold-500/40 rounded-full px-2.5 py-0.5 text-xs text-gold-400 font-semibold">
                Most popular
              </div>
            )}

            <div>
              <h2 className="text-lg font-black text-white">{tier.label}</h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">${tier.price}</span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">{tier.description}</p>

            <ul className="flex flex-col gap-2 text-sm">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-slate-300">
                  <span className="text-gold-400 mt-0.5 shrink-0">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              {STRIPE_READY ? (
                <form action="/api/back/checkout" method="POST">
                  <input type="hidden" name="tier" value={tier.id} />
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      tier.highlight
                        ? 'bg-gold-500 text-black hover:bg-gold-400'
                        : 'border border-zao-border text-slate-300 hover:border-gold-500/50 hover:text-gold-400'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </form>
              ) : (
                <a
                  href="https://boostr.itscashless.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-2.5 rounded-xl text-sm font-bold text-center transition-colors ${
                    tier.highlight
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 hover:bg-gold-500/30'
                      : 'border border-zao-border text-slate-500 hover:border-slate-600'
                  }`}
                >
                  Back on Boostr →
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-black text-white mb-6 text-center">How backing works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'Pick a tier',
              body: 'Choose how much you want to back. No wallet or crypto needed — just a card.',
            },
            {
              step: '2',
              title: 'Points accumulate',
              body: 'Your backing converts to leaderboard weight. The more you back, the larger your fee-share slice.',
            },
            {
              step: '3',
              title: 'Claim weekly',
              body: '$ZOOSTR trading fees flow into the 0xSplits pool. Claim your share anytime at splits.org — no deadline.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zao-card border border-zao-border rounded-xl p-5 flex flex-col gap-2"
            >
              <div className="h-7 w-7 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-xs font-black text-gold-400">
                {item.step}
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Viniapp credits path */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
              Also available via
            </div>
            <h3 className="text-lg font-black text-white mb-1">Viniapp Credits</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Power users can back via Viniapp&apos;s credits system — $5 gets you a block of AI +
              backing credits, usable across the Viniapp miniapp ecosystem. No separate wallet
              needed.
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-xs text-slate-500">Phase 1: iframe embed</p>
            <p className="text-xs text-slate-600">Coming with Viniapp × Sparkz integration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Backing converts to leaderboard points. Fee share is proportional to your total points.
            Not financial advice.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/faq"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              FAQ →
            </Link>
            <Link
              href="/leaderboard"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Leaderboard →
            </Link>
            <Link
              href="/receipt"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Weekly receipt →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
