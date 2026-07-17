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
| Monday 00:00 UTC | Run `npm run snapshot` | ZOL generates, Zaal/Aziz reviews + calls `updateSplit()` | Human-gated |
| Monday 12:00 UTC | Confirm new split live on basescan | ZOL checks, posts confirmation note | ZOL |
| Monday 12:00 UTC | Run `npm run receipt`, present casts | ZOL generates, Zaal/Aziz approves, ZOL posts | Human-gated |
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

ACTION: approve to post? (Zaal/Aziz: reply "post" or "edit: [changes]")
```

### 2.5 Post the receipt (after approval)

ZOL posts both casts as a thread from the designated account.

**Designated account:** TBD — Zaal's call (@zaal or @bettercallzaal or a dedicated @zoostr account)

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
| Posting account | TBD | Zaal decision |
| Assumed daily volume (for receipts) | `VOLUME=10000` default | Zaal can adjust any week |

---

## Quick reference: commands

```bash
# Weekly snapshot (Monday)
SPLITS_ADDRESS=0x... npm run snapshot

# Weekly receipt casts
VOLUME=50000 npm run receipt

# Resolve new wallets
NEYNAR_API_KEY=... npm run resolve-wallets

# Status update to ZAALBOTS
~/bin/zao-status "message"
```

---

*ZOL prepares everything; Zaal/Aziz approves + executes. No agent touches on-chain, no agent posts without review. This is the loop.*
