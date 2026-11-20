import type { MetadataRoute } from 'next'

// One page (website option B, 2026-11-19). The live site is zoostr.vercel.app.
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE, changeFrequency: 'hourly', priority: 1 }]
}
