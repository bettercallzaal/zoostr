import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE}/leaderboard`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/launch`, changeFrequency: 'weekly', priority: 0.7 },
  ]
}
