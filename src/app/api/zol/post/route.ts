import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEYNAR_API_KEY
  const signerUuid = process.env.NEYNAR_SIGNER_UUID

  if (!apiKey || !signerUuid) {
    return NextResponse.json(
      { error: 'NEYNAR_API_KEY and NEYNAR_SIGNER_UUID must be set to enable direct posting' },
      { status: 501 }
    )
  }

  let body: { text?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const text = body.text?.trim()
  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }
  if (text.length > 1024) {
    return NextResponse.json({ error: `Cast too long: ${text.length} chars (max 1024)` }, { status: 400 })
  }

  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': apiKey,
    },
    body: JSON.stringify({ signer_uuid: signerUuid, text }),
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json(
      { error: data.message ?? `Neynar error ${res.status}` },
      { status: res.status }
    )
  }

  return NextResponse.json({ cast_hash: data.cast?.hash, cast: data.cast })
}
