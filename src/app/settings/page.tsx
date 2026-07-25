import type { Metadata } from 'next'
import Link from 'next/link'
import ByokSettings from '@/components/ByokSettings'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Settings')}&sub=${encodeURIComponent('BYOK · Bring Your Own Key')}`

export const metadata: Metadata = {
  title: 'Settings — Zoostr',
  description:
    'Bring your own Anthropic API key for zero-cost AI advisor access. Power users connect their key; non-technical creators use treasury compute for free.',
  openGraph: {
    title: 'Settings — Zoostr',
    description: 'BYOK: connect your Anthropic key for zero-cost AI access.',
    url: `${BASE_URL}/settings`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Settings — Zoostr' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settings — Zoostr',
    description: 'BYOK · Bring Your Own Key for the Sparkz AI advisor.',
    images: [OG_URL],
  },
}

export default function SettingsPage() {
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
            Settings
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-2xl mx-auto px-4 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-zao-violet">⚙</span>
          Power user settings
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Settings
        </h1>

        <p className="text-slate-400 max-w-md leading-relaxed">
          Configure your Sparkz experience. Power users can bring their own AI key; everyone else
          runs on treasury compute for free.
        </p>
      </section>

      {/* BYOK section */}
      <section className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-black text-white mb-1">Bring Your Own Key (BYOK)</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect your Anthropic API key and all AI advisor requests route through your own
              account — zero platform cost. Without a key, non-technical creators draw from the
              Sparkz treasury (funded by the 1% upkeep floor).
            </p>
          </div>

          <ByokSettings />
        </div>
      </section>

      {/* How compute works */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          How compute works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zao-card border border-zao-border rounded-xl p-5">
            <div className="text-xs font-bold text-zao-violet uppercase tracking-wider mb-2">
              Power creators — BYOK
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Add your Anthropic key above. Every AI advisor call routes through your account. Zero
              cost from the Sparkz treasury. Full control over usage.
            </p>
          </div>
          <div className="bg-zao-card border border-zao-border rounded-xl p-5">
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
              Non-technical creators — Treasury
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              No key? No problem. The Sparkz treasury (funded by the 1% compute upkeep floor on
              every fee) covers AI costs. Keeps onboarding frictionless.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          The treasury-funds-onboarding loop: trading fees → 1% upkeep → pays for compute → lets
          non-technical creators use the AI advisor for free. Seed the treasury early via{' '}
          <a
            href="https://boostr.itscashless.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400 underline"
          >
            Boostr backing
          </a>{' '}
          so it doesn&apos;t go negative at launch.
        </p>
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Your key is stored in your browser&apos;s localStorage — never transmitted to Zoostr
            servers.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/advisor"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              AI Advisor →
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
