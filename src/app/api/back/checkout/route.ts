import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zoostr.xyz'

const TIER_CONFIG: Record<string, { cents: number; label: string }> = {
  spark: { cents: 500, label: 'Spark — $5 founding backing' },
  booster: { cents: 2500, label: 'Booster — $25 founding backing' },
  patron: { cents: 10000, label: 'Patron — $100 founding backing' },
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const tier = formData.get('tier')?.toString() ?? ''

  if (!tier || !TIER_CONFIG[tier]) {
    return NextResponse.redirect(`${BASE_URL}/back?error=invalid_tier`, { status: 303 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.redirect(`${BASE_URL}/back?error=not_configured`, { status: 303 })
  }

  const config = TIER_CONFIG[tier]
  const notifyEmail = process.env.ZAO_NOTIFY_EMAIL ?? 'zaalp99@gmail.com'

  const params = new URLSearchParams({
    mode: 'payment',
    success_url: `${BASE_URL}/back?success=1&tier=${encodeURIComponent(tier)}`,
    cancel_url: `${BASE_URL}/back`,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(config.cents),
    'line_items[0][price_data][product_data][name]': `Zoostr ${config.label}`,
    'line_items[0][price_data][product_data][description]':
      'Empire backing — claim your share of $ZOOSTR fees at splits.org. Perks are what backers enjoy today, not guarantees.',
    'metadata[tier]': tier,
    'metadata[source]': 'zoostr-back',
  })

  // Route notification email through Stripe (so Zaal sees who backed)
  if (notifyEmail) params.set('receipt_email_collection', 'auto')

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${stripeKey}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!stripeRes.ok) {
    const err = await stripeRes.json().catch(() => ({}))
    console.error('[/api/back/checkout] Stripe error:', err)
    return NextResponse.redirect(`${BASE_URL}/back?error=payment_failed`, { status: 303 })
  }

  const session = await stripeRes.json()
  return NextResponse.redirect(session.url, { status: 303 })
}
