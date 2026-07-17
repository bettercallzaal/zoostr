# Sparkz Launcher — Product Spec

> Status: draft · design reference for building the configurable creator-token launcher
> Zoostr is the first live example. Every pattern here is derived from it.
> Last updated: 2026-07-17

---

## What Sparkz is

A creator comes in with an empire — an audience, a community, a story. Sparkz turns that empire into a token in five configuration steps, with smart defaults and an AI advisor at every decision point. The deploy is one human click on clanker.world.

The language is always: **back the empire, sell belonging, never price.**

---

## The Five Dials

Every Sparkz launch is defined by five dials. The defaults are set to work for most creators. The creator can change any dial; the AI advisor explains the tradeoffs in plain language.

| # | Dial | Zoostr Default | Range |
|---|------|---------------|-------|
| 1 | **Community fee share** | 50% | 25–75% |
| 2 | **Creator fee share** | 25% | 10–50% |
| 3 | **Treasury share** | 25% | 0–40% |
| 4 | **Community metric** | Boostr leaderboard points | See metrics below |
| 5 | **ZAO stake** | 5% locked token alloc, 12mo + 3mo cliff | 3–10%, 6–24mo |

The three fee shares must sum to 100%. The UI enforces this with a live bar.

---

## Community Metric Options

The "community metric" is how the 50% pool is divided among members. Different creator types use different metrics.

| Metric | Best for | How it works |
|--------|----------|--------------|
| **Leaderboard points** (default) | Social creators, Farcaster builders | Score from external API (e.g. Boostr); weights update weekly |
| **NFT holding** | PFP communities, collectors | Each NFT = 1 share; weighted by count held |
| **Staking** | DAO members, long-term holders | Token staked × duration = score; claimable while staked |
| **Engagement score** | Newsletter / content creators | Custom off-chain score via webhook; Sparkz reads it |
| **Equal share** | Tight-knit groups, allowlists | Each approved address gets 1/N of the pool |

Zoostr uses leaderboard points (Boostr API). The architecture generalizes: any creator with a quantifiable community metric can plug in.

---

## Creator Onboarding Flow

### Step 1 — Empire profile

> "Tell us about your empire."

**Fields:**
- Creator name / handle (Farcaster, Twitter, or custom)
- Token name (suggested: `[CreatorName]r` a la Zoostr, or `[Name]coin`)
- Token ticker (4–6 chars, suggested automatically)
- One-line description ("ZABAL × Boostr creator token")
- Chain (Base, default)

**AI advisor:** "Based on your handle and community, here's what we'd suggest for a name and ticker. You can change anything."

---

### Step 2 — Community rewards

> "How does your community earn their share?"

**Fields:**
- Community metric (dropdown: leaderboard / NFT / staking / engagement / equal)
- If leaderboard: API endpoint, score field name, update cadence
- Minimum threshold (to prevent dust distributions; default: 10 pts)
- Community fee share % (slider, default 50%)

**AI advisor:**
- Shows a projection: "At $X daily volume, your top [metric holder] earns ~$Y/week with this setting."
- Flag: "Below 30% community share weakens the incentive significantly — your community earned their stake by showing up."
- Flag: "Above 60% leaves little for operations and treasury. Can still work for tight-knit communities."

---

### Step 3 — Creator allocation

> "How does this sustain you?"

**Fields:**
- Creator fee share % (slider, default 25%)
- Creator wallet address

**AI advisor:**
- "At $X daily volume, your creator share generates ~$Y/week. This covers [describe: ops, content, tooling]."
- "This is your ongoing income from the empire you built. Not a grant, not a one-time drop — it runs as long as people trade."

---

### Step 4 — Treasury

> "What does the community own collectively?"

**Fields:**
- Treasury share % (auto-filled as 100% - community% - creator%; editable)
- Treasury governance (None / Snapshot token vote / Zaal decides / TBD)
- Treasury use cases (multi-select: liquidity, grants, buybacks, events, TBD)

**AI advisor:**
- "The treasury is the community's collective wallet. Even at 10%, it accumulates over time and can fund community initiatives — hackathons, merch, events."
- "We recommend at least 10% treasury so the community has something to govern together."

---

### Step 5 — ZAO partnership

> "ZAO backs you — here's how."

**Fields (mostly fixed, creator acknowledges):**
- ZAO stake: 5% of initial supply (adjustable to 3–10%)
- Lock duration: 12 months with 3-month cliff
- Lock mechanism: public timelock contract (announced at launch)
- ZAO's role: protocol rails, AI advisor, Sparkz infrastructure

**AI advisor:**
- "ZAO takes a locked token stake — not a fee cut. ZAO holds $ZOOSTR just like your community does. If the token succeeds, ZAO succeeds. If it doesn't, ZAO loses alongside you."
- "This isn't extraction. It's skin in the game."

**Creator consent checkbox:** "I understand ZAO holds [X]% of [TOKEN] for 12 months with a 3-month cliff. This is public and disclosed at launch."

---

### Review & Generate

> "Here's your complete config. Ready to launch?"

Displays a read-only summary of all five dials, then generates:
1. `deploy-config.md` — step-by-step launch checklist (see Zoostr example)
2. `tokenomics-draft.md` — the full mechanism document
3. `launch-thread-farcaster.md` — 5-cast launch thread (AI-written, creator edits)
4. `launch-thread-x.md` — X thread

The AI advisor writes the marketing threads. The creator reviews and edits. ZOL agent posts on launch day (review-gated).

The deploy itself is **one human click on clanker.world** using the pre-filled config.

---

## The 0xSplits Wiring (technical default)

Every Sparkz launch uses the same architectural pattern:

```
Clanker token
  └─ fee recipient = 0xSplits contract (Base)
        ├─ 50% → Community split (weights updated weekly from metric)
        ├─ 25% → Creator wallet
        └─ 25% → Treasury multisig
```

The Splits contract is the only address hardcoded in Clanker (immutable). Everything inside Splits stays adjustable. Sparkz controls this wiring; the creator only decides the percentages.

**Split controller:** 2-of-2 multisig between creator and ZAO, upgradeable to a governor.

---

## Sparkz Smart Defaults by Creator Type

### Social creator (Farcaster/Twitter)
- Community metric: leaderboard points (Boostr or custom)
- Community share: 50%
- Update cadence: weekly

### NFT project
- Community metric: NFT holding (balance weighted)
- Community share: 40%
- Treasury: 35% (larger governance pool is standard for NFT communities)
- Update cadence: daily (balances change fast)

### DAO / governance community
- Community metric: token staking
- Community share: 60%
- Treasury: 25%
- Creator: 15% (lower; DAO structure means collective ownership)
- Update cadence: daily

### Small tight-knit group (< 50 members)
- Community metric: equal share (allowlist)
- Community share: 60%
- Treasury: 20%
- No minimum threshold

---

## What the Launcher Is NOT

- Not a trading interface
- Not financial advice
- Not a guarantee of earnings
- Not a DAO governance system (yet)
- Not a fundraising tool

The launcher configures a creator's fee split and generates the deploy checklist. The deploy is always a human action. The language is always about belonging, never about price or returns.

---

## MVP Scope for Sparkz v1 Launcher

The Zoostr launch is Sparkz v0 — a manually-executed example. Sparkz v1 launcher is:

1. **A web form** (5 steps above) that generates the docs
2. **AI advisor chat** embedded at each step (ZOL)
3. **One-click config export** — downloads `deploy-config.md` pre-filled
4. **No on-chain actions from the launcher itself** — the launcher is a config tool, not a deployer

Sparkz v2 (later): direct Clanker API integration, on-chain 0xSplits creation, automated weekly snapshots.

---

*Next: build the Sparkz v1 launcher form as a Next.js route at `/launch`*
