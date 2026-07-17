# Sparkz — Product Vision

> Living doc · updated by ZOL between build steps · not a spec, a thinking tool
> Last updated: 2026-07-17

---

## FRAMING — LOCKED 2026-07-17

These principles govern every Sparkz launch and all public copy. Never override them.

- **Start with a spark, not a token.** No token required to get started. Lead with this on day 1. The boost engine, leaderboard, community backing — all of that runs before any coin exists. The token is extra. Opt-in. If and when it makes sense.
- **Feature-first, coin-last.** Sell the features: collectables, the boost engine, fee splits, community backing. The coin is an extra on top. Never open with "here's a token."
- **The problem word is "coin," not "creator."** Downplay the coin — coin = FUD/speculation. Frame = "back the album," not "buy a coin."
- **The differentiator = multi-recipient 0xSplits (music-native).** A collab song splits fees between both artists — both have reason to share it. A group tour fund splits by crowdfunders, who make proposals, holders vote — "a light Nouns DAO with liquid tokens." Single-recipient fee splits are everywhere. Multi-recipient, live, adjustable is the Sparkz pitch.
- **Non-technical framing for artists.** Legal-safe: "monetization mechanism," never "raise." Perks = what backers enjoy today, not promises. ZAO-curated, not a permissionless farm.

---

## What Sparkz is

A configurable creator-token launcher with an AI advisor. A creator comes in with an empire (audience, community, a story), and Sparkz gives them a spark — community backing, a boost engine, fee splits — and a token only if and when they want one.

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

This is Sparkz's core technical contribution — and the product differentiator. Every Sparkz launch inherits it.

**Problem:** Clanker v4 `rewardBps` freeze at deploy. Any "configurable split" promise breaks immediately.

**Solution:** Single fee recipient = a 0xSplits contract. The split lives inside Splits, where it stays adjustable and publicly readable. Clanker sees one immutable address; Splits handles the distribution.

**Why this is music-native:** A collab song with two artists sets up a split where both artists share trading fees proportionally. Both are financially incentivized to share the song — not just post it. A group crowdfund (e.g. Farcaster-to-Devcon) splits fees by contribution weight; crowdfunders make proposals, holders vote. This is "a light Nouns DAO with liquid tokens" without the governance overhead.

**The pitch in one line:** Single-recipient fee splits are everywhere. Multi-recipient, live, adjustable on-chain is Sparkz.

**Generalizes to:** Any protocol that has an immutable fee recipient. Zora, Uniswap hooks, etc. Sparkz can wrap any of them with a Splits layer.

---

## Sparkz use cases (v2 applications)

These are the shapes the FRAMING directive calls out. Zoostr (leaderboard model) is built. The rest are v2 targets.

### 1. Leaderboard community (Zoostr model — BUILT)

A social creator on Farcaster/Boostr whose community earns points by boosting content. Weights = zabalLikesCount / totalPoints, updated weekly. Example: Zoostr ($ZOOSTR).

### 2. Music collab (collab song split — v2)

Two or more artists release a song together. The song token's trading fees split between all contributing artists proportionally (e.g. 60/40 lead/feature). Both artists are financially incentivized to share, stream, and promote — not just the creator who technically "owns" the token. The 0xSplits recipient list = the featured artists.

**The key insight:** When both artists have a fee stake, a repost isn't just goodwill — it's money. Sparkz creates a financial reason for collaboration to be genuine.

**Config:** `CommunityMetric = 'equal'` across contributing wallets. Or a custom leaderboard if one platform tracks contribution weight.

### 3. Group crowdfund — "a light Nouns DAO with liquid tokens" (f2dc model — v2)

A community raises toward a shared goal (e.g. Farcaster-to-Devcon trip: 20 contributors split costs and any future token fees by their contribution weight). The community can make proposals; token holders vote; treasury funds approved proposals.

**Shape:**
- Token launched by the organizing wallet (e.g. `/f2dc`)
- 0xSplits recipient list = contributors by contribution amount
- Treasury (25%) = community Snapshot governance
- Holders vote on proposals (fund a travel grant, donate to a cause, buy back tokens)
- This is "Nouns DAO with liquid tokens" — governance exists but you can exit anytime (liquid, not locked NFT)

**Sparkz adds:** The configurable fee split means contributors earn from secondary trading of the token itself, not just the initial raise. This aligns long-term holders with the fund's success.

**f2dc example config:**
```
Community metric: equal share (each contributor = 1/N of the leaderboard pool)
Community share: 50% (flows to contributors by contribution weight)
Treasury: 25% (Snapshot vote — fund proposals)
Creator/organizer: 25% (trip organizing costs, coordination)
```

### 4. PFP / collector community (NFT-holder model — v2)

A creator with a PFP collection uses NFT holding as the metric. Each NFT = 1 unit of leaderboard weight. Holding 3 NFTs = 3x the fee share of a 1-NFT holder.

**Why this works:** Existing NFT holders already have social identity in the collection. Adding a fee share to NFT holding makes them financially incentivized to promote and discuss the token — the NFT becomes a compounding financial instrument, not just a membership card.

**Config:** `CommunityMetric = 'nft'` with the NFT contract as the metric source. Weights = balance of each address at snapshot time.

### 5. DAO / staking community (long-term holder model — v2)

A DAO wants to reward its most committed members. Metric = tokens staked × duration. A member who staked 1,000 tokens for 6 months outweighs someone who staked 10,000 for 1 week. This rewards patience and conviction over capital.

**Config:** `CommunityMetric = 'staking'` with a staking score contract. Sparkz computes the weight from the staking index.

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
| **Q5 — Feature-first framing** | ✅ Updated 2026-07-17 | Site, marketing threads, launcher copy all rewritten: community-first, token as payback mechanism. Locked FRAMING principles in this doc. |
| **Q6 — Collectables / receipt NFTs** | 📋 Planned v2 | Design below — proof-of-contribution NFTs minted at distribution, shareable social artifacts |

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

## Q6 design: Collectables (v2)

The FRAMING directive lists collectables as a key feature to sell alongside the boost engine, fee splits, and community backing. This is the design sketch.

**What collectables are:** Proof-of-contribution NFTs minted automatically when you earn from a distribution. Not financial instruments — cultural artifacts. "Back the album, earn the vinyl."

**The pattern:**
1. Each weekly fee distribution runs the `npm run snapshot` → `updateSplit()` flow
2. As part of the same transaction (or a separate lightweight mint), everyone in the split receives a receipt NFT
3. The NFT encodes: epoch, username/FID, points, % share, amount earned that week
4. Rendered on-chain as an SVG: "Week of Jul 14 2026 · @username · 12.0% · $28.40"
5. Transferable but soulbound-by-feel — the data tells the story regardless of who holds it

**Why this adds value:**
- Backers share their receipts socially → virality for the creator
- Proof of who was there *before* the token was big (early backer credibility)
- The collection becomes a history of the empire — a record of every week someone earned
- "I have 18 consecutive weeks of Zoostr receipts" is a social signal

**What it is NOT:** Not a "buy this NFT to earn." Collectables are earned automatically from boosting — there is no mint price. The feature is additive to backing, not a gate.

**Implementation path:**
- A simple `DistributionReceipt` ERC-1155 or ERC-721 contract
- Minted by the same transaction that calls `updateSplit()`, or via a claim window
- Metadata stored on-chain (SVG) or IPFS; `tokenId` = epoch × 1000 + rank
- Integrated into the `npm run snapshot` script output (adds a `mint-receipts.json` payload)

---

## Open questions (still open)

5. **Is there a Sparkz token?**
   
   Working recommendation: **No standalone Sparkz token for now.** ZAO accrues value through its per-launch token stake portfolio — a diversified basket of creator tokens. If/when Sparkz has enough launched tokens to justify governance, ZAO's locked stakes *are* the governance layer. A separate Sparkz token would introduce the same speculation risk that the FRAMING directive says to avoid.

   Revisit after 10+ launches.

---

*ZOL keeps this doc alive between sessions. Add to it; never delete.*
