#!/usr/bin/env npx tsx
/**
 * fid-to-wallet.ts
 *
 * Resolves Farcaster FIDs → Ethereum wallet addresses via Neynar API.
 * Writes fid-wallets.json which snapshot-split.ts reads automatically.
 *
 * Usage:
 *   NEYNAR_API_KEY=your-key npx tsx scripts/fid-to-wallet.ts
 *
 * Output: fid-wallets.json  { "<fid>": "0xAddress" | null }
 *
 * Address priority: verified ETH address > verified SOL (skip) > custody address
 * Users with no wallet linked get null (excluded from split).
 */

import fs from 'fs'
import path from 'path'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
if (!NEYNAR_API_KEY) {
  console.error('Error: NEYNAR_API_KEY env var not set.')
  console.error('Get a free key at https://neynar.com')
  process.exit(1)
}

const BOOSTR_URL = 'https://boostr.itscashless.com/api/zabaal/stats'
const NEYNAR_BULK = 'https://api.neynar.com/v2/farcaster/user/bulk'
const CHUNK_SIZE = 100 // Neynar bulk limit

type NeynarUser = {
  fid: number
  username: string
  custody_address: string
  verified_addresses?: {
    eth_addresses?: string[]
  }
}

async function main() {
  // 1. Fetch leaderboard to get all FIDs
  console.log('Fetching Boostr leaderboard…')
  const boostrRes = await fetch(BOOSTR_URL, { headers: { Accept: 'application/json' } })
  if (!boostrRes.ok) throw new Error(`Boostr API error: ${boostrRes.status}`)

  const raw = await boostrRes.json()
  if (!raw.success || !raw.stats) throw new Error('Unexpected Boostr API shape')

  const fids: number[] = (raw.stats.zabalUsers ?? []).map((u: { fid: number }) => u.fid)
  console.log(`Found ${fids.length} FIDs`)

  // 2. Resolve via Neynar in batches
  const walletMap: Record<number, string | null> = {}

  for (let i = 0; i < fids.length; i += CHUNK_SIZE) {
    const chunk = fids.slice(i, i + CHUNK_SIZE)
    const url = `${NEYNAR_BULK}?fids=${chunk.join(',')}`

    const res = await fetch(url, {
      headers: { api_key: NEYNAR_API_KEY, Accept: 'application/json' },
    })

    if (!res.ok) {
      console.warn(`Neynar error for chunk ${i}–${i + CHUNK_SIZE}: ${res.status}`)
      chunk.forEach((fid) => (walletMap[fid] = null))
      continue
    }

    const data: { users: NeynarUser[] } = await res.json()

    for (const user of data.users) {
      // Prefer first verified ETH address; fall back to custody address
      const verified = user.verified_addresses?.eth_addresses?.[0]
      walletMap[user.fid] = verified ?? user.custody_address ?? null
    }

    // FIDs not returned by Neynar (very rare)
    for (const fid of chunk) {
      if (!(fid in walletMap)) walletMap[fid] = null
    }

    console.log(`  Resolved ${Math.min(i + CHUNK_SIZE, fids.length)}/${fids.length}`)
  }

  // 3. Summary
  const resolved = Object.values(walletMap).filter(Boolean).length
  const unresolved = fids.length - resolved
  console.log(`\nResolved: ${resolved} wallets · Unresolved (null): ${unresolved}`)

  if (unresolved > 0) {
    const nullFids = Object.entries(walletMap)
      .filter(([, v]) => !v)
      .map(([fid]) => fid)
    console.log(`Null FIDs (no wallet linked): ${nullFids.join(', ')}`)
  }

  // 4. Write output
  const outPath = path.join(process.cwd(), 'fid-wallets.json')
  fs.writeFileSync(outPath, JSON.stringify(walletMap, null, 2))
  console.log(`\nWrote ${outPath}`)
  console.log('Next step: run `npm run snapshot` to generate splits-update.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
