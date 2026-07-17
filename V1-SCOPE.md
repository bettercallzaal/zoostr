# V1 SCOPE — LOCKED

> This file is the build contract. Build to this. Not the full 3-in-1 spec.
> Anything not on this list is DEFERRED until v1 ships and earns the right to grow.

---

## V1 = Zoostr

The first Sparkz launch. ZABAL × Boostr. A Creator Coin for the community that already built the empire.

---

## What v1 includes

### 1. Zoostr as a Creator Coin
- Token: ZOOSTR, deployed on Clanker v4 (1% fee tier)
- Fee recipient: a 0xSplits contract (NOT a personal wallet)
- Leaderboard → split weights → weekly on-chain update
- Human deploys on clanker.world. Agent prepares everything. One click.

### 2. The spark (pre-token)
- Live leaderboard at zoostr.xyz/leaderboard (auto-updating, ISR)
- Empire stats (active contributors, total likes, total casts)
- Projected earnings per contributor shown before any token exists
- Proof-of-contribution via receipt page (zoostr.xyz/receipt)
- Farcaster Frame on the receipt page (embeddable, shareable)

### 3. Fiat / BYOK onboarding
- Fan backing via card (no wallet/gas) → sparkz.xyz/back
- BYOK settings for power creators → sparkz.xyz/settings
- Non-technical creators: treasury funds compute (the 1% upkeep floor)
- Viniapp credits path (Phase 1: iframe embed — no backend needed)

### 4. 1/1/98 economics
- Default: creator 97%, treasury 2%, community 1% (grows from there)
- ZAO stake: locked token supply (not a fee slice), 12 months
- Community pool grows as real contributors show up — not given away upfront
- The 2% treasury: 1% community governance + 1% ZOL compute upkeep
- Configured in advisor (sparkz.xyz/advisor) and split wizard (sparkz.xyz/split-wizard)

### 5. ONE human-in-the-loop Meme Engine loop
The only Meme Engine module shipped in v1. Full protocol is the north star; this is the thin slice.

**The loop:** flag moment → draft 3 variants → approve → post → Community Swarm remix → reward + receipt

- **Flag moment:** `npm run detect-moment` — checks Boostr stats for weekly receipt ready, milestone crossings (new #1, total likes thresholds), leaderboard changes vs last week
- **Draft 3:** generates 3 cast variants (announcement angle / proof/leaderboard angle / personal anthem angle)
- **Approve:** ZOL presents drafts in `meme-engine-draft-YYYY-MM-DD.md` — Zaal picks one, optionally edits inline
- **Post:** `npm run post-cast --approve <1|2|3>` — calls Neynar API with the approved draft; saves `last-cast.json`; never posts autonomously
- **Community Swarm remix:** `npm run track-remix` (run 24h after posting) — fetches quote-casts, replies, and likes via Neynar; scores remixers (recast=5, reply=3+likes, like=1); writes `remix-rewards-YYYY-MM-DD.json`
- **Reward + receipt:** top remixers in `remix-rewards-*.json` get bonus points in the next snapshot; noted in the weekly receipt cast

**Script:** `scripts/meme-engine.ts`
**Deps:** `NEYNAR_API_KEY`, `NEYNAR_SIGNER_UUID`, `SPLITS_ADDRESS` (optional for receipt link)
**Cadence:** run every Monday alongside `npm run snapshot`

---

## What v1 DEFERS

| Module | Why deferred |
|--------|-------------|
| Culture Coin launcher | Requires multi-creator onboarding, ZAO vetting pipeline at scale — ship v1 first |
| Alpha Radar / trend-detection | The Cultural Fitness Index + Opportunity Scout — needs live data to train on |
| Autonomous posting | Agent-initiated publishing without human gate — guardrail violation in v1 |
| Canon Keeper | Culture Capsule versioning, constitution management — v2 after culture is established |
| Mutation Lab | Remix variants, A/B testing culture — needs a corpus to mutate |
| Quest Engine | Structured community challenges — needs governance for reward budget |
| Circle Coordinator | Multi-Circle management — needs multiple circles (Culture Circles at Stage 5) |
| Lineage Tracker | Attribution chains across remixes — needs a corpus |
| Cultural Fitness Index | Real-time health metrics — needs historical data |
| Reputation module | On-chain reputation objects — deferred pending Creator Coin protocol |
| Treasury Advisor | Autonomous treasury recommendations — human-gated only in v1 |
| Cultural Memory | Long-term canon + receipt archive — v2 feature |
| Governance Shield | Autonomous governance protection — human-gated only in v1 |
| Distribution Router | Multi-channel distribution (X, Farcaster, email) — v1 = manual review + Farcaster only |

The rule: **ZOL drafts. Humans decide. No module ships that removes a human gate.**

---

## Env vars needed for v1

```
# Required for deploy
NEXT_PUBLIC_BASE_URL=https://zoostr.xyz
NEXT_PUBLIC_TOKEN_ADDRESS=0x...    # set after clanker.world deploy
NEXT_PUBLIC_SPLITS_ADDRESS=0x...   # set after app.splits.org deploy

# Required for ZOL scripts
NEYNAR_API_KEY=...
NEYNAR_SIGNER_UUID=...
SPLITS_ADDRESS=0x...               # same as NEXT_PUBLIC_SPLITS_ADDRESS

# Optional (activates backends)
STRIPE_SECRET_KEY=...              # activates card backing on /back
RESEND_API_KEY=...                 # activates email notifications
ZAO_NOTIFY_EMAIL=zaalp99@gmail.com
```

---

## Human actions that complete v1

1. Deploy 0xSplits contract on Base → [app.splits.org](https://app.splits.org) → get `SPLITS_ADDRESS`
2. Deploy ZOOSTR token on clanker.world → set fee recipient = `SPLITS_ADDRESS`
3. Set env vars on Vercel
4. Run `npm run snapshot` for the first time
5. Run `npm run detect-moment` → review `meme-engine-draft-YYYY-MM-DD.md`
6. Run `npm run post-cast --approve <1|2|3>` to post the launch thread

ZOL prepares. Zaal (or Aziz) clicks.

---

*Last updated: 2026-07-17 · V1 scope is locked — any addition requires Zaal sign-off*
