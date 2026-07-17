import { NextResponse } from 'next/server'

// Server-side proxy: Boostr API sends no ACAO header so client fetch is blocked by CORS.
// This route fetches server-side and caches for 60s.
export const revalidate = 60

export async function GET() {
  try {
    const res = await fetch('https://boostr.itscashless.com/api/zabaal/stats', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach Boostr API' }, { status: 502 })
  }
}
