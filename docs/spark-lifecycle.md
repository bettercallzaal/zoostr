# Spark Lifecycle

> The stages a creator community moves through from first spark to federated network.
> Frame: culture before price. A token is a stage transition, not a starting gun.
> Source: Brandon's "Emerging Culture" lifecycle model, adapted for the Sparkz / ZOL ops model.

---

## The five stages

| Stage | Status | Token | Community | ZAO role |
|-------|--------|-------|-----------|----------|
| 1. Proposed | Idea pitched to ZAO | None | Not yet | Vetting |
| 2. Emerging | Active community, metrics forming | None | Growing | Advisory |
| 3. Verified | Proven community, ZAO-vetted | Ready to launch | 30+ contributors, 4+ weeks | Locked stake |
| 4. Established | Token live, receipts flowing | Live (Clanker v4) | Weekly earnings | ZOL ops |
| 5. Federated | Sparks back other sparks | Multi-spark | Cross-community | Network |

---

## Stage 1 — Proposed

**What it is:** A creator pitches their community to ZAO for a Sparkz slot (50 per quarter). The community exists in some form — Farcaster followers, Discord members, Boostr leaderboard — but has no formal backing structure yet.

**What's possible today:**
- Submit a vetting application at sparkz.xyz/vetted
- Get ZAO feedback on community metric (leaderboard? NFT? staking? activity score?)
- Draft a split config in the advisor (sparkz.xyz/advisor)

**What's NOT here yet:**
- No token, no split contract, no receipt, no backing page

**Transition to Emerging:** ZAO accepts the slot. Creator has a live community metric and a committed split config.

---

## Stage 2 — Emerging

**What it is:** The community is active and measurable. Contributors know they're on the leaderboard. Backing is accepted via card (no wallet/gas required). Projected earnings are published but the split contract isn't live yet.

**What's possible today:**
- Live leaderboard (public, auto-updating from the community metric API)
- Patronage tiers active via Stripe ($5/$25/$100 recurring)
- Projected earnings shown per contributor ("at $10k/day volume, you'd earn ~$X/week")
- Split config finalized and exported — ready for 0xSplits deploy
- ZOL drafts the full launch thread and deploy checklist

**What's NOT here yet:**
- No token, no on-chain split, no live weekly payouts (payouts are projected, not flowing)

**Transition to Verified:** 30+ real contributors have been showing up for 4+ consecutive weeks. ZAO confirms the community is real. The deployer (creator or designated human) is ready to act.

---

## Stage 3 — Verified

**What it is:** The community is proven. ZAO has vetted and holds a locked stake. The token config is finalized and ready to deploy — one human click on clanker.world. This is the "token-ready" state.

**What's possible today:**
- "🏅 ZAO Vetted" badge live on the site and on sparkz.xyz/launches
- Deploy config JSON exported (name, ticker, image, 0xSplits address as fee recipient)
- 0xSplits contract deployed on Base (human action: app.splits.org)
- ZAO locked stake: 5% token supply, 12-month vesting — ZAO's skin is in the game
- Full launch thread ready (5-cast Farcaster + X thread)

**What's NOT here yet:**
- No token deployed (waiting for human deployer on clanker.world)
- No live payouts — split contract is deployed but no fee flow until token trades happen

**Transition to Established:** Deployer launches the token on Clanker. `NEXT_PUBLIC_TOKEN_ADDRESS` set. The token is live and trading. The split contract starts accumulating fees.

---

## Stage 4 — Established

**What it is:** The token is live. The 0xSplits contract is receiving 1% of every trade. ZOL runs the weekly snapshot, updates the split weights, and posts the receipt cast. Fees flow on-chain to contributors proportional to their points — no claiming, no lockups.

**What's live today (Zoostr at this stage):**
- Token live on Clanker v4 (1% fee tier)
- 0xSplits contract as fee recipient — adjustable, not frozen
- Weekly snapshot (`npm run snapshot`) → leaderboard → split weights → on-chain update
- Weekly receipt page (zoostr.xyz/receipt) + Farcaster Frame + X share
- Weekly receipt cast by ZOL — top 5 earners, empire stats, leaderboard link
- Leaderboard public at zoostr.xyz/leaderboard

**ZOL ops cadence:**
1. Every Monday: `npm run snapshot` → generates `splits-update.json` + `receipt-YYYY-MM-DD.md`
2. Human (Zaal or Aziz) reviews the split weights
3. Human updates the 0xSplits contract on Base (app.splits.org) with the new weights
4. ZOL posts receipt cast + receipt page on Farcaster + X

**What grows from here:**
- Volume → more earnings → more contributor loyalty → more boosting → more volume (the flywheel)
- Contributors from other communities discover the receipt and start showing up

**Transition to Federated:** Multiple Sparkz communities are boosting each other's content. A creator with a Verified spark starts backing the Zoostr community (or vice versa) — and their Sparkz community gets a share of the cross-boost earnings.

---

## Stage 5 — Federated

**What it is:** Sparks back other sparks. Before any token exists on a new creator's community, they can boost an Established spark and earn from that spark's fee pool. This is composable backing — the mutual-backing graph that turns isolated creator communities into a network.

**The Culture Circles model:**
- Creator A (Established, token live) has a leaderboard of 50 boosters
- Creator B (Emerging, no token yet) starts boosting Creator A's content alongside A's existing community
- Creator B's community appears on Creator A's leaderboard and earns from Creator A's fee pool
- Creator B's community has early proof-of-contribution on A before B's own token launches
- When B launches, A's community can cross-boost B — both communities compound each other

**What this unlocks:**
- Zero-token onboarding: new creator's community earns from an existing spark before committing to a token
- Mutual incentive: established spark benefits from more boosters; new spark gets proof-of-contribution history
- The network effect Sparkz was missing: creator-to-creator composable backing as the growth engine

**ZOL's role at this stage:**
- Tracks cross-community contribution in the snapshot (multiple origin communities per point)
- Writes the Culture Circles receipt (who boosted what, what they earned cross-community)
- Flags new sparks that have proven cross-community engagement as Verified candidates

**This stage is the NORTH STAR, not the v1 checklist.** Zoostr ships Stage 4. Culture Circles is what Stage 5 looks like in production.

---

## Extraction guardrails — baked in at every stage

From Brandon's first-class principles (never crossed):

1. **Culture before price** — earnings projections, not price targets. The leaderboard measures contribution, not holder count.
2. **Attribution before extraction** — you earn what you put in. The split is public before the token launches.
3. **Holding is not contribution** — fees go to boosters (active contributors), not bag-holders.
4. **Capability is not authority** — ZOL prepares, never deploys. The human is the authority at every stage transition.
5. **Founder-authority decay** — as the community matures (Stage 3→4→5), ZAO's operational role shrinks. The community governs the treasury.

---

## Where Zoostr sits today

**Zoostr is at Stage 3 → Stage 4 transition.**

- 34 contributors have been active for weeks (Stage 3 criterion: 30+, 4+ weeks ✓)
- ZAO-vetted ✓
- 0xSplits contract: ready to deploy (app.splits.org — human action pending)
- Token config: finalized, ready for clanker.world deploy (human action pending)
- Weekly ops cadence: documented in `docs/zol-agent-ops.md`, ready to run

**Human actions needed to complete the Stage 3→4 transition:**
1. Deploy 0xSplits contract on Base → get `NEXT_PUBLIC_SPLITS_ADDRESS`
2. Deploy Zoostr token on clanker.world → get `NEXT_PUBLIC_TOKEN_ADDRESS`
3. Set env vars on Vercel
4. Run `npm run snapshot` for the first time
5. Post the 5-cast Farcaster launch thread (ZOL has drafted it in `docs/zol-agent-ops.md`)

---

*This doc is maintained by ZOL. Updated as Zoostr moves through the lifecycle and the pattern generalizes to other Sparkz communities.*
