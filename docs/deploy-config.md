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
| 22 | `feat/error-boundary` | Global error.tsx boundary + leaderboard loading skeleton (animate-pulse) |
| 23 | `feat/receipt-loading` | /receipt page loading skeleton (animate-pulse) — nav, stats, pool, distribution table |
| 24 | `feat/homepage-loading` | Homepage + /launch loading skeletons (animate-pulse) — nav, hero, leaderboard rows; launch form with 5-step progress |
| 25 | `feat/zol-loading` | /zol Meme Engine admin loading skeleton (animate-pulse) — empire stats, top earners, 3 draft variant cards |
| 26 | `feat/launch-docs-update` | Launch threads: [ALL_TIME_COUNT] placeholder for hardcoded "34"; sparkz-for-creators.md: real 3-question advisor flow + creator-first framing |
| 27 | `feat/tokenomics-default-fix` | tokenomics-draft.md: Sparkz default corrected to 97/2/1 creator-first; full row breakdown vs Zoostr's 50/25/25 |
| 28 | `feat/launch-form-creator-first` | /launch form: fix community share range (1–80%, was 25–75%); creator-first default (97/2/1); advisory copy rewritten to explain progression |
| 29 | `feat/ops-human-gate-fix` | deploy-config.md ops table: split "Leaderboard snapshot" row so ZOL generates payload only; separate "Split weights update" row puts updateSplit() call on Zaal (human-only on-chain action) |
| 30 | `feat/leaderboard-claims-copy` | Leaderboard page: fix "no claiming" copy — Pull split model requires claiming; changed to "Claim your share anytime at app.splits.org — funds accumulate, no deadline" |
| 31 | `feat/sparkz-for-creators-accuracy` | sparkz-for-creators.md: fix two inaccuracies — (1) "50% of that fee" in problem/solution frame hardcoded Zoostr's split as default; (2) "split updates automatically" implied on-chain automation; both now accurate |
| 32 | `feat/no-claiming-docs-fix` | Fix "no claiming" in four places: tokenomics-draft.md Option A pro (Pull model does require claiming), launcher.ts cast template, zol/page.tsx v2 draft, launch-thread-farcaster.md cast 3 |
| 33 | `feat/no-claiming-xthread-fix` | X thread + meme-engine.ts: "No claiming required" + "fees land in your wallet passively" (X post 1+2) and meme-engine.ts v2 draft — all fixed to "claim at splits.org" |
| 34 | `feat/tokenomics-why-fix` | tokenomics-draft.md decision rationale: "fees land in your wallet on cadence, no action required" contradicted Pull model; rewritten to describe Pull claiming accurately |
| 35 | `feat/readme-claims-fix` | README.md: "automatically, forever. No claiming." → accurate Pull split claiming language |
| 36 | `feat/homepage-hero-claiming-fix` | Homepage hero + farcaster cast 1: "No claiming. It just lands." → "Claim your share at splits.org"; launch-thread-farcaster.md cast 1 same fix |
| 37 | `feat/homepage-collectables-v2` | Homepage collectables teaser: change present tense ("mints", "Boosters earn collectables") to future tense + "(v2)" label — collectables launch alongside first split distribution, not at token launch |
| 38 | `feat/meme-engine-milestone-fix` | snapshot-split.ts: add `_stats` field to splits-update.json (empire totals + top contributor FID/username) so meme-engine detect-moment can compare week-over-week; meme-engine.ts: add new-top detection + new-top cast variants |
| 39 | `feat/ops-table-detect-moment-order` | deploy-config.md Step 6: add detect-moment as explicit weekly step; document critical order constraint — detect-moment MUST run before snapshot (snapshot overwrites _stats) |
| 40 | `feat/receipt-community-share-env` | receipt-cast.ts + receipt/page.tsx: COMMUNITY_SHARE hardcoded at 50% — wrong at launch (97/2/1 = 1% community); add NEXT_PUBLIC_COMMUNITY_SHARE_PCT env var; deploy-config.md: add env var entry |
| 41 | `feat/community-share-consistency` | EarningsCalc.tsx + zol/page.tsx + meme-engine.ts: same 50% hardcoding fixed; consolidated to NEXT_PUBLIC_COMMUNITY_SHARE_PCT for pages, COMMUNITY_PCT for CLI scripts |
| 42 | `feat/launch-page-auto-distribution-fix` | /launch page: "✓ Weekly auto-distribution" → "✓ Weekly split updates — claim at splits.org" (Pull model) |
| 43 | `feat/deploy-config-pr-table-update` | deploy-config.md: update PR merge table 38→42 rows; "After all 38 PRs" → "After all 42 PRs" |
| 44 | `feat/gitignore-meme-engine-outputs` | .gitignore: add meme-engine-draft-*.json/md, remix-rewards-*.json, last-cast.json — runtime outputs with FID/username/cast data |
| 45 | `feat/community-share-pct-zoostr-correction` | Fix COMMUNITY_SHARE_PCT across 6 files — comment said "set 1 at launch (97/2/1)" but Zoostr launches at 50% community pool from day 1 (50/25/25 split) |
| 46 | `feat/launch-form-cast-claiming-fix` | LaunchForm.tsx: "weekly distribution via 0xSplits" → "weekly split updates — claim at splits.org"; receipt/page.tsx: remove stale "starts at 1%" note |
| 47 | `feat/deploy-config-pr-table-46` | deploy-config.md: update PR merge table 42→46 rows; "After all 42 PRs" → "After all 46 PRs" |
| 48 | `feat/earnings-calc-subtitle-claiming-fix` | EarningsCalc.tsx subtitle: "weekly distribution" → "claim at splits.org" (Pull model) |
| 49 | `feat/deploy-config-pr-table-48` | deploy-config.md: update PR merge table 46→48 rows; "After all 46 PRs" → "After all 48 PRs" |
| 50 | `feat/launch-thread-claiming-fix` | launch-thread-farcaster.md cast 3: "splits.org distributes by leaderboard points" → "fee pool allocated by leaderboard points" (Pull model) |
| 51 | `feat/deploy-config-pr-table-50` | deploy-config.md: update PR merge table 48→50 rows; "After all 48 PRs" → "After all 50 PRs" |
| 52 | `feat/homepage-collectables-claiming-fix` | homepage page.tsx: FeeBar "distributed by points" → "allocated by points — claim at splits.org"; collectables body "weekly fee distribution" → "weekly snapshot"; "payout" → "share"; "first split distribution" → "first split update" |
| 53 | `feat/deploy-config-pr-table-52` | deploy-config.md: update PR merge table 50→52 rows; "After all 50 PRs" → "After all 52 PRs" |
| 54 | `feat/sparkz-for-creators-claiming-fix` | sparkz-for-creators.md: "Sparkz wires it there weekly" → "allocates it weekly by points"; "No claims, no lockups" → "Contributors claim at splits.org"; section 1 "flow through" → "accumulate...claim at splits.org" |
| 55 | `feat/deploy-config-pr-table-54` | deploy-config.md: update PR merge table 52→54 rows; "After all 52 PRs" → "After all 54 PRs" |
| 56 | `feat/x-thread-claiming-fix` | launch-thread-x.md Post 2: "splits.org distributes by leaderboard points" → "fee pool allocated by leaderboard points" — Pull model accuracy (mirrors PR #50 Farcaster thread fix) |
| 57 | `feat/deploy-config-pr-table-56` | deploy-config.md: update PR merge table 54→56 rows; "After all 54 PRs" → "After all 56 PRs" |
| 58 | `feat/receipt-cast-community-pct-fix` | receipt-cast.ts: COMMUNITY_PCT comment "At launch (97/2/1): set to 1" — Zoostr starts at 50% from day 1; warning text corrected |
| 59 | `feat/deploy-config-pr-table-58` | deploy-config.md: update PR merge table 56→58 rows; "After all 56 PRs" → "After all 58 PRs" |
| 60 | `feat/env-example-and-earnings-calc-fix` | .env.example: add 8 missing env vars (SPLITS_ADDRESS, COMMUNITY_SHARE_PCT, SPARKZ_URL, SIGNER_UUID, ZOL_ASSUMED_VOLUME, Stripe, Resend, ZAO_NOTIFY); EarningsCalc COMMUNITY_SHARE_PCT comment: "set to 1 at launch" → Zoostr 50% day-1 |
| 61 | `feat/deploy-config-pr-table-60` | deploy-config.md: update PR merge table 58→60 rows; "After all 58 PRs" → "After all 60 PRs" |
| 62 | `feat/deploy-config-community-pct-launch-fix` | deploy-config.md Vercel vars: COMMUNITY_SHARE_PCT value "1 at launch" → "50 (Zoostr launches at 50/25/25)"; note + CLI example corrected |
| 63 | `feat/deploy-config-site-verification-checklist` | deploy-config.md: add "Verify Zoostr website" checklist (13 items covering all routes, OG, Frame, copy, earnings sanity) |
| 64 | `feat/deploy-config-pr-table-62` | deploy-config.md: update PR merge table 60→63 rows; "After all 60 PRs" → "After all 63 PRs" |
| 65 | `feat/meme-engine-milestone-drafts` | meme-engine.ts: milestone-specific cast drafts for likes + contributor milestones (previously fell back to generic weekly-receipt drafts) |
| 66 | `feat/deploy-config-pr-table-64` | deploy-config.md: update PR merge table 63→65 rows; "After all 63 PRs" → "After all 65 PRs" |
| 67 | `feat/deploy-config-pr-table-66` | deploy-config.md: update PR merge table 65→66 rows; "After all 65 PRs" → "After all 66 PRs" |
| 68 | `feat/deploy-config-pr-table-67` | deploy-config.md: update PR merge table 66→68 rows; "After all 66 PRs" → "After all 68 PRs" |
| 69 | `feat/internal-links-link-component` | page.tsx + receipt/page.tsx: replace native `<a>` with Next.js `<Link>` for all internal routes (5 occurrences); add Link import to page.tsx |
| 70 | `feat/deploy-config-pr-table-69` | deploy-config.md: update PR merge table 68→69 rows; "After all 68 PRs" → "After all 70 PRs" |
| 71 | `feat/sparkz-for-creators-pull-model-fix` | sparkz-for-creators.md: 4 pull-model accuracy fixes — "wires it there weekly"→"updates the 0xSplits allocation weekly"; "No claims"→"Recipients claim at splits.org"; "payouts flow through"→"Fees accumulate... claim at splits.org"; "Community payout/Weekly"→"Community allocation/Weekly snapshot — claim at splits.org" |
| 72 | `feat/deploy-config-pr-table-71` | deploy-config.md: update PR merge table 70→71 rows; "After all 70 PRs" → "After all 72 PRs" |
| 73 | `feat/zol-draft-v3-pull-model-fix` | zol/page.tsx: v3 anthem draft "flows to them" → "flows into the pool — theirs to claim at splits.org"; matches v2's pull-model qualifier added in PR #45 |
| 74 | `feat/deploy-config-pr-table-73` | deploy-config.md: update PR merge table 72→73 rows; "After all 72 PRs" → "After all 74 PRs" |
| 75 | `feat/meme-engine-cast-pull-model-sweep` | meme-engine.ts: add "claim at splits.org" pull-model qualifier to 4 cast draft variants (v3, mv3, cv2, ntv2) missed in PR #45 |
| 76 | `feat/earnings-calc-cast-pull-model-fix` | EarningsCalc.tsx: leaderboard share cast "pays its builders" → "backs its builders — claim at splits.org" |
| 77 | `feat/deploy-config-pr-table-75` | deploy-config.md: update PR merge table 74→76 rows; "After all 74 PRs" → "After all 77 PRs" |
| 78 | `feat/homepage-pull-model-fix` | page.tsx: hero "straight to the leaderboard" → "into the leaderboard pool"; collectables teaser "every weekly fee distribution" → "every weekly snapshot" |
| 79 | `feat/deploy-config-pr-table-78` | deploy-config.md: update PR merge table 77→78 rows; "After all 77 PRs" → "After all 79 PRs" |
| 80 | `feat/meme-engine-mv2-pull-model-fix` | meme-engine.ts: mv2 cast "flows to the leaderboard" → "flows into the leaderboard pool — claim yours at splits.org" |
| 81 | `feat/deploy-config-pr-table-80` | deploy-config.md: update PR merge table 79→80 rows; "After all 79 PRs" → "After all 81 PRs" |
| 82 | `feat/receipt-community-share-note-fix` | receipt/page.tsx: remove inaccurate "1% at launch" note — Zoostr launches at 50% community share from day 1, not 1% |
| 83 | `feat/deploy-config-pr-table-82` | deploy-config.md: update PR merge table 81→82 rows; "After all 81 PRs" → "After all 83 PRs" |
| 84 | `feat/homepage-pr52-remaining-fixes` | page.tsx: FeeBar note 'distributed by points' → 'allocated by points — claim at splits.org'; collectables body 'your payout' → 'your share'; 'first split distribution' → 'first split update' |
| 85 | `feat/deploy-config-pr-table-84` | deploy-config.md: update PR merge table 83→84 rows; "After all 83 PRs" → "After all 85 PRs" |
| 86 | `feat/meme-engine-community-pct-comment-fix` | meme-engine.ts: COMMUNITY_PCT comment 'set to 1 at launch (97/2/1)' → 'Zoostr launches at 50 (50/25/25); Sparkz default is 1 (97/2/1)' |
| 87 | `feat/deploy-config-pr-table-86` | deploy-config.md: update PR merge table 85→86 rows; "After all 85 PRs" → "After all 87 PRs" |
| 88 | `feat/sparkz-for-creators-zao-stake-accuracy` | sparkz-for-creators.md: 'ZAO stake is set automatically' → accurate post-deploy transfer note |
| 89 | `feat/deploy-config-pr-table-88` | deploy-config.md: update PR merge table 87→88 rows; "After all 87 PRs" → "After all 89 PRs" |
| 90 | `feat/launch-threads-distributes-fix` | launch-thread-farcaster.md cast 3 + launch-thread-x.md post 2: 'splits.org distributes by leaderboard points' → 'fee pool allocated by leaderboard points — weekly snapshot' |
| 91 | `feat/deploy-config-pr-table-90` | deploy-config.md: update PR merge table 89→90 rows; "After all 89 PRs" → "After all 91 PRs" |
| 92 | `feat/readme-env-vars-table-update` | README.md: add NEXT_PUBLIC_COMMUNITY_SHARE_PCT + ZOL_ASSUMED_VOLUME to env vars table (both missing) |
| 93 | `feat/deploy-config-pr-table-92` | deploy-config.md: update PR merge table 91→92 rows; "After all 91 PRs" → "After all 93 PRs" |
| 94 | `feat/snapshot-split-community-pct-parameterize` | snapshot-split.ts: add COMMUNITY_PCT constant (default 50); use it in receipt label text instead of hardcoded '50%' |
| 95 | `feat/deploy-config-pr-table-94` | deploy-config.md: update PR merge table 93→94 rows; "After all 93 PRs" → "After all 95 PRs" |

After all 95 PRs are merged to `main`:
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
| `NEXT_PUBLIC_COMMUNITY_SHARE_PCT` | `50` (Zoostr launches at 50/25/25) | Leaderboard earnings calc, receipt page, ZOL cast drafts — must match the live on-chain split |

The site deploys and runs in pre-token mode without `NEXT_PUBLIC_TOKEN_ADDRESS`.
Set that env var after the Clanker deploy and redeploy Vercel.

> **NEXT_PUBLIC_COMMUNITY_SHARE_PCT note:** Zoostr launches at **50% community** (50/25/25 split) from day 1 — set this to `50` before the first deploy. If the on-chain split ever changes, update this Vercel env var to match and redeploy. Otherwise the leaderboard and receipt page show wrong earnings.
>
> For CLI scripts (`npm run receipt`, `npm run detect-moment`), use the local `COMMUNITY_PCT` env var: `COMMUNITY_PCT=50 npm run receipt`.

---

## Verify Zoostr website (after Vercel deploys, before token launch)

- [ ] `https://zoostr.xyz` — hero loads, leaderboard visible, top-3 podium renders
- [ ] `https://zoostr.xyz` — empire stats (active contributors, total likes) show live numbers
- [ ] `https://zoostr.xyz/leaderboard` — full table loads with avatars and projected earnings
- [ ] `https://zoostr.xyz/receipt` — receipt page loads; projected earnings match leaderboard
- [ ] `https://zoostr.xyz/receipt` — Farcaster Frame tags present (paste URL in Warpcast composer → preview renders with "Share leaderboard" CTA)
- [ ] `https://zoostr.xyz/launch` — launch info page loads; tokenomics section visible; links to cashlessman + Zaal visible
- [ ] `https://zoostr.xyz/sitemap.xml` — 4 URLs listed
- [ ] `https://zoostr.xyz` — OG image renders (paste in Warpcast → preview shows ZOOSTR wordmark)
- [ ] `https://zoostr.xyz` — "Claim your share at splits.org" copy visible; no "automatic / no claiming" language
- [ ] `COMMUNITY_SHARE_PCT` sanity check: projected weekly earnings for top booster look plausible at assumed volume (run `npm run receipt` to preview before posting)

After token launch (once `NEXT_PUBLIC_TOKEN_ADDRESS` is set):
- [ ] "Token Live" green banner appears on homepage
- [ ] Basescan link in banner goes to the correct contract
- [ ] `https://zoostr.xyz/receipt` — earnings projections reflect live on-chain split

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

### Weekly ops order (order matters — do not swap steps 1 and 3)

| # | Task | Who | How |
|---|------|-----|-----|
| 1 | **Detect moment** (Monday 00:00 UTC) | ZOL agent | `npm run detect-moment` — reads last week's `_stats` from `splits-update.json`, fetches fresh Boostr stats, detects milestones, writes `meme-engine-draft-YYYY-MM-DD.md` |
| 2 | **Approve + post cast** | Zaal (human) | Review draft → `npm run post-cast -- --approve N` (variants 1/2/3) |
| 3 | **Leaderboard snapshot** (same day, after step 2) | ZOL agent | `npm run snapshot` — fetches fresh weights, **overwrites** `splits-update.json` (including `_stats`) |
| 4 | **Split weights update** | Zaal (human) | Review `splits-update.json` → app.splits.org → Update recipients → verify on basescan |
| 5 | **Distribution receipt** | ZOL agent | `npm run receipt` → copy output → post to Farcaster (review-gated) |

> **Why order matters:** `detect-moment` compares fresh stats against `splits-update.json._stats` (last week's baseline). Running `snapshot` first overwrites `_stats` with the current week — so detect-moment would compare current vs. current and detect no milestones.

### Other recurring tasks

| Task | Cadence | Who | How |
|------|---------|-----|-----|
| Fee distribution | Continuous (pull model) | Recipients self-serve | Call `distributeERC20()` on Splits or use the Splits UI at app.splits.org |
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
