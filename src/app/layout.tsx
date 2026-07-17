import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zoostr — ZABAL × Boostr Creator Token',
  description:
    'The first Sparkz launch: a creator token co-built with Boostr. 50% of trading fees flow to the leaderboard — earn your share by boosting the empire.',
  openGraph: {
    title: 'Zoostr — ZABAL × Boostr Creator Token',
    description: '50% of all trading fees go to the Boostr leaderboard by points.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoostr — ZABAL × Boostr',
    description: 'Earn trading fees by boosting the empire.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
