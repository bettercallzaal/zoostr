import { NextResponse } from 'next/server'

// Switched off 2026-11-21. The /zol page already redirects to /, and zoostr.vercel.app no
// longer posts to Farcaster from the server. Casting stays a human action. The old version
// is in git history.
export async function POST() {
  return NextResponse.json({ error: 'Posting from this site is switched off.' }, { status: 410 })
}
