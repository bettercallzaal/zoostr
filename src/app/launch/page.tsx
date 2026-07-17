import type { Metadata } from 'next'
import Link from 'next/link'
import LaunchForm from '@/components/launch/LaunchForm'

export const metadata: Metadata = {
  title: 'Launch Your Token — Sparkz by ZAO',
  description:
    'Configure your creator token in 5 steps. Set your community fee split, choose your metric, and export a ready-to-deploy config. One human click on clanker.world.',
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
          Launch your creator token.
        </h1>

        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Configure your fee split in 5 steps. The deploy is one click on clanker.world.
          Your community earns from every trade — forever.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ No wallet needed to configure</span>
          <span>✓ On-chain via 0xSplits</span>
          <span>✓ Weekly leaderboard updates</span>
          <span>✓ ZAO stakes alongside you</span>
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
