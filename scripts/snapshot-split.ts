#!/usr/bin/env npx tsx
/**
 * snapshot-split.ts
 *
 * Weekly ops script: fetch the Boostr leaderboard, compute 0xSplits weights,
 * and write the updateSplit() payload + a DreamNet-style distribution receipt.
 *
 * Usage:
 *   npm run snapshot
 *   # or with a custom splits contract address:
 *   SPLITS_ADDRESS=0xABC... npm run snapshot
 *
 * Pre-req: run `npm run resolve-wallets` first to populate fid-wallets.json
 *
 * Output:
 *   - splits-update.json   → paste into splits.org UI or use with viem
 *   - receipt-<date>.md    → weekly receipt cast (post via ZOL agent)
 *
 * NEVER signs or sends anything on-chain. Human reviews and calls updateSplit().
 */

import fs from 'fs'
import path from 'path'

const BOOSTR_URL = 'https://boostr.itscashless.com/api/zabaal/stats'
const MIN_POINTS = 10
const SCALE = 1_000_000 // 0xSplits uses integer weights; 1M = 100%
const SPLITS_ADDRESS = process.env.SPLITS_ADDRESS ?? '[SPLITS_CONTRACT_ADDRESS]'

type Contributor = {
  fid: number
  username: string
  followers_count: number
  zabalLikesCount: number
  zabalEnabled: boolean
}

type BoostrApiResponse = {
  success: boolean
  stats: {
    totalCastsLiked: number
    activeContributorsCount: number
    allTimeContributorsCount: number
    totalLikesGenerated: number
    zabalUsers: Contributor[]
  }
}

async function main() {
  // Load optional fid → wallet mapping (from fid-to-wallet.ts)
  const walletsPath = path.join(process.cwd(), 'fid-wallets.json')
  const fidWallets: Record<number, string | null> = fs.existsSync(walletsPath)
    ? JSON.parse(fs.readFileSync(walletsPath, 'utf-8'))
    : {}

  const hasWallets = Object.keys(fidWallets).length > 0
  if (!hasWallets) {
    console.warn(
      'Warning: fid-wallets.json not found. Run `npm run resolve-wallets` first for real addresses.\n' +
        'Proceeding with placeholder addresses (splits-update.json will have WALLET_FOR_FID_xxx).\n'
    )
  }

  console.log('Fetching Boostr leaderboard…')
  const res = await fetch(BOOSTR_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Boostr API error: ${res.status}`)

  const raw: BoostrApiResponse = await res.json()
  if (!raw.success || !raw.stats) throw new Error('Unexpected API shape')

  const { zabalUsers, activeContributorsCount, allTimeContributorsCount, totalLikesGenerated, totalCastsLiked } =
    raw.stats
  const date = new Date().toISOString().slice(0, 10)

  // Filter: enabled + meets min threshold + has a wallet (if wallets loaded)
  const eligible = zabalUsers
    .filter((u) => {
      if (!u.zabalEnabled || u.zabalLikesCount < MIN_POINTS) return false
      if (hasWallets && !fidWallets[u.fid]) return false // no wallet = skip
      return true
    })
    .sort((a, b) =>
      b.zabalLikesCount !== a.zabalLikesCount
        ? b.zabalLikesCount - a.zabalLikesCount
        : b.followers_count - a.followers_count
    )

  if (eligible.length === 0) {
    console.error(`No eligible boosters (min ${MIN_POINTS} pts, zabalEnabled, wallet required).`)
    process.exit(1)
  }

  const totalPts = eligible.reduce((s, u) => s + u.zabalLikesCount, 0)
  console.log(`Eligible: ${eligible.length} boosters · ${totalPts} total points`)

  // Compute integer weights summing to SCALE
  const weights = eligible.map((u) => Math.floor((u.zabalLikesCount / totalPts) * SCALE))
  weights[0] += SCALE - weights.reduce((s, w) => s + w, 0) // fix rounding residual to #1

  // Build splits-update.json payload
  const splitsPayload = {
    _comment: `Generated ${date} · min ${MIN_POINTS} pts · weights sum to ${SCALE} · NEVER send without human review`,
    splitsContract: SPLITS_ADDRESS,
    recipients: eligible.map((u, i) => ({
      address: fidWallets[u.fid] ?? `WALLET_FOR_FID_${u.fid}`,
      percentAllocation: ((weights[i] / SCALE) * 100).toFixed(4),
      weight: weights[i],
      username: u.username,
      fid: u.fid,
      points: u.zabalLikesCount,
    })),
    totalWeight: SCALE,
  }

  const splitsPath = path.join(process.cwd(), 'splits-update.json')

  // Diff vs previous snapshot (if exists) — shows what changed for human review
  type PrevRecipient = { username: string; percentAllocation: string; fid: number }
  const prevPayload: { recipients?: PrevRecipient[] } | null = fs.existsSync(splitsPath)
    ? JSON.parse(fs.readFileSync(splitsPath, 'utf-8'))
    : null

  if (prevPayload?.recipients) {
    const prevByFid: Record<number, number> = {}
    for (const r of prevPayload.recipients) {
      prevByFid[r.fid] = parseFloat(r.percentAllocation)
    }
    const diffs = splitsPayload.recipients.map((r) => {
      const prev = prevByFid[r.fid] ?? 0
      const curr = parseFloat(r.percentAllocation)
      return { username: r.username, prev, curr, delta: curr - prev }
    })
    // Also note anyone who dropped out
    const currFids = new Set(splitsPayload.recipients.map((r) => r.fid))
    for (const r of prevPayload.recipients) {
      if (!currFids.has(r.fid)) {
        diffs.push({ username: r.username, prev: parseFloat(r.percentAllocation), curr: 0, delta: -parseFloat(r.percentAllocation) })
      }
    }
    diffs.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    const topMovers = diffs.filter((d) => Math.abs(d.delta) > 0.1).slice(0, 10)
    if (topMovers.length > 0) {
      console.log('\n--- WEIGHT CHANGES vs LAST SNAPSHOT ---')
      for (const d of topMovers) {
        const sign = d.delta > 0 ? '+' : ''
        console.log(`  @${d.username.padEnd(20)} ${d.prev.toFixed(2)}% → ${d.curr.toFixed(2)}%  (${sign}${d.delta.toFixed(2)}%)`)
      }
    } else {
      console.log('\n(No significant weight changes vs last snapshot)')
    }
  }

  fs.writeFileSync(splitsPath, JSON.stringify(splitsPayload, null, 2))
  console.log(`\nWrote ${splitsPath}`)

  // Warn if any addresses are still placeholders
  const placeholders = splitsPayload.recipients.filter((r) => r.address.startsWith('WALLET_'))
  if (placeholders.length > 0) {
    console.warn(`\n⚠ ${placeholders.length} placeholder addresses — run resolve-wallets or fill manually:`)
    placeholders.forEach((r) => console.warn(`  FID ${r.fid} (@${r.username})`))
  }

  // Build DreamNet-style weekly receipt
  const receipt = [
    `ZOOSTR WEEKLY RECEIPT · ${date}`,
    ``,
    `Empire stats:`,
    `  Active boosters: ${activeContributorsCount} (${allTimeContributorsCount} all-time)`,
    `  Total likes generated: ${totalLikesGenerated}`,
    `  Casts liked: ${totalCastsLiked}`,
    ``,
    `Leaderboard pool (50% of all $ZOOSTR trading fees this week):`,
    `  → Split across ${eligible.length} eligible boosters by points`,
    `  → Minimum threshold: ${MIN_POINTS} points`,
    ``,
    `Distribution weights (top 10):`,
    ...eligible.slice(0, 10).map((u, i) => {
      const pct = ((weights[i] / SCALE) * 100).toFixed(2)
      return `  #${String(i + 1).padStart(2)} @${u.username.padEnd(22)} ${String(u.zabalLikesCount).padStart(3)} pts  →  ${pct}% of pool`
    }),
    eligible.length > 10 ? `       … and ${eligible.length - 10} more boosters` : '',
    ``,
    `Verified on-chain:`,
    `  Split contract: ${SPLITS_ADDRESS}`,
    SPLITS_ADDRESS !== '[SPLITS_CONTRACT_ADDRESS]'
      ? `  Basescan: https://basescan.org/address/${SPLITS_ADDRESS}`
      : `  Basescan: [set SPLITS_ADDRESS env var]`,
    ``,
    `Back the empire. 🟡`,
    `zoostr.xyz/receipt — live receipt, all earners`,
    ``,
    `---`,
    `Generated by npm run snapshot · Review before calling updateSplit()`,
  ].filter((l) => l !== undefined)

  const receiptPath = path.join(process.cwd(), `receipt-${date}.md`)
  fs.writeFileSync(receiptPath, receipt.join('\n'))
  console.log(`Wrote ${receiptPath}`)

  // Console preview
  console.log('\n--- RECEIPT PREVIEW ---')
  console.log(receipt.slice(0, 15).join('\n'))
  console.log('\n--- NEXT STEPS ---')
  if (placeholders.length > 0) console.log('  0. Fill wallet addresses in splits-update.json')
  console.log('  1. Review splits-update.json')
  console.log('  2. Go to https://app.splits.org → your split → Update')
  console.log('  3. Paste recipients from splits-update.json')
  console.log(`  4. Post receipt-${date}.md as a Farcaster cast`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
