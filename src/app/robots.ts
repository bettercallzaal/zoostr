import type { MetadataRoute } from 'next'

// The live site is zoostr.vercel.app.
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
