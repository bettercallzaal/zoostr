# Zoostr — Deploy Config & Launch Checklist

> Status: draft · all prep done here · ONE human clicks deploy on clanker.world
> Deployer: TBD — Zaal decision (likely Aziz/cashlessman on the Boostr rail)

**Live empire snapshot (2026-07-17):**
- 34 all-time boosters · 32 active · 655 total likes · 36 casts liked
- 28 eligible for first split (≥10 pts) · run `npm run snapshot` for weights

---

## PR merge sequence (do this first)

Merge each PR to `main` in order before deploying. They are stacked and depend on each other.

| # | Branch | What it adds |
|---|--------|-------------|
| 1 | `feat/zoostr-site-v1` | Core site: live leaderboard, tokenomics, launch info, receipts |
| 2 | `feat/launch-prep` | Deploy config (this doc), Farcaster thread, X thread, ops runbook |
| 3 | `feat/sparkz-spec` | Sparkz launcher spec + ZOL AI advisor prompt |
| 4 | `feat/spark-lifecycle` | Spark lifecycle model + Culture Circles composable backing |
| 5 | `feat/viniapp-spec` | Viniapp × Sparkz miniapp integration spec |
| 6 | `feat/meme-engine-v1b` | V1-SCOPE + Meme Engine scripts + /zol admin page |
| 7 | `feat/ops-meme-update` | ZOL ops runbook with Meme Engine weekly cycle |
| 8 | `feat/ship-guide` | This file updated with full 9-PR sequence + Vercel env var table |
| 9 | `feat/sparkz-crosslinks-site` | Sparkz.xyz cross-links in zoostr.xyz footer + "launch like this" CTA |
| 10 | `feat/deploy-config-update` | This file: sequence updated to reflect all 10 PRs |
| 11 | `feat/lint-fixes` | Fix unescaped JSX entities in ZolApprovePanel + receipt page |
| 12 | `feat/zol-post-api` | `/api/zol/post` direct Neynar posting + ZolApprovePanel "Post via ZOL" button |
| 13 | `feat/launch-page-og` | OG + Farcaster Frame metadata on /launch page; deploy-config updated to 13 PRs |
| 14 | `feat/zol-boostr-resilience` | /zol page: graceful fallback when Boostr API is down (banner + disabled drafts) |
| 15 | `feat/launch-threads` | docs: 5-cast Farcaster launch thread + X thread (run `npm run receipt` then post) |
| 16 | `feat/leaderboard-share-cast` | Warpcast share icon on each eligible leaderboard row — boosters share their rank |
| 17 | `feat/receipt-join-cta` | "Not on the leaderboard yet?" onboarding section on /receipt page |
| 18 | `feat/launch-export-share` | "Cast your launch config ↗" Farcaster link on /launch export step |
| 19 | `feat/receipt-twitter-card` | Add Twitter card metadata to /receipt page (was using generic layout fallback) |
| 20 | `feat/readme-update` | Full README rewrite — pages, scripts, env vars, framing — ready for public repo |
| 21 | `feat/leaderboard-error-state` | Leaderboard: amber banner + distinct error/empty messages when Boostr API is down |

After all 21 PRs are merged to `main`:
- Connect bettercallzaal/zoostr to Vercel (Zaal makes the Vercel)
- Set env vars (see "Vercel env vars" below)
- Then proceed to Steps 1–6 in this doc

---

## Vercel environment variables

| Variable | Value | Required for |
|----------|-------|-------------|
| `NEXT_PUBLIC_BASE_URL` | `https://zoostr.xyz` | OG images, sitemap canonical URLs |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | `0x...` (from Clanker deploy) | "Token Live" banner; set AFTER Step 3 |
| `NEXT_PUBLIC_SPLITS_ADDRESS` | `0x...` (from Step 1) | Receipt page splits link; set AFTER Step 1 |
| `NEYNAR_API_KEY` | `...` | `npm run post-cast`, `npm run track-remix`, `/api/zol/post` direct posting |
| `NEYNAR_SIGNER_UUID` | `...` | `npm run post-cast`, `/api/zol/post` (Neynar developer portal) |
| `NEXT_PUBLIC_SPARKZ_URL` | `https://sparkz.xyz` | /launch page "See Zoostr leaderboard" Frame button |

The site deploys and runs in pre-token mode without `NEXT_PUBLIC_TOKEN_ADDRESS`.
Set that env var after the Clanker deploy and redeploy Vercel.

---

## Pre-flight: decisions to lock before deploy

| # | Decision | Options | Recommended |
|---|----------|---------|-------------|
| 1 | **Deployer** | Zaal or Aziz | Aziz (@cashlessman.eth) — Boostr is his platform, gives it Boostr-native credibility |
| 2 | **Ticker** | $ZOOSTR / $ZOSTR / $ZOO | **$ZOOSTR** — distinctive, unmistakable, matches the brand |
| 3 | **ZAO lock size** | 5–15% of supply | **5%** — meaningful stake, doesn't crowd creator/community |
| 4 | **ZAO lock duration** | 6–24 months | **12 months** with 3-month cliff (aligned with $IMAN precedent) |
| 5 | **Initial split controller** | Zaal solo / Zaal+Aziz 2-of-2 / 2-of-3 multisig | **2-of-2 Zaal+Aziz** — simple, disclosed, upgradeable to multisig later |
| 6 | **Min points threshold** | 0 / 5 / 10 pts to be in split | **10 pts** — prevents dust distributions |
| 7 | **Distribution cadence** | Daily / Weekly / Biweekly | **Weekly** (Monday 00:00 UTC) — simple, predictable |

---

## Step 1: Deploy the 0xSplits contract

> Do this BEFORE deploying on Clanker. The Splits address is what goes into clanker.world.

**Go to:** https://app.splits.org (Base network)

**Create a new Split:**

| Field | Value |
|-------|-------|
| Network | **Base** |
| Split type | **Split V2** (supports pull/push) |
| Controller | Your 2-of-2 multisig or Zaal's wallet initially |
| Distribution type | **Pull** (recipients claim when they want — lower gas overhead) |

**Initial recipients (before first leaderboard snapshot):**

| Address | Weight | Label |
|---------|--------|-------|
| Zaal's wallet | 50% | Placeholder until leaderboard snapshot |
| Aziz's wallet | 50% | Placeholder until leaderboard snapshot |

> First leaderboard snapshot after launch updates this to real participant weights.

**After creating:** Copy the Split contract address (e.g. `0xABC...`). This is what Clanker's fee recipient field gets.

---

## Step 2: Token image

**Brief for image generation:**

```
Bold, minimal, dark background. The word "ZOOSTR" in heavy all-caps block font, 
centered. Color: vibrant amber/gold gradient (#fbbf24 → #f59e0b). 
Underneath in smaller text: "ZABAL × BOOSTR". 
Subtle purple glow/halo around the text (ZAO violet, #7c3aed). 
Background: near-black (#0a0a14). 
Aspect ratio: 1:1 (1000×1000px). 
Vibe: premium creator token, not meme. Clean. No clipart, no emojis, no logos.
```

**SVG placeholder:** `public/zoostr-token-placeholder.svg` is in the repo — gold ZOOSTR wordmark on dark background, purple glow, "ZABAL × BOOSTR" subtitle, 1000×1000. Convert to PNG with:
```bash
# requires Inkscape or rsvg-convert
rsvg-convert -w 1000 -h 1000 public/zoostr-token-placeholder.svg > public/zoostr-token.png
# or open in browser, screenshot, crop to 1000×1000
```

Deliver as a square PNG, 1000×1000px minimum.

---

## Step 3: Clanker.world deploy config

**URL:** https://clanker.world/clanker

Fill in these exact values:

| Field | Value |
|-------|-------|
| **Token Name** | `Zoostr` |
| **Symbol** | `ZOOSTR` |
| **Description** | `Back the empire. 50% of every $ZOOSTR trading fee goes to the Boostr leaderboard by points — the community that built ZABAL earns from every trade. No token required to boost. A Sparkz launch.` |
| **Image** | Upload the 1000×1000 PNG from Step 2 |
| **Fee Tier** | **1%** (select 1% in the fee tier dropdown) |
| **Fee Recipient** | `[0xSplits contract address from Step 1]` |
| **Cast from** | Deployer's Farcaster account (@cashlessman.eth or @zaal) |

> **Do not click "Deploy" until Step 1 (Splits address) and Step 2 (image) are confirmed.**

---

## Step 4: Vault / ZAO locked stake

> ZAO takes a locked token STAKE, not a fee slice. (Aligned with $IMAN precedent.)

After the token is deployed:
1. ZAO's wallet address: TBD (Zaal provides)
2. ZAO receives X% of initial supply (see Decision #3 above)
3. Tokens are locked for 12 months with a 3-month cliff
4. Lock mechanism: use a simple time-lock contract, or a trusted manual lock (announce publicly)

This allocation comes from the creator's portion of initial supply — Clanker handles the initial liquidity provision, so the "vault" is a separate transfer to ZAO's lock contract.

---

## Step 5: Immediate post-deploy actions

Immediately after the token deploys:

1. **Pin the contract address** — share in Farcaster cast, update Zoostr site with the real token address
2. **First leaderboard snapshot** — run the snapshot within 24h of deploy, compute weights, update the 0xSplits contract
3. **Verify the split** — confirm fee recipient on the token matches the Splits address (readable on basescan)
4. **Announce** — run `npm run receipt` for live numbers, then post the 5-cast Farcaster thread (see `docs/launch-thread-farcaster.md`) and X thread (`docs/launch-thread-x.md`)
5. **ZAO transfer** — send ZAO's stake allocation to the lock address

---

## Step 6: Ongoing operations

| Task | Cadence | Who | How |
|------|---------|-----|-----|
| Leaderboard snapshot | Weekly (Monday 00:00 UTC) | ZOL agent (review-gated) | Fetch `/api/zabaal/stats`, compute weights, call `updateSplit()` |
| Fee distribution | Continuous (pull model) | Recipients self-serve | Call `distributeERC20()` on Splits or use the Splits UI |
| Distribution receipt | Weekly, same day | ZOL agent | `npm run receipt` → copy output → post to Farcaster (review-gated) |
| Split audit | Monthly | Zaal | Verify on-chain weights match leaderboard snapshot |

---

## Open questions (resolve before deploy)

- [ ] Deployer confirmed (Aziz or Zaal)?
- [ ] ZAO wallet address for locked stake?
- [ ] ZAO lock size (recommendation: 5%)?
- [ ] 0xSplits controller wallet(s)?
- [ ] Token image approved?
- [ ] Distribution cadence confirmed (recommendation: weekly)?
- [ ] Minimum points threshold confirmed (recommendation: 10)?

---

*Prepared by ZOL / Sparkz loop · 2026-07-17 · Everything up to the deploy is agent-built; the deploy itself is one human click.*
