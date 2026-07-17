#!/usr/bin/env npx ts-node --esm
/**
 * snapshot-split.ts
 *
 * Weekly ops script: fetch the Boostr leaderboard, compute 0xSplits weights,
 * and print the updateSplit() calldata + a DreamNet-style distribution receipt.
 *
 * Usage: npx ts-node scripts/snapshot-split.ts
 *   or:  npx tsx scripts/snapshot-split.ts
 *
 * Output:
 *   - splits-update.json   → paste into splits.org UI or use with ethers/viem
 *   - receipt-<date>.md    → weekly receipt cast (post via ZOL agent)
 *
 * NEVER signs or sends anything on-chain. Human reviews output and calls updateSplit().
 */

import fs from 'fs'
import path from 'path'

const BOOSTR_URL = 'https://boostr.itscashless.com/api/zabaal/stats'
const MIN_POINTS = 10 // boosters with fewer points are excluded (dust prevention)
const SCALE = 1_000_000 // 0xSplits weights are integers; scale percentages to avoid rounding loss

type Contributor = {
  fid: number
  username: string
  followers_count: number
  pfp_url: string
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
  console.log('Fetching Boostr leaderboard…')
  const res = await fetch(BOOSTR_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Boostr API error: ${res.status}`)

  const raw: BoostrApiResponse = await res.json()
  if (!raw.success || !raw.stats) throw new Error('Unexpected API shape')

  const { zabalUsers, activeContributorsCount, totalLikesGenerated, totalCastsLiked } = raw.stats
  const date = new Date().toISOString().slice(0, 10)

  // Filter & sort
  const eligible = zabalUsers
    .filter((u) => u.zabalEnabled && u.zabalLikesCount >= MIN_POINTS)
    .sort((a, b) => {
      if (b.zabalLikesCount !== a.zabalLikesCount) return b.zabalLikesCount - a.zabalLikesCount
      return b.followers_count - a.followers_count
    })

  if (eligible.length === 0) {
    console.error(`No eligible boosters (min ${MIN_POINTS} points). Nothing to update.`)
    process.exit(1)
  }

  const totalPts = eligible.reduce((s, u) => s + u.zabalLikesCount, 0)
  console.log(`Eligible: ${eligible.length} boosters, ${totalPts} total points`)

  // Compute weights (integers that sum to SCALE)
  let weights = eligible.map((u) => Math.floor((u.zabalLikesCount / totalPts) * SCALE))
  // Fix rounding: add remainder to #1 booster
  const remainder = SCALE - weights.reduce((s, w) => s + w, 0)
  weights[0] += remainder

  // Build splits-update payload
  const splitsPayload = {
    _comment: `Generated ${date} · min ${MIN_POINTS} pts threshold · weights sum to ${SCALE}`,
    recipients: eligible.map((u, i) => ({
      address: `WALLET_FOR_FID_${u.fid}`, // FILL IN: map fid → wallet before calling
      percentAllocation: ((weights[i] / SCALE) * 100).toFixed(4),
      weight: weights[i],
      username: u.username,
      points: u.zabalLikesCount,
    })),
    totalWeight: SCALE,
  }

  const splitsPath = path.join(process.cwd(), 'splits-update.json')
  fs.writeFileSync(splitsPath, JSON.stringify(splitsPayload, null, 2))
  console.log(`\nWrote ${splitsPath}`)

  // Build DreamNet-style receipt
  const receiptLines = [
    `ZOOSTR WEEKLY RECEIPT · ${date}`,
    ``,
    `Empire stats:`,
    `  Active boosters: ${activeContributorsCount}`,
    `  Total likes generated: ${totalLikesGenerated}`,
    `  Casts liked: ${totalCastsLiked}`,
    ``,
    `Leaderboard pool (50% of all trading fees this week):`,
    `  → Split across ${eligible.length} boosters by points`,
    ``,
    `Distribution weights:`,
    ...eligible.slice(0, 10).map((u, i) => {
      const pct = ((weights[i] / SCALE) * 100).toFixed(2)
      return `  #${i + 1}  @${u.username.padEnd(20)} ${u.zabalLikesCount} pts  →  ${pct}% of pool`
    }),
    eligible.length > 10 ? `  … and ${eligible.length - 10} more boosters` : '',
    ``,
    `Verified on-chain:`,
    `  Split contract: [SPLITS_CONTRACT_ADDRESS]`,
    `  Basescan: https://basescan.org/address/[SPLITS_CONTRACT_ADDRESS]`,
    ``,
    `Back the empire. 🟡`,
  ].filter((l) => l !== undefined)

  const receiptPath = path.join(process.cwd(), `receipt-${date}.md`)
  fs.writeFileSync(receiptPath, receiptLines.join('\n'))
  console.log(`Wrote ${receiptPath}`)

  // Print preview
  console.log('\n--- RECEIPT PREVIEW ---\n')
  console.log(receiptLines.slice(0, 12).join('\n'))
  console.log('\n--- TOP 5 SPLIT RECIPIENTS ---\n')
  splitsPayload.recipients.slice(0, 5).forEach((r) => {
    console.log(`  ${r.username}: ${r.percentAllocation}%  (weight: ${r.weight})`)
  })
  console.log('\nNext steps:')
  console.log('  1. Fill in wallet addresses in splits-update.json (fid → wallet mapping)')
  console.log('  2. Review the weights')
  console.log('  3. Call updateSplit() on the 0xSplits contract at splits.org')
  console.log('  4. Post receipt-<date>.md as a Farcaster cast')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
