# ZOL Agent Ops Runbook — Zoostr Weekly Cycle

> Who runs this: ZOL (ZAO's agent loop in ~/sparkz)
> Scope: all ongoing ops after token launch — weekly distribution prep + receipt posting
> Status: DRAFT — activate after NEXT_PUBLIC_TOKEN_ADDRESS is set on Vercel
> Human gate: all outbound (on-chain calls, Farcaster casts) require Zaal or Aziz review

---

## Hard boundary (never cross)

ZOL never calls `updateSplit()`, never posts a cast, never signs a transaction.

ZOL runs the scripts, generates the payloads, presents them for review, and waits.
A human reviews and executes every on-chain or outbound action.

---

## Weekly ops calendar

| Day | Action | Who | Status |
|-----|--------|-----|--------|
| Monday 00:00 UTC | Run `npm run detect-moment` | ZOL detects moments, generates 3 cast variants → `/zol` | ZOL |
| Monday 00:00 UTC | Run `npm run snapshot` | ZOL generates split weights | ZOL |
| Monday 09:00 UTC | Review snapshot + approve cast variant at `/zol` | Zaal/Aziz reviews → selects variant → opens Warpcast compose | Human-gated |
| Monday 09:00 UTC | Call `updateSplit()` via splits.org | Zaal/Aziz executes on-chain | Human-gated |
| Monday 12:00 UTC | Confirm new split live on basescan | ZOL checks, posts confirmation note | ZOL |
| Monday 12:00 UTC | Run `npm run receipt`, present casts | ZOL generates, Zaal/Aziz approves, ZOL posts | Human-gated |
| Tuesday 12:00 UTC | Run `npm run track-remix` | ZOL captures Community Swarm remixes, writes remix-rewards JSON | ZOL |
| Next Monday | `npm run snapshot` includes remix bonuses | Top 3 remixers +50 pts; positions 4-10 +25 pts | ZOL |
| Continuous | Monitor `/api/boostr` for API errors | ZOL watches build health, alerts on failures | ZOL |

---

## Phase 1: Launch day ops (one-time, within 24h of token deploy)

### 1.1 Confirm token address

```bash
# After Zaal/Aziz deploys on clanker.world:
# 1. Copy the contract address from Clanker
# 2. Set on Vercel: NEXT_PUBLIC_TOKEN_ADDRESS=0x...
# 3. Redeploy Vercel (or trigger in dashboard)
# The site's "Token Live" green banner activates automatically.
```

### 1.2 First leaderboard snapshot

```bash
cd ~/sparkz

# Step 1: resolve FID → wallet addresses
NEYNAR_API_KEY=<key> npm run resolve-wallets
# writes: fid-wallets.json

# Step 2: compute split weights
SPLITS_ADDRESS=<splits-contract-address> npm run snapshot
# writes: splits-update.json + receipt-<date>.md
# NEVER calls updateSplit() — just generates the payload
```

**ZOL presents to Zaal/Aziz:**
```
SPLITS UPDATE READY — review before calling updateSplit()

Split contract: 0x...
Recipients: [N] boosters
Top 5:
  @username  342 pts  → 18.4%  → 0x...
  ...

Full payload: ~/sparkz/splits-update.json
Action: go to https://app.splits.org → your split → Update → paste from splits-update.json
```

### 1.3 Verify the split

After `updateSplit()` is called:
- Confirm on basescan that the split contract recipients match `splits-update.json`
- Post verification note in ZAALBOTS

### 1.4 Launch thread

The 5-cast Farcaster launch thread and X thread are in:
- `docs/launch-thread-farcaster.md` (5 casts ready)
- `docs/launch-thread-x.md` (5 tweets + standalone)

**Workflow:**
1. ZOL presents the thread drafts to Zaal/Aziz for review
2. Zaal/Aziz edits any numbers from live snapshot (fill in the `[UPDATE NUMBERS]` placeholders using `npm run receipt`)
3. Zaal/Aziz approves
4. ZOL posts as a thread from the designated account

**To fill in live numbers:**
```bash
VOLUME=<assumed_daily_volume> npm run receipt
# Copy Cast 1 and Cast 2 output into the thread
```

---

## Phase 2: Weekly ops (every Monday after launch)

### 2.1 Weekly snapshot — ZOL generates

```bash
cd ~/sparkz

# Optional: refresh wallet mapping (if new boosters joined since last run)
NEYNAR_API_KEY=<key> npm run resolve-wallets

# Generate split weights
SPLITS_ADDRESS=<splits-contract-address> npm run snapshot
# Output: splits-update.json + receipt-<date>.md
```

### 2.2 ZOL presents for human review

ZOL posts in ZAALBOTS (via `~/bin/zao-status`):

```
ZOOSTR WEEKLY SNAPSHOT — [date]

Ready for review: ~/sparkz/splits-update.json

Top 5 this week:
  #1 @username  [pts] pts → [pct]% of pool
  #2 @username  [pts] pts → [pct]%
  #3 ...

[N] eligible boosters (≥10 pts, wallet resolved)

ACTION NEEDED: 
  1. Review splits-update.json
  2. Go to https://app.splits.org → [splits contract] → Update
  3. Paste recipients
  4. Reply "split updated" to unblock receipt post
```

### 2.3 Human calls `updateSplit()`

Zaal or Aziz:
1. Opens https://app.splits.org
2. Finds the Zoostr split contract
3. Uploads / pastes `splits-update.json` recipients
4. Signs and submits

### 2.4 Weekly receipt — ZOL generates casts

```bash
VOLUME=<assumed_daily_volume> npm run receipt
# Output: 2 Farcaster-ready casts (copy to clipboard for posting)
```

Cast 2 includes `zoostr.xyz/receipt` — the live web receipt page with all earners,
empire stats, and splits contract link. It's Farcaster-frameable: share the URL in
Warpcast for an inline frame boosters can navigate without leaving the app.

**ZOL presents for approval:**
```
RECEIPT CASTS READY — [date]

Cast 1:
  📜 ZOOSTR RECEIPT — [date]
  weekly leaderboard → fees
  assumed volume: $[X]/day
  ...

Cast 2:
  [empire stats + CTA]
  full receipt + all earners → zoostr.xyz/receipt

Live receipt page: zoostr.xyz/receipt (ISR, always current)

ACTION: approve to post? (Zaal/Aziz: reply "post" or "edit: [changes]")
```

### 2.5 Post the receipt (after approval)

ZOL posts both casts as a thread from the designated account.

**Designated account:** TBD — Zaal's call (@zaal or @bettercallzaal or a dedicated @zoostr account)

---

### 2.6 Meme Engine cycle (Monday–Tuesday loop)

The Meme Engine runs a human-gated social loop every week: detect → draft → approve → post → swarm → reward → repeat.

#### Step 1: Detect moment + generate drafts (Monday 00:00 UTC)

```bash
cd ~/sparkz
npm run detect-moment
# Reads Boostr stats
# Detects: weekly-receipt (always), milestone-likes, milestone-contributors
# Writes: meme-drafts/draft-<date>-<type>-<variant>.json  (3 variants)
```

Moment types and scoring:
- `weekly-receipt` — always triggered; priority = high
- `milestone-likes` — 1k/5k/10k/25k total likes crossed; priority = medium/high
- `milestone-contributors` — 10/20/30/50 unique boosters; priority = medium

Draft variants generated for each moment:
1. **announcement/stats** — numbers-first, achievement framing
2. **proof/leaderboard** — calls out the #1 booster by name, social proof
3. **anthem/back the work** — "back the album not buy a coin" brand voice

#### Step 2: Review + approve at `/zol` (Monday 09:00 UTC)

ZOL presents all 3 variants on the `/zol` admin page (unlisted, robots noindex).

**Zaal/Aziz workflow:**
1. Open `https://zoostr.xyz/zol`
2. See live empire stats (top-5 earners preview, pool size)
3. Read 3 draft variants side by side
4. Edit inline if needed (textarea on each card)
5. Click "Open in Warpcast" on the approved variant
6. Warpcast opens pre-filled — **manually click Send** (ZOL never calls Neynar from the UI)

No Neynar API call is made from the `/zol` page. The human gate is physical: Warpcast compose, not a button that auto-posts.

#### Step 3: Track Community Swarm remixes (Tuesday 12:00 UTC)

After the post is live ~24h, capture what the community remixed:

```bash
npm run track-remix
# Reads: last-cast.json (hash + timestamp of the approved cast)
# Fetches: Neynar reactions + replies
# Scoring: recast = 5 pts, reply = 3 pts + (likes on reply), like = 1 pt
# Writes: meme-engine/remix-rewards-<date>.json
```

Output format:
```json
{
  "castHash": "0x...",
  "scoredAt": "2026-07-22T12:00:00Z",
  "topRemixers": [
    { "fid": 12345, "username": "booster1", "score": 47, "bonusPoints": 50 },
    ...
  ]
}
```

Positions 1–3 earn `+50 bonus pts`; positions 4–10 earn `+25 bonus pts`.
These bonuses are applied to `effectivePoints` in the **next Monday's** `npm run snapshot`.

#### Step 4: Next snapshot includes remix bonuses (following Monday)

`npm run snapshot` automatically reads the most recent `remix-rewards-*.json`:
- Adds bonus points to each FID's `effectivePoints`
- Notes bonus in the receipt output: `@username [pts] pts + 50 remix bonus → [pct]%`
- No extra steps needed — bonus is baked in automatically

---

## Phase 3: Monitoring

### What ZOL watches

| Signal | How | Threshold |
|--------|-----|-----------|
| Boostr API down | `curl https://boostr.itscashless.com/api/zabaal/stats` | If 3 consecutive failures → alert |
| Split weights drifted | Compare `/api/boostr` leaderboard vs `splits-update.json` | If top booster's share changed >5pp → alert |
| Token address not set | Check `NEXT_PUBLIC_TOKEN_ADDRESS` env | Alert if >7 days post-deploy with no address set |

### Alert format

```bash
/home/zaal/bin/zao-status "ZOOSTR ALERT: [signal]. Check [location]. No action needed from ZOL — flagging for visibility."
```

---

## Accounts and addresses (fill in at launch)

| Item | Value | Set by |
|------|-------|--------|
| Token address | `NEXT_PUBLIC_TOKEN_ADDRESS=0x...` | Zaal — set on Vercel |
| 0xSplits contract | `SPLITS_ADDRESS=0x...` | Zaal/Aziz — deploy on splits.org |
| Neynar API key | `NEYNAR_API_KEY=...` | Zaal — set in shell env or .env |
| Neynar signer UUID | `NEYNAR_SIGNER_UUID=...` | Zaal — from Neynar developer portal (for `npm run post-cast` path) |
| Posting account | TBD | Zaal decision |
| Assumed daily volume (for receipts) | `VOLUME=10000` default | Zaal can adjust any week |

---

## Quick reference: commands

```bash
# Weekly snapshot (Monday)
SPLITS_ADDRESS=0x... npm run snapshot

# Weekly receipt casts
VOLUME=50000 npm run receipt

# Meme Engine: detect moment + draft 3 cast variants
npm run detect-moment
# Output: meme-drafts/draft-<date>-*.json  (3 variants)
# Next: open zoostr.xyz/zol to approve

# Meme Engine: post approved cast via Warpcast (human opens Warpcast compose)
# Variant 1 = announcement/stats, 2 = proof/leaderboard, 3 = anthem
npm run post-cast --approve 1   # or 2 or 3

# Meme Engine: track Community Swarm remixes (run ~24h after post)
npm run track-remix
# Output: meme-engine/remix-rewards-<date>.json
# Bonuses applied automatically in next snapshot

# Resolve new wallets
NEYNAR_API_KEY=... npm run resolve-wallets

# Status update to ZAALBOTS
~/bin/zao-status "message"
```

---

*ZOL prepares everything; Zaal/Aziz approves + executes. No agent touches on-chain, no agent posts without review. This is the loop.*
