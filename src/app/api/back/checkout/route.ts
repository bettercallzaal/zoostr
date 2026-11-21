import { NextResponse } from 'next/server'

// Switched off 2026-11-21. zoostr.vercel.app is one page (website option B, 19 Nov) with no
// token, nothing to buy and no backing tiers. The /back page already redirects to /, and
// this route no longer starts a Stripe checkout. The old version is in git history.
export async function POST() {
  return NextResponse.json({ error: 'Backing checkout is switched off.' }, { status: 410 })
}
