import type { Metadata } from 'next'
import AudiusIntegration from '@/components/AudiusIntegration'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Audius × Sparkz')}&sub=${encodeURIComponent('Plug your catalog into your split — on-chain, transparent')}`

export const metadata: Metadata = {
  title: 'Audius × Sparkz — Zoostr',
  description:
    'Connect your Audius catalog to a 0xSplits contract. Per-track split configuration, deployed on Base — collaborators claim their share at splits.org.',
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
    description: 'Connect Audius catalog to 0xSplits. Collaborators claim their share at splits.org.',
    images: [OG_URL],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_URL,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '🎵 Audius split config',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${BASE_URL}/audius`,
    'fc:frame:button:2': '🎶 Split-sheet wizard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/split-wizard`,
  },
}

export default function AudiusPage() {
  return <AudiusIntegration />
}
