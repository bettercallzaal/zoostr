import type { NextConfig } from 'next'
import path from 'path'

// Pre-launch marketing routes from before the homepage became the leaderboard.
// They still carry stale tokenomics copy, so send them to / with a 308 instead
// of leaving them reachable by direct URL.
const LEGACY_ROUTES = ['/token', '/rewards', '/leaderboard', '/launch', '/back', '/advisor']

const nextConfig: NextConfig = {
  // Explicitly set workspace root to silence multi-lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // pfp images loaded via plain <img> tags — no Next/Image domain config needed
  async redirects() {
    return LEGACY_ROUTES.map((source) => ({ source, destination: '/', permanent: true }))
  },
}

export default nextConfig
