#!/usr/bin/env npx tsx
/**
 * meme-engine.ts — V1 human-in-the-loop Meme Engine loop
 *
 * The ONE Meme Engine module shipped in v1:
 *   flag moment → draft 3 variants → approve → post → Community Swarm remix → reward + receipt
 *
 * Usage:
 *   npm run detect-moment              # detect moments + draft 3 cast variants
 *   npm run post-cast -- --approve 1   # post variant 1 (requires NEYNAR_API_KEY)
 *   npm run post-cast -- --approve 2
 *   npm run post-cast -- --approve 3
 *
 * Env vars required:
 *   NEYNAR_API_KEY        — for posting (detect-moment works without it)
 *   NEYNAR_SIGNER_UUID    — the signer to post as
 *   VOLUME                — assumed daily trading volume USD (default: 10000)
 *   SPLITS_ADDRESS        — 0x... for receipt link in casts
 *
 * Output:
 *   meme-engine-draft-YYYY-MM-DD.json  — machine-readable draft (for --approve)
 *   meme-engine-draft-YYYY-MM-DD.md    — human-readable draft for review
 *
 * NEVER posts autonomously. --approve is always required. Human reads the draft.
 * Guardrail: ZOL drafts. Zaal approves. No exception.
 */

import fs from 'fs'
import path from 'path'
import type { BoostrApiResponse, BoostrStats, Contributor } from '../src/lib/types'

// ── Config ──────────────────────────────────────────────────────────────────

const BOOSTR_URL = 'https://boostr.itscashless.com/api/zabaal/stats'
const DAILY_VOLUME = Number(process.env.VOLUME ?? 10_000)
const FEE_TIER = 0.01
// COMMUNITY_PCT: Zoostr launches at 50 (50/25/25). Sparkz default is 1 (97/2/1). Same as npm run receipt.
const COMMUNITY_SHARE = Number(process.env.COMMUNITY_PCT ?? 50) / 100
// Must match snapshot-split.ts and src/lib/boostr.ts so cast drafts show allocation-accurate percentages
const MIN_POINTS = 10
const SPLITS_ADDRESS = process.env.SPLITS_ADDRESS ?? null
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY ?? null
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID ?? null

const today = new Date().toISOString().slice(0, 10)
const DRAFT_MD = path.join(process.cwd(), `meme-engine-draft-${today}.md`)
const DRAFT_JSON = path.join(process.cwd(), `meme-engine-draft-${today}.json`)

// ── Helpers ──────────────────────────────────────────────────────────────────

function weeklyPool(): number {
  return DAILY_VOLUME * FEE_TIER * COMMUNITY_SHARE * 7
}

function fmt(n: number): string {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${n.toFixed(2)}`
  return `$${(n / 1_000).toFixed(1)}k`
}

function pct(points: number, total: number): string {
  if (total === 0) return '0%'
  return `${((points / total) * 100).toFixed(1)}%`
}

function earnings(points: number, total: number): string {
  if (total === 0) return '$0'
  return fmt((points / total) * weeklyPool())
}

async function fetchStats(): Promise<BoostrStats> {
  const res = await fetch(BOOSTR_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Boostr API ${res.status}`)
  const raw: BoostrApiResponse = await res.json()
  if (!raw.success || !raw.stats) throw new Error('Boostr API: success=false')
  const s = raw.stats
  return {
    totalCastsLiked: s.totalCastsLiked,
    activeContributorsCount: s.activeContributorsCount,
    allTimeContributorsCount: s.allTimeContributorsCount,
    totalLikesGenerated: s.totalLikesGenerated,
    contributors: [...s.zabalUsers].sort(
      (a, b) => b.zabalLikesCount - a.zabalLikesCount || b.followers_count - a.followers_count
    ),
  }
}

// ── Moment detection ─────────────────────────────────────────────────────────

type Moment = {
  type: 'weekly-receipt' | 'milestone-likes' | 'milestone-contributors' | 'new-top'
  label: string
  detail: string
  urgency: 'high' | 'normal'
}

type PrevStats = {
  totalLikesGenerated?: number
  activeContributorsCount?: number
  topFid?: number | null
  topUsername?: string | null
}

function detectMoments(stats: BoostrStats, prev: PrevStats = {}): Moment[] {
  const moments: Moment[] = []
  const { totalLikesGenerated: likes, activeContributorsCount: active, contributors } = stats
  const top = contributors[0]

  // Always flag: weekly receipt ready (this is the primary Monday trigger)
  moments.push({
    type: 'weekly-receipt',
    label: 'Weekly receipt ready',
    detail: `${active} active contributors · ${likes.toLocaleString()} total likes · pool ${fmt(weeklyPool())}/week`,
    urgency: 'high',
  })

  // Milestone: likes thresholds
  const LIKE_MILESTONES = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000]
  const prevLikes = prev.totalLikesGenerated ?? 0
  for (const m of LIKE_MILESTONES) {
    if (prevLikes < m && likes >= m) {
      moments.push({
        type: 'milestone-likes',
        label: `${m.toLocaleString()} likes milestone`,
        detail: `Total likes just crossed ${m.toLocaleString()}`,
        urgency: 'high',
      })
    }
  }

  // Milestone: contributor thresholds
  const CONTRIBUTOR_MILESTONES = [10, 20, 30, 50, 100]
  const prevActive = prev.activeContributorsCount ?? 0
  for (const m of CONTRIBUTOR_MILESTONES) {
    if (prevActive < m && active >= m) {
      moments.push({
        type: 'milestone-contributors',
        label: `${m} active contributors`,
        detail: `The empire now has ${m} active boosters`,
        urgency: 'high',
      })
    }
  }

  // New #1 contributor — only fire if prev top is known and has changed
  if (
    prev.topFid != null &&
    top &&
    top.fid !== prev.topFid
  ) {
    moments.push({
      type: 'new-top',
      label: `New #1: @${top.username}`,
      detail: `@${top.username} just overtook @${prev.topUsername ?? 'previous leader'} at the top of the leaderboard`,
      urgency: 'high',
    })
  }

  return moments
}

// ── Draft generation ──────────────────────────────────────────────────────────

type Draft = {
  variant: 1 | 2 | 3
  angle: string
  cast: string
}

function generateDrafts(stats: BoostrStats, moment: Moment): Draft[] {
  const { totalLikesGenerated: likes, activeContributorsCount: active, contributors } = stats
  // Use only eligible contributors (same filter as snapshot-split.ts) so percentages match allocation
  const eligible = contributors.filter(u => u.zabalEnabled && u.zabalLikesCount >= MIN_POINTS)
  const eligibleTotal = eligible.reduce((s, u) => s + u.zabalLikesCount, 0)
  const top5 = eligible.slice(0, 5)
  const pool = fmt(weeklyPool())
  const splitsLink = SPLITS_ADDRESS ? `\n\nsplits: basescan.org/address/${SPLITS_ADDRESS}` : ''
  const receiptLink = '\nfull receipt → zoostr.xyz/receipt'

  // Variant 1: Announcement / stats angle
  const v1 = `ZOOSTR WEEKLY RECEIPT · ${today}

empire stats:
📊 ${active} active boosters
❤️ ${likes.toLocaleString()} total likes
💰 ${pool}/week in the pool

top earners:
${top5.map((u, i) => `${i + 1}. @${u.username} — ${pct(u.zabalLikesCount, eligibleTotal)} — ${earnings(u.zabalLikesCount, eligibleTotal)}/week`).join('\n')}${splitsLink}${receiptLink}`

  // Variant 2: Proof / leaderboard angle (more personal, calls out top booster)
  const top = top5[0]
  const v2 = `the empire doesn't lie.

@${top?.username ?? 'the community'} is #1 this week — ${top ? pct(top.zabalLikesCount, eligibleTotal) : ''}${top ? ` of the pool, ${earnings(top.zabalLikesCount, eligibleTotal)}/week` : ''}

${active} people showed up before $ZOOSTR existed. that's the empire.

every trade now pays them back. weekly. on-chain. claim at splits.org.${receiptLink}`

  // Variant 3: Anthem / "back the work" framing angle
  const v3 = `${active} people built the empire.

they didn't wait for a coin. they just showed up — liked the casts, boosted the reach, kept the leaderboard moving.

now ${pool}/week flows into the pool — theirs to claim at splits.org. proportional to what they put in. forever.

that's what "back the work" looks like.${receiptLink}`

  // Milestone: likes
  if (moment.type === 'milestone-likes') {
    const label = moment.label // e.g. "10,000 likes milestone"
    const mv1 = `ZOOSTR MILESTONE: ${label.toUpperCase()}

${likes.toLocaleString()} total likes from ${active} active contributors.
weekly pool: ${pool}

the empire keeps growing. claim your share → splits.org.${receiptLink}`

    const mv2 = `${likes.toLocaleString()} likes.

before any token existed, ${active} people kept showing up for ZABAL. liked the casts. boosted the reach.

$ZOOSTR pays every one of them back — proportional to what they put in.

${pool}/week flows into the leaderboard pool — claim yours at splits.org.${receiptLink}`

    const mv3 = `the empire just hit ${label}.

not a trader milestone. not a market cap number.

${likes.toLocaleString()} times someone showed up and said "this matters."

every one of them earns from every trade — claim at splits.org. weekly.

that's the model.${receiptLink}`

    return [
      { variant: 1, angle: 'milestone announcement / stats', cast: mv1 },
      { variant: 2, angle: 'people-first milestone story', cast: mv2 },
      { variant: 3, angle: 'what the milestone actually means', cast: mv3 },
    ]
  }

  // Milestone: contributors
  if (moment.type === 'milestone-contributors') {
    const count = active
    const cv1 = `ZOOSTR: ${count} ACTIVE CONTRIBUTORS

${count} people in the community pool. ${likes.toLocaleString()} total likes. ${pool}/week.

the leaderboard is live. claim your share → splits.org.${receiptLink}`

    const cv2 = `${count} people helped build the empire.

they didn't need to know a token was coming. they just showed up.

now every trade pays them back — claim at splits.org. weighted by effort, every week.

that's the point.${receiptLink}`

    const cv3 = `the ZOOSTR community pool now has ${count} active contributors.

not holders. contributors.

every one of them can claim a proportional slice of the weekly fee pool at splits.org.

this is what "earned, not purchased" looks like.${receiptLink}`

    return [
      { variant: 1, angle: 'contributor count milestone announcement', cast: cv1 },
      { variant: 2, angle: 'community story', cast: cv2 },
      { variant: 3, angle: '"earned not purchased" framing', cast: cv3 },
    ]
  }

  if (moment.type === 'new-top' && top) {
    const ntv1 = `new #1 on the ZOOSTR leaderboard: @${top.username} 🟡

${top.zabalLikesCount.toLocaleString()} points — ${pct(top.zabalLikesCount, eligibleTotal)} of the community pool — ${earnings(top.zabalLikesCount, eligibleTotal)}/week

${active} boosters. ${likes.toLocaleString()} total likes. the empire keeps moving.${receiptLink}`

    const ntv2 = `👑 @${top.username} is now #1.

before $ZOOSTR even had a price, they showed up. every week. every cast.

now that work pays ${earnings(top.zabalLikesCount, eligibleTotal)}/week into the pool — claim at splits.org.

this is what "back the work" actually means.${receiptLink}`

    const ntv3 = `the leaderboard just moved.

@${top.username} is the new #1 on the ZOOSTR empire. not by buying in — by showing up.

${active} people are building this. the ones at the top earned it.

claim your share → splits.org${receiptLink}`

    return [
      { variant: 1, angle: 'new #1 announcement', cast: ntv1 },
      { variant: 2, angle: 'tribute / personal (new leader story)', cast: ntv2 },
      { variant: 3, angle: 'leaderboard movement framing', cast: ntv3 },
    ]
  }

  return [
    { variant: 1, angle: 'announcement / stats', cast: v1 },
    { variant: 2, angle: 'proof / leaderboard (calls out top booster)', cast: v2 },
    { variant: 3, angle: 'anthem / "back the work" framing', cast: v3 },
  ]
}

// ── Main: detect-moment ───────────────────────────────────────────────────────

async function detectAndDraft() {
  console.log(`\n🔍 Zoostr Meme Engine — ${today}\n`)

  const stats = await fetchStats()
  console.log(`✓ Boostr stats fetched: ${stats.activeContributorsCount} active, ${stats.totalLikesGenerated.toLocaleString()} likes`)

  // Load previous week's stats for milestone comparison (from splits-update.json._stats)
  const prevPath = path.join(process.cwd(), 'splits-update.json')
  let prev: PrevStats = {}
  if (fs.existsSync(prevPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(prevPath, 'utf-8'))
      if (raw._stats) prev = raw._stats as PrevStats
    } catch { /* no prev stats */ }
  }

  const moments = detectMoments(stats, prev)
  console.log(`\n📍 Moments detected (${moments.length}):`)
  moments.forEach((m, i) => console.log(`  ${i + 1}. [${m.urgency.toUpperCase()}] ${m.label}: ${m.detail}`))

  // Use the highest-urgency moment for drafts (first high, else first normal)
  const primary = moments.find(m => m.urgency === 'high') ?? moments[0]
  const drafts = generateDrafts(stats, primary)

  // Write markdown draft for human review
  const md = [
    `# Meme Engine Draft — ${today}`,
    ``,
    `> Moment: **${primary.label}**`,
    `> ${primary.detail}`,
    ``,
    `Pick a variant to approve: \`npm run post-cast -- --approve <1|2|3>\``,
    ``,
    `---`,
    ``,
    ...drafts.flatMap(d => [
      `## Variant ${d.variant} — ${d.angle}`,
      ``,
      '```',
      d.cast,
      '```',
      ``,
      `To post: \`npm run post-cast -- --approve ${d.variant}\``,
      ``,
      `---`,
      ``,
    ]),
    `## Empire stats (used to generate drafts)`,
    ``,
    `- Active contributors: ${stats.activeContributorsCount}`,
    `- Total likes: ${stats.totalLikesGenerated.toLocaleString()}`,
    `- Weekly pool (at $${DAILY_VOLUME.toLocaleString()}/day volume): ${fmt(weeklyPool())}`,
    `- Top contributor: @${stats.contributors[0]?.username ?? 'n/a'} (${stats.contributors[0]?.zabalLikesCount ?? 0} points)`,
    ``,
    `**Review the draft. Approve one. Never post without reading it.**`,
  ].join('\n')

  fs.writeFileSync(DRAFT_MD, md)
  fs.writeFileSync(DRAFT_JSON, JSON.stringify({ today, moment: primary, drafts, stats }, null, 2))

  console.log(`\n✓ Drafts written:`)
  console.log(`  ${DRAFT_MD}`)
  console.log(`  ${DRAFT_JSON}`)
  console.log(`\n📋 Review the markdown, then run:`)
  console.log(`  npm run post-cast -- --approve 1  (announcement/stats)`)
  console.log(`  npm run post-cast -- --approve 2  (proof/leaderboard)`)
  console.log(`  npm run post-cast -- --approve 3  (anthem/framing)\n`)
}

// ── Main: post-cast ───────────────────────────────────────────────────────────

async function postCast() {
  const approveArg = process.argv.find(a => a.startsWith('--approve'))
  const variantNum = approveArg ? parseInt(approveArg.split('=')[1] ?? approveArg.replace('--approve', '').trim()) : NaN

  if (![1, 2, 3].includes(variantNum)) {
    console.error('Usage: npm run post-cast -- --approve <1|2|3>')
    process.exit(1)
  }

  if (!fs.existsSync(DRAFT_JSON)) {
    console.error(`No draft found for ${today}. Run npm run detect-moment first.`)
    process.exit(1)
  }

  const { drafts } = JSON.parse(fs.readFileSync(DRAFT_JSON, 'utf-8'))
  const draft = drafts.find((d: Draft) => d.variant === variantNum)
  if (!draft) {
    console.error(`Variant ${variantNum} not found in draft.`)
    process.exit(1)
  }

  console.log(`\n📤 Posting variant ${variantNum} (${draft.angle}):\n`)
  console.log('─'.repeat(60))
  console.log(draft.cast)
  console.log('─'.repeat(60))

  if (!NEYNAR_API_KEY || !NEYNAR_SIGNER_UUID) {
    console.log('\n⚠️  NEYNAR_API_KEY or NEYNAR_SIGNER_UUID not set.')
    console.log('Copy the cast text above and post manually on Warpcast.')
    console.log('\nWarpcast compose URL:')
    console.log(`https://warpcast.com/~/compose?text=${encodeURIComponent(draft.cast.slice(0, 320))}`)
    return
  }

  const body = {
    signer_uuid: NEYNAR_SIGNER_UUID,
    text: draft.cast.slice(0, 1024),
  }

  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': NEYNAR_API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`Neynar API error ${res.status}: ${err}`)
    process.exit(1)
  }

  const data = await res.json()
  const hash = data?.cast?.hash ?? '(no hash)'
  console.log(`\n✓ Cast posted! Hash: ${hash}`)
  console.log(`  https://warpcast.com/~/conversations/${hash}`)

  // Save cast hash for track-remix
  const lastCastPath = path.join(process.cwd(), 'last-cast.json')
  fs.writeFileSync(lastCastPath, JSON.stringify({ hash, date: today, variantNum }, null, 2))
  console.log(`\n⏭️  Next: run "npm run track-remix" after 24h to capture Community Swarm remixes.`)
}

// ── Main: track-remix ─────────────────────────────────────────────────────────

async function trackRemix() {
  const lastCastPath = path.join(process.cwd(), 'last-cast.json')
  if (!fs.existsSync(lastCastPath)) {
    console.error('No last-cast.json found. Run npm run post-cast first.')
    process.exit(1)
  }

  const { hash: castHash, date: castDate } = JSON.parse(fs.readFileSync(lastCastPath, 'utf-8'))
  console.log(`\n🔁 Tracking remixes for cast ${castHash} (posted ${castDate})\n`)

  if (!NEYNAR_API_KEY) {
    console.error('NEYNAR_API_KEY not set. Cannot fetch replies without it.')
    process.exit(1)
  }

  // Fetch cast reactions (likes + recasts) and replies
  const [reactionsRes, repliesRes] = await Promise.all([
    fetch(`https://api.neynar.com/v2/farcaster/cast/reactions?hash=${castHash}&types=likes,recasts&limit=100`, {
      headers: { 'api_key': NEYNAR_API_KEY },
    }),
    fetch(`https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${castHash}&type=hash&reply_depth=1&limit=50`, {
      headers: { 'api_key': NEYNAR_API_KEY },
    }),
  ])

  type RemixEntry = { fid: number; username: string; score: number; type: 'recast' | 'reply' | 'like' }
  const remixers = new Map<number, RemixEntry>()

  if (reactionsRes.ok) {
    const rd = await reactionsRes.json()
    // Recasts score 5, likes score 1
    for (const r of (rd?.reactions?.recasts ?? [])) {
      const fid = r.user?.fid
      if (!fid) continue
      const entry = remixers.get(fid) ?? { fid, username: r.user?.username ?? '', score: 0, type: 'recast' as const }
      entry.score += 5
      remixers.set(fid, entry)
    }
    for (const r of (rd?.reactions?.likes ?? [])) {
      const fid = r.user?.fid
      if (!fid) continue
      const entry = remixers.get(fid) ?? { fid, username: r.user?.username ?? '', score: 0, type: 'like' as const }
      entry.score += 1
      remixers.set(fid, entry)
    }
  } else {
    console.warn(`⚠ Reactions API error: ${reactionsRes.status}`)
  }

  if (repliesRes.ok) {
    const cd = await repliesRes.json()
    const replies = cd?.conversation?.cast?.direct_replies ?? []
    for (const reply of replies) {
      const fid = reply.author?.fid
      if (!fid) continue
      const entry = remixers.get(fid) ?? { fid, username: reply.author?.username ?? '', score: 0, type: 'reply' as const }
      // Replies score 3 base + 1 per like they got
      entry.score += 3 + (reply.reactions?.likes_count ?? 0)
      entry.type = 'reply'
      remixers.set(fid, entry)
    }
  } else {
    console.warn(`⚠ Replies API error: ${repliesRes.status}`)
  }

  const top = [...remixers.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  console.log(`📊 Top remixers (${remixers.size} total):`)
  top.forEach((r, i) => console.log(`  ${i + 1}. @${r.username} (FID ${r.fid}) — score ${r.score} [${r.type}]`))

  const remixRewardsPath = path.join(process.cwd(), `remix-rewards-${today}.json`)
  fs.writeFileSync(remixRewardsPath, JSON.stringify({
    castHash,
    castDate,
    trackedDate: today,
    topRemixers: top,
    totalRemixers: remixers.size,
  }, null, 2))

  console.log(`\n✓ Remix report written: ${remixRewardsPath}`)
  console.log(`   Top remixers will receive a bonus in the next snapshot.`)
  console.log(`   Run npm run snapshot to include remix bonuses in the next split update.\n`)
}

// ── Entry point ───────────────────────────────────────────────────────────────

const cmd = process.env.MEME_CMD ?? 'detect'

if (cmd === 'post') {
  postCast().catch(e => { console.error(e); process.exit(1) })
} else if (cmd === 'remix') {
  trackRemix().catch(e => { console.error(e); process.exit(1) })
} else {
  detectAndDraft().catch(e => { console.error(e); process.exit(1) })
}
