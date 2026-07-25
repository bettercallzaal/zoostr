# V1 SCOPE — LOCKED (Zoostr)

> This file documents the v1 build contract for zoostr.xyz.
> Anything not listed here is DEFERRED until after launch.
> The Sparkz product scope lives in the bettercallzaal/sparkz repo.

---

## What zoostr.xyz v1 includes

### Site pages (all built)
- `/` — Homepage: live leaderboard (top-3 podium + full table), empire stats, token info, tokenomics, collectables teaser, ZAO/Sparkz pitch, social links
- `/leaderboard` — Full leaderboard with earnings calculator (selectable daily volume) + claiming guide
- `/receipt` — Weekly receipt: empire stats, pool breakdown, top-15 earners by %, Farcaster Frame, share CTAs
- `/launch` — Sparkz Launcher: 5-step wizard → export deploy config + Farcaster thread + X thread

### Admin (unlisted)
- `/zol` — Meme Engine admin: empire stats, top earners, 3 draft cast variants, V1 loop guide

### Scripts (CLI, all built)
- `npm run detect-moment` — reads last week's `_stats` from `splits-update.json`, detects milestones (new top, likes threshold, contributor threshold), writes `meme-engine-draft-YYYY-MM-DD.md`
- `npm run post-cast -- --approve N` — posts approved draft variant via Neynar (human gate)
- `npm run track-remix` — scores quote-casts for 24h (recast=5, reply+likes=3+n, like=1), writes `remix-rewards-YYYY-MM-DD.json`
- `npm run snapshot` — fetches Boostr API, computes integer weights summing to 1,000,000, writes `splits-update.json` + `receipt-YYYY-MM-DD.md`
- `npm run receipt` — generates 2-cast receipt with top-5 earners and projected $/week

### Docs (all built)
- `docs/deploy-config.md` — comprehensive pre-deploy checklist, PR merge sequence, Vercel env vars, site verification checklist, deploy steps 1–6, weekly ops
- `docs/tokenomics-draft.md` — full tokenomics design doc, 0xSplits architecture rationale, open questions
- `docs/sparkz-for-creators.md` — creator pitch doc, how to apply for a Sparkz launch
- `docs/launch-thread-farcaster.md` — 5-cast launch thread template (fill in live numbers from `npm run receipt`)
- `docs/launch-thread-x.md` — 3-post X/Twitter launch thread template

### Token economics (settled)
- Split: 50% community / 25% creator / 25% treasury (Zoostr launches at 50% — community was proven before the token)
- Platform default: 97% creator / 1% community / 2% treasury (the Sparkz creator-first starting point)
- Mechanism: 0xSplits Pull model — fees accumulate in contract, recipients claim at splits.org (no deadline)
- Update cadence: weekly snapshot (Monday 00:00 UTC) with human-reviewed `updateSplit()` call
- Minimum threshold: 10 points to be eligible for split (prevents dust-level claims)

### V1 Meme Engine loop (human-in-the-loop, built)
Flag moment → draft 3 variants → human approves → post → Community Swarm remix (24h) → bonus in next snapshot

---

## What zoostr.xyz v1 DEFERS

| Feature | Why deferred |
|---------|-------------|
| ERC-1155 collectables (on-chain) | Launches alongside first split update — after token is live; spec is in the collectables teaser |
| On-chain remix rewards | Needs token + at least one split history |
| Autonomous posting | Guardrail violation — human gate always required in v1 |
| Fiat fan backing (/back) | Lives in sparkz.xyz/back; Zoostr links to Boostr for the pre-token engagement path |
| Direct Stripe integration | Not needed for Zoostr v1 — Boostr handles fan engagement |

---

## Pre-deploy human actions (Zaal's responsibility)

1. Deploy 0xSplits contract on Base → get address for `NEXT_PUBLIC_SPLITS_ADDRESS`
2. Deploy ZOOSTR token on clanker.world (Step 3 in deploy-config.md)
3. Transfer ZAO stake allocation to lock contract (Step 4)
4. Set Vercel env vars (see deploy-config.md § Vercel environment variables)
5. Verify site post-deploy (see deploy-config.md § Verify Zoostr website)
6. Post launch threads (after `npm run receipt` for live numbers)

---

## The rule

> **ZOL drafts. Zaal approves. No agent deploys on-chain, signs, or moves funds.**

Any PR that adds autonomous on-chain actions violates v1 scope and must be rejected.

---

*Last updated: 2026-07-24 · Locked — additions require Zaal sign-off*
