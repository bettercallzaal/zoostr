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
| 96 | `feat/weekly-snapshot-language-fix` | EarningsCalc.tsx + LaunchForm.tsx + receipt/page.tsx: 'weekly distribution' → 'weekly snapshot'; LaunchForm cast draft adds 'claim at splits.org' |
| 97 | `feat/deploy-config-pr-table-96` | deploy-config.md: update PR merge table 95→96 rows; "After all 95 PRs" → "After all 97 PRs" |
| 98 | `feat/receipt-og-url-snapshot-fix` | receipt/page.tsx: fix URL-encoded OG image sub param — 'Live+leaderboard+distribution' → 'Live+leaderboard+snapshot' (3 occurrences missed by PR #96) |
| 99 | `feat/deploy-config-pr-table-98` | deploy-config.md: update PR merge table 97→98 rows; "After all 97 PRs" → "After all 99 PRs" |
| 100 | `feat/receipt-allocation-weights-label` | receipt/page.tsx: 'Distribution weights' → 'Allocation weights' table header (pull-model consistency) |
| 101 | `feat/deploy-config-pr-table-100` | deploy-config.md: update PR merge table 99→100 rows; "After all 99 PRs" → "After all 101 PRs" |
| 102 | `feat/receipt-cast-claim-instruction` | scripts/receipt-cast.ts cast 2: add 'claim your share → splits.org (accumulates, no deadline)' |
| 103 | `feat/deploy-config-pr-table-102` | deploy-config.md: update PR merge table 101→102 rows; "After all 101 PRs" → "After all 103 PRs" |
| 104 | `feat/snapshot-split-receipt-accuracy` | snapshot-split.ts receipt: 'Distribution weights' → 'Allocation weights'; add 'Claim your share: splits.org' section |
| 105 | `feat/deploy-config-pr-table-104` | deploy-config.md: update PR merge table 103→104 rows; "After all 103 PRs" → "After all 105 PRs" |
| 106 | `feat/sparkz-for-creators-fee-allocation` | docs/sparkz-for-creators.md: heading + body 'fee distribution' → 'fee allocation' |
| 107 | `feat/deploy-config-pr-table-106` | deploy-config.md: update PR merge table 105→106 rows; "After all 105 PRs" → "After all 107 PRs" |
| 108 | `feat/readme-fee-allocation-accuracy` | README.md: 'fee distribution to' → 'fee allocation for'; 'goes to' → 'accumulates for' |
| 109 | `feat/deploy-config-pr-table-108` | deploy-config.md: update PR merge table 107→108 rows; "After all 107 PRs" → "After all 109 PRs" |
| 110 | `feat/launcher-discord-claim-instruction` | launcher.ts: Discord announcement template — add 'claim at splits.org' instruction |
| 111 | `feat/deploy-config-pr-table-110` | deploy-config.md: update PR merge table 109→110 rows; "After all 109 PRs" → "After all 111 PRs" |
| 112 | `feat/launcher-casts-claim-instruction` | launcher.ts: add 'claim at splits.org' to cast 2 + cast 3 Farcaster templates |
| 113 | `feat/deploy-config-pr-table-112` | deploy-config.md: update PR merge table 111→112 rows; "After all 111 PRs" → "After all 113 PRs" |
| 114 | `feat/receipt-community-share-comment-fix` | receipt/page.tsx: COMMUNITY_SHARE_PCT comment 'At launch (97/2/1): 1' → Zoostr-specific (launches at 50 from day 1) |
| 115 | `feat/deploy-config-pr-table-114` | deploy-config.md: update PR merge table 113→114 rows; "After all 113 PRs" → "After all 115 PRs" |
| 116 | `feat/receipt-og-sub-snapshot-restore` | receipt/page.tsx: re-apply OG image sub 'distribution' → 'snapshot' in 3 URLs (lost in PR #100 rebase) |
| 117 | `feat/deploy-config-pr-table-116` | deploy-config.md: update PR merge table 115→116 rows; "After all 115 PRs" → "After all 117 PRs" |
| 118 | `feat/boostr-payout-comment-fix` | boostr.ts: 'payout eligibility' + 'payout denominator' → 'allocation' in code comments |
| 119 | `feat/deploy-config-pr-table-118` | deploy-config.md: update PR merge table 117→118 rows; "After all 117 PRs" → "After all 119 PRs" |
| 120 | `feat/readme-framing-fee-allocation` | README.md: 'Fee distribution is the proof' → 'Fee allocation is the proof' — terminology consistency |
| 121 | `feat/deploy-config-pr-table-120` | deploy-config.md: update PR merge table 119→120 rows; "After all 119 PRs" → "After all 121 PRs" |
| 122 | `feat/tokenomics-fee-allocation-heading` | tokenomics-draft.md: 'Fee Distribution: Design Options' → 'Fee Allocation'; 'Distribution cadence' → 'Snapshot cadence' |
| 123 | `feat/deploy-config-pr-table-122` | deploy-config.md: update PR merge table 121→122 rows; "After all 121 PRs" → "After all 123 PRs" |
| 124 | `feat/tokenomics-configurable-fee-allocation` | tokenomics-draft.md: 'configurable fee distributions' → 'configurable fee allocation' in pattern description |
| 125 | `feat/deploy-config-pr-table-124` | deploy-config.md: update PR merge table 123→124 rows; "After all 123 PRs" → "After all 125 PRs" |
| 126 | `feat/receipt-og-sub-distribution-snapshot-fix` | receipt/page.tsx: OG image sub param 'distribution' → 'snapshot' (3 occurrences — openGraph, twitter, fc:frame:image) |
| 127 | `feat/deploy-config-pr-table-126` | deploy-config.md: update PR merge table 125→126 rows; "After all 125 PRs" → "After all 127 PRs" |
| 128 | `feat/snapshot-tokenomics-distribution-fixes` | snapshot-split.ts + tokenomics-draft.md: 'distribution receipt' → 'allocation receipt'; 'weekly distribution is logged' → 'weekly snapshot update is logged'; 'distribution weight' → 'allocation weight' |
| 129 | `feat/deploy-config-pr-table-128` | deploy-config.md: update PR merge table 127→128 rows; "After all 127 PRs" → "After all 129 PRs" |
| 130 | `feat/readme-distribution-labels-fix` | README.md: '0xSplits distribution' → '0xSplits integration'; 'Weekly distribution snapshot' → 'Weekly allocation snapshot' |
| 131 | `feat/deploy-config-pr-table-130` | deploy-config.md: update PR merge table 129→130 rows; "After all 129 PRs" → "After all 131 PRs" |
| 132 | `feat/deploy-config-fee-claiming-ops-label` | deploy-config.md ops table: 'Fee distribution' → 'Fee claiming'; expand How column with accurate 2-step distribute+withdraw flow |
| 133 | `feat/deploy-config-pr-table-132` | deploy-config.md: update PR merge table 131→132 rows; "After all 131 PRs" → "After all 133 PRs" |
| 134 | `feat/launch-frame-button-target-fix` | launch/page.tsx: Frame button 2 target 'sparkz.xyz/launches/zoostr' → 'zoostr.xyz/leaderboard' (label mismatch fix) |
| 135 | `feat/deploy-config-pr-table-134` | deploy-config.md: update PR merge table 133→134 rows; "After all 133 PRs" → "After all 135 PRs" |
| 136 | `feat/receipt-community-share-comment-zoostr-fix` | receipt/page.tsx: COMMUNITY_SHARE_PCT comment 'At launch (97/2/1): 1' → Zoostr-specific (launches at 50 from day 1) |
| 137 | `feat/deploy-config-pr-table-136` | deploy-config.md: update PR merge table 135→136 rows; "After all 135 PRs" → "After all 137 PRs" |
| 138 | `feat/gitignore-meme-engine-outputs-fix` | .gitignore: add meme-engine-draft-*.json/md, remix-rewards-*.json, last-cast.json (runtime outputs with user data) |
| 139 | `feat/deploy-config-pr-table-138` | deploy-config.md: update PR merge table 137→138 rows; "After all 137 PRs" → "After all 139 PRs" |
| 140 | `feat/deploy-config-snapshot-cadence-fix` | deploy-config.md: open questions 'Distribution cadence' → 'Snapshot cadence'; add /zol verification checklist item |
| 141 | `feat/deploy-config-pr-table-140` | deploy-config.md: update PR merge table 139→140 rows; "After all 139 PRs" → "After all 141 PRs" |
| 142 | `feat/deploy-config-preflight-snapshot-cadence` | deploy-config.md: pre-flight table row 7 'Distribution cadence' → 'Snapshot cadence' (missed by PRs #122 and #140) |
| 143 | `feat/deploy-config-pr-table-142` | deploy-config.md: update PR merge table 141→142 rows; "After all 141 PRs" → "After all 143 PRs" |
| 144 | `feat/tokenomics-dust-distributions-fix` | tokenomics-draft.md + deploy-config.md: 'dust distributions' → 'dust-level claims'; 'large distributions' → 'large recipient counts' |
| 145 | `feat/deploy-config-pr-table-144` | deploy-config.md: update PR merge table 143→144 rows; "After all 143 PRs" → "After all 145 PRs" |
| 146 | `feat/zol-loop-guide-accuracy` | /zol loop guide step 1: distinguish detect-moment CLI from /zol page draft generation |
| 147 | `feat/deploy-config-pr-table-146` | deploy-config.md: update PR merge table 145→146 rows; "After all 145 PRs" → "After all 147 PRs" |
| 148 | `feat/deploy-config-launch-checklist-fix` | deploy-config.md: verify checklist /launch item — split into /#token (token info + links) and /launch (Launcher wizard) |
| 149 | `feat/deploy-config-pr-table-148` | deploy-config.md: update PR merge table 147→148 rows; "After all 147 PRs" → "After all 149 PRs" |
| 150 | `feat/deploy-config-zol-volume-env-var` | deploy-config.md: add ZOL_ASSUMED_VOLUME to Vercel env vars table (in README but missing here) |
| 151 | `feat/deploy-config-pr-table-150` | deploy-config.md: update PR merge table 149→150 rows; "After all 149 PRs" → "After all 151 PRs" |
| 152 | `feat/deploy-config-ops-receipt-label` | deploy-config.md: ops table step 5 'Distribution receipt' → 'Weekly receipt cast' |
| 153 | `feat/deploy-config-pr-table-152` | deploy-config.md: update PR merge table 151→152 rows; "After all 151 PRs" → "After all 153 PRs" |
| 154 | `feat/zoostr-v1-scope-doc-fix` | docs: add V1-SCOPE.md — locked scope doc (pages, scripts, economics, Meme Engine loop, deferred features, pre-deploy checklist) |
| 155 | `feat/deploy-config-pr-table-155` | deploy-config.md: update PR merge table 153→155 rows; "After all 153 PRs" → "After all 155 PRs" |
| 156 | `feat/meme-engine-eligible-pct-fix` | meme-engine.ts: filter eligible contributors + use eligibleTotal denominator for pct/earnings in cast drafts (matches snapshot-split.ts allocation logic) |
| 157 | `feat/deploy-config-pr-table-157` | deploy-config.md: update PR merge table 155→156 rows; "After all 155 PRs" → "After all 157 PRs" |
| 158 | `feat/receipt-cast-eligible-pct-fix` | receipt-cast.ts: filter eligible contributors + use eligible total for pct/earnings (matches meme-engine.ts fix in PR #156) |
| 159 | `feat/deploy-config-pr-table-159` | deploy-config.md: update PR merge table 157→158 rows; "After all 157 PRs" → "After all 159 PRs" |
| 160 | `feat/launch-advisor-zoostr-framing-fix` | LaunchForm.tsx: advisor tip 'Zoostr started at 1% and grew to 50%' → accurate 'launched at 50% because community was proven before token' |
| 161 | `feat/deploy-config-pr-table-161` | deploy-config.md: update PR merge table 159→160 rows; "After all 159 PRs" → "After all 161 PRs" |
| 162 | `feat/zoostr-launch-split-framing-fix` | V1-SCOPE + tokenomics + sparkz-for-creators: 'evolved from 1%' → 'launches at 50%' (mirrors LaunchForm fix in PR #160) |
| 163 | `feat/deploy-config-pr-table-163` | deploy-config.md: update PR merge table 161→162 rows; "After all 161 PRs" → "After all 163 PRs" |
| 164 | `feat/leaderboard-table-ineligible-fee-share` | LeaderboardTable: show '—' for ineligible contributors; LiveLeaderboard podium uses eligible top3 |
| 165 | `feat/deploy-config-pr-table-165` | deploy-config.md: update PR merge table 163→164 rows; "After all 163 PRs" → "After all 165 PRs" |
| 166 | `feat/sparkz-xyz-subpage-links-fix` | page.tsx: sparkz.xyz/collectables + /circles → sparkz.xyz (subpages don't exist yet; would 404 on launch) |
| 167 | `feat/deploy-config-pr-table-167` | deploy-config.md: update PR merge table 165→166 rows; "After all 165 PRs" → "After all 167 PRs" |
| 168 | `feat/og-route-eligible-filter-fix` | api/og/route.tsx: filter ineligible contributors (zabalEnabled-only → +MIN_POINTS ≥ 10); OG podium and % fee share now match eligibility criteria |
| 169 | `feat/deploy-config-pr-table-169` | deploy-config.md: update PR merge table 167→168 rows; "After all 167 PRs" → "After all 169 PRs" |
| 170 | `feat/og-route-title-sub-support` | api/og/route.tsx: add title/sub URL param support — render branded text card for /receipt and /launch; podium unchanged when no params |
| 171 | `feat/deploy-config-pr-table-171` | deploy-config.md: update PR merge table 169→170 rows; "After all 169 PRs" → "After all 171 PRs" |
| 172 | `feat/advisor-page` | /advisor page: 3-question microflow (solo/collab/collective/crowdfund × new/growing/proven × later/now/never) → recommended split + token timing badge + weekly pool estimate; sitemap, footer, launch page nudge |
| 173 | `feat/deploy-config-pr-table-173` | deploy-config.md: update PR merge table 171-172 rows; "After all 171 PRs" to "After all 173 PRs" |

After all 173 PRs are merged to `main`:
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
| `ZOL_ASSUMED_VOLUME` | `10000` (optional) | /zol admin page earnings projection; defaults to $10k/day if not set |

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
- [ ] `https://zoostr.xyz/#token` — token launch info section visible; links to @cashlessman.eth + @zaal correct; "Launching soon" banner shown (pre-deploy)
- [ ] `https://zoostr.xyz/launch` — Sparkz Launcher form loads; 5-step wizard navigates; export generates deploy-config.md
- [ ] `https://zoostr.xyz/zol` — ZOL admin page loads; Meme Engine draft variants render; empire stats visible
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
| 6 | **Min points threshold** | 0 / 5 / 10 pts to be in split | **10 pts** — prevents dust-level claims |
| 7 | **Snapshot cadence** | Daily / Weekly / Biweekly | **Weekly** (Monday 00:00 UTC) — simple, predictable |

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
| 5 | **Weekly receipt cast** | ZOL agent | `npm run receipt` → copy output → post to Farcaster (review-gated) |

> **Why order matters:** `detect-moment` compares fresh stats against `splits-update.json._stats` (last week's baseline). Running `snapshot` first overwrites `_stats` with the current week — so detect-moment would compare current vs. current and detect no milestones.

### Other recurring tasks

| Task | Cadence | Who | How |
|------|---------|-----|-----|
| Fee claiming | Continuous (pull model) | Recipients self-serve | Use the Splits UI at app.splits.org — distributes + withdraws in one step; or call `distributeERC20()` then `withdraw()` manually |
| Split audit | Monthly | Zaal | Verify on-chain weights match leaderboard snapshot |

---

## Open questions (resolve before deploy)

- [ ] Deployer confirmed (Aziz or Zaal)?
- [ ] ZAO wallet address for locked stake?
- [ ] ZAO lock size (recommendation: 5%)?
- [ ] 0xSplits controller wallet(s)?
- [ ] Token image approved?
- [ ] Snapshot cadence confirmed (recommendation: weekly snapshot + split update)?
- [ ] Minimum points threshold confirmed (recommendation: 10)?

---

*Prepared by ZOL / Sparkz loop · 2026-07-17 · Everything up to the deploy is agent-built; the deploy itself is one human click.*
