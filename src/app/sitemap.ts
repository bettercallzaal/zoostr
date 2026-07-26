import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE}/leaderboard`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/receipt`, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE}/launch`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/advisor`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/back`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/settings`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/split-wizard`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/examples`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/audius`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/discover`, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE}/rewards`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/patronage`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/vetted`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
