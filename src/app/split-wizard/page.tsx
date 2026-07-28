import type { Metadata } from 'next'
import Link from 'next/link'
import SplitWizard from '@/components/SplitWizard'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Split-Sheet Wizard')}&sub=${encodeURIComponent('Set roles + % before launch — IPFS-attestable, wired to 0xSplits')}`

export const metadata: Metadata = {
  title: 'Split-Sheet Wizard — Sparkz by ZAO',
  description:
    'Define collaborator roles + percentages before launch. IPFS-attestable. Exports JSON ready to wire directly to 0xSplits. The music-native way to kill revenue disputes before they start.',
  openGraph: {
    title: 'Split-Sheet Wizard — Sparkz by ZAO',
    description:
      'Roles + % + wallets set before launch. Exports a markdown split sheet + 0xSplits JSON. IPFS-attestable.',
    url: `${BASE_URL}/split-wizard`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Split-Sheet Wizard — Sparkz' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split-Sheet Wizard — Sparkz',
    description: 'Music-native split sheet: roles + % before launch, IPFS-attestable.',
    images: [OG_URL],
  },
}

export default function SplitWizardPage() {
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
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Split-Sheet Wizard · Music-native
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-4 py-1.5 text-xs text-slate-400 mb-6">
          <span className="text-green-400">🎵</span>
          Set roles + % before launch · No disputes later
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Split-Sheet Wizard
        </h1>

        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Define who gets what — before the token launches. IPFS-attest the sheet, wire it to
          0xSplits. The music-native way to kill revenue disputes before they start.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <span>✓ Artists · Producers · Writers · Labels</span>
          <span>✓ Exports 0xSplits JSON</span>
          <span>✓ IPFS-attestable</span>
        </div>
      </section>

      {/* Why this matters */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🤝',
              title: 'Set it before launch',
              body: 'Agree on splits while everyone is aligned. Trying to change it after the token is live is painful.',
            },
            {
              icon: '📄',
              title: 'IPFS attestation',
              body: 'Upload the sheet to IPFS. The CID is your immutable, public record — the on-chain receipt of your agreement.',
            },
            {
              icon: '⚡',
              title: 'Wires to 0xSplits',
              body: 'The exported JSON pastes directly into app.splits.org. Set the contract as the Clanker fee recipient. Done.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zao-card border border-zao-border rounded-xl p-5 flex flex-col gap-2"
            >
              <div className="text-2xl">{item.icon}</div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wizard */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <SplitWizard />
      </section>

      {/* Footer */}
      <div className="border-t border-zao-border">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Split sheets are generated client-side. No data is sent to Sparkz servers. IPFS
            attestation is a manual step — upload via w3up.web3.storage or pinata.cloud.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/launch"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              ⚡ Full launch config →
            </Link>
            <Link
              href="/advisor"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              AI Advisor →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
