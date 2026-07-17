import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Explicitly set workspace root to silence multi-lockfile warning
  outputFileTracingRoot: path.join(__dirname),
  // pfp images loaded via plain <img> tags — no Next/Image domain config needed
}

export default nextConfig
