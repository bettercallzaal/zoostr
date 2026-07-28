import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'
const OG_IMAGE = `${BASE_URL}/api/og`

export const metadata: Metadata = {
  title: 'Zoostr — Back the Empire · ZABAL × Boostr',
  description:
    'The empire was running before the token. Boost ZABAL on Boostr, earn your share of every $ZOOSTR trading fee — by points, weekly, forever. A Sparkz launch.',
  openGraph: {
    title: 'Zoostr — Back the Empire · ZABAL × Boostr',
    description: 'Boost the empire. Earn 50% of every trading fee by points. No token required to start.',
    type: 'website',
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Zoostr Live Leaderboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr — Back the Empire · ZABAL × Boostr',
    description: 'Boost the empire. Earn your share of every $ZOOSTR trading fee — weekly, forever.',
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
    'fc:frame:button:2': '🎯 How to earn',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${BASE_URL}/rewards`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
