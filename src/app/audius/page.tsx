import type { Metadata } from 'next'
import AudiusIntegration from '@/components/AudiusIntegration'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Audius × Sparkz')}&sub=${encodeURIComponent('Plug your catalog into your split — on-chain, automatic')}`

export const metadata: Metadata = {
  title: 'Audius × Sparkz — Zoostr',
  description:
    'Connect your Audius catalog to a 0xSplits contract. Per-track split configuration, IPFS-attested, deployed on Base — collaborators paid automatically.',
  openGraph: {
    title: 'Audius × Sparkz — plug your catalog into your split',
    description: 'Per-track split configuration wired to 0xSplits. No token required.',
    url: `${BASE_URL}/audius`,
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Audius × Sparkz' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audius × Sparkz — your catalog, on-chain splits',
    description: 'Connect Audius catalog to 0xSplits. Collaborators paid automatically.',
    images: [OG_URL],
  },
}

export default function AudiusPage() {
  return <AudiusIntegration />
}
