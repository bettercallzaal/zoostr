import { NextResponse } from 'next/server'
import { fetchBoostrStats } from '@/lib/boostr'

// Server-side proxy: Boostr API sends no ACAO header so client fetch is blocked by CORS.
// Normalizes the raw API response to BoostrStats before returning.
export const revalidate = 60

export async function GET() {
  try {
    const stats = await fetchBoostrStats()
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to reach Boostr API'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
