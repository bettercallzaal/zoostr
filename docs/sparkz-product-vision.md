# Sparkz — Product Vision

> Living doc · updated by ZOL between build steps · not a spec, a thinking tool
> Last updated: 2026-07-17

---

## What Sparkz is

A configurable creator-token launcher with an AI advisor. A creator comes in with an empire (audience, community, a story), and Sparkz turns that empire into a token — with sensible defaults, on-chain transparency, and ZAO's alignment baked in.

The Zoostr launch is Sparkz's first live example. Every pattern here should be derivable from Zoostr.

---

## The core promise

> "Back the empire" — sell access and belonging, never price.

Sparkz tokens are not speculative plays. They're financial expressions of belonging. The community that shows up for a creator gets a real stake in what they helped build. The creator sets the terms; ZAO provides the rails.

---

## The configurable launcher (what a creator sets)

A Sparkz launch has five dials. Zoostr shows the defaults; creators can change any of them.

| Dial | Zoostr default | What it controls |
|------|---------------|-----------------|
| **Community fee share** | 50% | What % of trading fees flows to the community, and by what metric (leaderboard points, NFT holding, staking, etc.) |
| **Creator fee share** | 25% | Creator's ongoing fee income for operations |
| **Treasury share** | 25% | Community-governed pool (buybacks, liquidity, grants) |
| **ZAO stake** | ~5% locked token alloc | ZAO's skin-in-the-game. Locked, not extracted as fees |
| **Distribution mechanism** | 0xSplits weekly refresh | How community share reaches recipients (pull split, merkle-drop, staking yield, etc.) |

A creator with a different community shape might choose:
- NFT-holder distribution instead of leaderboard points (e.g. a PFP community)
- Daily instead of weekly cadence
- Higher community share (60%) if the creator wants to be more generous
- Governance vote for treasury use

---

## The AI advisor (what it does)

Before deploy, an AI advisor helps the creator:

1. **Understand the dials** — "what does 50% to leaderboard actually mean for your top 10 fans?"
2. **Run projections** — "at $100k daily volume, your top booster earns ~$X/week"
3. **Set smart defaults** — given the creator's community size, engagement type, and goals, suggest the right config
4. **Draft the launch story** — write the 5-cast thread, the token description, the "back the empire" narrative
5. **Flag risks** — "if you set community share below 30%, the community incentive weakens significantly"

The advisor never deploys. It hands off a complete config doc (like `docs/deploy-config.md`) and the human clicks.

---

## The 0xSplits architectural pattern

This is Sparkz's core technical contribution. Every Sparkz launch inherits it.

**Problem:** Clanker v4 `rewardBps` freeze at deploy. Any "configurable split" promise breaks immediately.

**Solution:** Single fee recipient = a 0xSplits contract. The split lives inside Splits, where it stays adjustable and publicly readable. Clanker sees one immutable address; Splits handles the distribution.

**Generalizes to:** Any protocol that has an immutable fee recipient. Zora, Uniswap hooks, etc. Sparkz can wrap any of them with a Splits layer.

---

## The ZAO stake model

ZAO is not a fee extractor. ZAO holds locked tokens.

**Why:** Long-term alignment. If the token succeeds, ZAO benefits. If ZAO extracts fees, it's a tax on the community.

**What it gives ZAO:**
- Skin in the game on every Sparkz launch
- A portfolio of creator tokens (the ZAO economy)
- Governance rights in tokens that have on-chain governance

**Standard Sparkz ZAO terms:**
- 5% of initial supply
- 12-month lock with 3-month cliff
- Announced publicly at launch

---

## The receipt pattern (DreamNet-style)

Each fee distribution is framed as a human-readable receipt:

```
ZOOSTR WEEKLY RECEIPT · Week of Jul 14–21 2026

Your boost points: 1,240
Total points in pool: 10,340
Your share: 12.0%

Leaderboard pool this week: 0.0834 ETH
→ Your earnings: 0.0100 ETH ($28.40)

Verified on-chain: [basescan link]
Split address: 0xABC...
```

This receipt is:
- Posted as a Farcaster cast by ZOL agent weekly
- Optionally minted as a receipt NFT (DreamNet / Brandon's RECEIPTS pattern)
- Always verifiable on-chain

---

## The "back the empire" language system

Never say price. Never say returns. Never say investment.

**Say instead:**
- "Back the empire" (commitment, belonging)
- "Stake in what you helped build" (ownership, not speculation)
- "Your points = your share" (fair, mechanical, not discretionary)
- "The people who showed up first" (loyalty, history)
- "Earn from every trade" (ongoing, passive, just for existing)

**Don't say:**
- "Price target", "moonshot", "pump", "APY", "yield"
- "Guaranteed", "will earn", "investment opportunity"
- "Get rich", "returns", "profit"

---

## What's been built (Zoostr as Sparkz v1 proof of concept)

| Q | Status | Where |
|---|--------|-------|
| **Q1 — minimum viable launcher UI** | ✅ Built | `/launch` at zoostr.xyz — 5-step form, exports deploy-config.md + Farcaster + X threads |
| **Q2 — community metric abstraction** | ✅ Built | `CommunityMetric` type in `src/lib/launcher.ts` — leaderboard / NFT / staking / equal, each with labels, descriptions, optional API URL |
| **Q3 — trustless Splits update** | ⏳ Design below | Still manual keeper. Sketch for v2. |
| **Q4 — creator onboarding flow** | ✅ Built | 5-step `/launch` form with dynamic ZOL advisor projections; system prompt in `docs/ai-advisor-prompt.md` |

---

## Open question 3: Trustless 0xSplits Update (v2 design sketch)

**Goal:** Remove the trusted multisig from the weekly `updateSplit()` call. Anyone can trigger the update; weights are derivable from on-chain-verifiable data.

**Current (Sparkz v1):** Off-chain keeper reads `/api/boostr` weekly, computes weights, calls `updateSplit()` via controller multisig. Trust assumption: the controller wallet is honest.

**Paths to trustless:**

```
Option A — Attestation-based keeper (recommended)
  1. Boostr publishes a signed weekly attestation
     (EIP-712 or EAS: {fid, username, points, epoch})
  2. A public keeper contract verifies the signature, derives weights,
     calls updateSplit() — no permissioned role needed
  3. Anyone can call the keeper
  Trust model: Boostr's attestation key (publicly auditable, socially slashable)

Option B — EAS (Ethereum Attestation Service) per contributor
  1. Boostr makes EAS attestations on Base per contributor per epoch
  2. A resolver contract reads attestations, materializes weights
  3. Splits controller = the resolver (immutable)
  Trust model: Boostr's EAS attester key (revocable, on-chain history)

Option C — Chainlink oracle (overkill for v1)
  Chainlink node publishes leaderboard on-chain; Automation job calls updateSplit.
  High cost, unnecessary infrastructure for initial scale.
```

**Recommendation for v2:** Option A. Lowest complexity, no new infrastructure, socially accountable. Requires Boostr to sign weekly attestations — a conversation between ZAO and Aziz, not a unilateral Sparkz decision.

---

## Open questions (still open)

5. **Is there a Sparkz token?** Should Sparkz itself eventually have a token that aggregates ZAO stakes and launcher governance across all launched creator tokens? Or does ZAO accrue value through its per-launch token stakes portfolio instead?

6. **Receipt NFTs?** Each weekly distribution could mint a collectible proof-of-earn NFT (DreamNet / Brandon's RECEIPTS pattern). Low priority for v1; would add social virality.

---

*ZOL keeps this doc alive between sessions. Add to it; never delete.*
