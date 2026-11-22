import type { NextConfig } from 'next'
import path from 'path'

// zoostr.vercel.app is one page (Zaal, 2026-11-19, website option B). Every other route is
// from the token era (tokenomics, receipts, backing tiers, split tools) and contradicts the
// current rulings: real numbers only, no token, no receipts. Send each to / with a 308.
// The page files stay in the repo for now; removing them is a separate cleanup.
// "/x/:path*" also matches "/x" itself.
const LEGACY_ROUTES = [
  '/about',
  '/advisor',
  '/audius',
  '/back',
  '/circles',
  '/discover',
  '/examples',
  '/faq',
  '/how-it-works',
  '/launch',
  '/leaderboard',
  '/patronage',
  '/receipt',
  '/rewards',
  '/settings',
  '/split-wizard',
  '/token',
  '/vetted',
  '/zol',
]

const nextConfig: NextConfig = {
  // Explicitly set workspace root to silence multi-lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // pfp images loaded via plain <img> tags — no Next/Image domain config needed
  async redirects() {
    return LEGACY_ROUTES.map((route) => ({ source: `${route}/:path*`, destination: '/', permanent: true }))
  },
}

export default nextConfig
