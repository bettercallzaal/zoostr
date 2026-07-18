import type { Metadata } from 'next'
import Link from 'next/link'
import LaunchForm from '@/components/launch/LaunchForm'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const SPARKZ_URL = process.env.NEXT_PUBLIC_SPARKZ_URL ?? 'https://sparkz.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Launch your token')}&sub=${encodeURIComponent('Configure your split. Export. One click to deploy.')}`

export const metadata: Metadata = {
  title: 'Launch Your Token — Sparkz by ZAO',
  description:
    'Give your community a real stake. Configure your fee split in 5 steps, export a deploy config, and launch in one click on clanker.world. Multi-recipient 0xSplits — on-chain, adjustable.',
  openGraph: {
    title: 'Launch your token — Sparkz by ZAO',
    description: 'Configure your community fee split in 5 steps. Export a deploy config. One click to launch on clanker.world.',
    url: `${BASE_URL}/launch`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Launch your token — Sparkz by ZAO' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launch your token — Sparkz by ZAO',
    description: 'Configure your split. Export. One click to deploy.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '⚡ Configure my split',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/launch`,
    'fc:frame:button:2': '🏆 See the Zoostr leaderboard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${SPARKZ_URL}/launches/zoostr`,
  },
}

export default function LaunchPage() {
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
            Sparkz Launcher · Beta
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-zao-violet">⚡</span>
          Powered by Sparkz · built by ZAO
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Give your community a real stake.
        </h1>

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Configure your community fee split in 5 steps. Export a complete deploy config.
          Your community earns from every trade — forever. One click to deploy on clanker.world.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ No wallet needed to configure</span>
          <span>✓ Multi-recipient via 0xSplits</span>
          <span>✓ Weekly split updates — claim at splits.org</span>
          <span>✓ ZAO stakes (never extracts fees)</span>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <LaunchForm />
      </section>

      {/* Footer context */}
      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-xs text-slate-600">
            Sparkz configures your token — it never deploys, signs, or moves funds.
            The deploy is always a human action. Nothing here is financial advice.
          </p>
          <p className="text-xs text-slate-700 mt-1">
            See an example launch:{' '}
            <Link href="/" className="text-slate-500 hover:text-slate-400 transition-colors">
              Zoostr ↗
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
