import type { Metadata } from 'next'
import { Syne, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

// Type pairing: Syne (Bonjour Monde) for display, IBM Plex Mono for every number and label.
const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

// zoostr.xyz does not resolve yet, so fall back to the Vercel production URL
// before the custom domain - a share card pointing at dead DNS renders nothing.
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : null
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? VERCEL_URL ?? 'https://zoostr.xyz'
const OG_IMAGE = `${BASE_URL}/api/og`

const DESCRIPTION =
  'The first Sparkz launch. Tokenless-first: no supply, no splits, nothing to buy yet. Just the live leaderboard of the people boosting ZABAL Gamez posts - the empire, before the token.'

export const metadata: Metadata = {
  title: 'Zoostr - the empire, before the token',
  description: DESCRIPTION,
  openGraph: {
    title: 'Zoostr - the empire, before the token',
    description: DESCRIPTION,
    type: 'website',
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Zoostr live boost leaderboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr - the empire, before the token',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  // Farcaster Frame v1 meta - shows the live leaderboard OG when the URL is cast
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': OG_IMAGE,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Live leaderboard',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${plexMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
