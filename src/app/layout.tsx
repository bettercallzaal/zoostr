import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_IMAGE = `${BASE_URL}/api/og`

export const metadata: Metadata = {
  title: 'Zoostr — ZABAL × Boostr Creator Token',
  description:
    'The first Sparkz launch: a creator token co-built with Boostr. 50% of trading fees flow to the leaderboard — earn your share by boosting the empire.',
  openGraph: {
    title: 'Zoostr — ZABAL × Boostr Creator Token',
    description: '50% of all trading fees go to the Boostr leaderboard by points.',
    type: 'website',
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Zoostr Live Leaderboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr — ZABAL × Boostr',
    description: 'Earn trading fees by boosting the empire.',
    images: [OG_IMAGE],
  },
  // Farcaster Frame v1 meta — shows live leaderboard OG when URL is shared in Warpcast
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_IMAGE,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '🏆 Live Leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': BASE_URL,
    'fc:frame:button:2': '💰 Tokenomics',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/#tokenomics`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
