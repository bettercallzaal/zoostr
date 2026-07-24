# Zoostr Tokenomics — Draft

> Status: draft · for review before launch · not a legal document

---

## Overview

Zoostr is the first Sparkz launch: a creator token co-built between Zaal (ZABAL) and Aziz (Boostr). The central mechanic is a **50/50 fee split** — half of every trade funds the Boostr leaderboard participants, proportional to their points. This turns the leaderboard into a permanent financial stake in the token's success.

---

## The 0xSplits Fix (Hard Requirement)

**Problem:** Clanker v4 `rewardBps` are immutable after deploy. A raw "configurable split" promise freezes at launch. (Verified in the $IMAN launch playbook.)

**Solution:** Set a single Clanker fee recipient = a **0xSplits contract**. The split recipients and weights live inside Splits, where they can be updated on any cadence without touching the token contract. The result:

- Split is **fully on-chain and publicly readable**
- Weights can be **updated** (by the designated controller) as leaderboard points change
- Clanker sees one immutable address (the Splits contract); Splits handles the rest

This is Sparkz's core architectural pattern for "configurable fee distributions."

---

## Fee Split (1% per trade on Clanker)

| Recipient | Share | Mechanism |
|-----------|-------|-----------|
| Leaderboard Boosters | **50%** | 0xSplits → weights updated weekly from leaderboard points |
| Creator & Operations | **25%** | Zaal / ZABAL operational wallet |
| Treasury | **25%** | Community-governed, future use (liquidity, buybacks, community vote) |

---

## Leaderboard → Fee Allocation: Design Options

### Option A: 0xSplits with weekly weight refresh (RECOMMENDED)

- **How it works:** An off-chain keeper (or ZAO multisig) reads the Boostr leaderboard weekly, computes each participant's share (zabalLikesCount / totalPoints), and calls `updateSplit()` on the 0xSplits contract.
- **Pros:** Accumulated pull — fees accrue in the contract; recipients claim their share anytime at app.splits.org (no per-period deadline, no lockup). Fully on-chain. Visible to anyone. Composable.
- **Cons:** Requires a trusted/permissioned role to call `updateSplit`. Could be governed by a ZAO multisig or eventually a keeper with on-chain leaderboard data.
- **Gas:** updateSplit costs ~100–200k gas per update. Weekly cadence is ~$5–20 on Base. Acceptable.
- **Trust model:** Until a decentralized keeper exists, Zaal + Aziz multisig controls the update. This is disclosed publicly. Future: governance vote automates the keeper.

### Option B: Periodic Merkle-Drop (claimable)

- **How it works:** Weekly snapshot of leaderboard → compute merkle tree of claims → publish root on-chain. Participants claim their share by submitting a proof.
- **Pros:** More gas-efficient for large distributions (doesn't require iterating recipients on-chain). No ongoing permission to update recipients.
- **Cons:** **Active claiming required.** Unclaimed fees accumulate and need expiry handling. Worse UX — participants have to check and claim. Less "you already own it" feel.
- **Gas:** Claim costs ~80–120k gas per user per period.

### Decision: Option A (0xSplits weekly refresh)

**Why:** Zoostr's brand is "boost and earn." A periodic merkle drop requires active per-period claiming — bad UX. 0xSplits Pull: fees accumulate in the contract on weekly cadence; recipients claim at splits.org anytime (no per-period deadline, funds wait). Lower friction than Option B. The trust tradeoff (multisig controller) is acceptable at launch and can be progressively decentralized.

**Receipt framing (DreamNet-style):** Each weekly distribution is logged as a public on-chain event and can be formatted as a human-readable receipt — "You earned 0.0042 ETH this week from Zoostr trades based on 1,240 boost points (12.4% of pool)." Brandon's RECEIPTS tool pattern applies here.

**Tooling (built):**
- `npm run snapshot` — fetches live leaderboard, computes integer weights summing to 1,000,000, writes `splits-update.json` (paste into splits.org UI) + `receipt-<date>.md` (Farcaster-ready receipt). NEVER signs anything.
- `npm run receipt` — generates a cast-ready 2-cast receipt with top-5 earners and projected $/week at any volume (`VOLUME=50000 npm run receipt`).
- `/leaderboard` on zoostr.xyz — live per-contributor earnings projection at selectable daily volumes.
- `/receipt` on zoostr.xyz — shareable DreamNet-style weekly receipt page: empire stats, pool breakdown, top-15 earners with %, projected earnings, splits contract link. ISR (60s) and Farcaster-frameable.

---

## ZAO's Stake

ZAO's participation is a **locked token allocation** — not a fee slice.

- ZAO backs the creator by holding the token, aligning long-term incentives
- Lock duration: TBD (suggest 12 months with 3-month cliff)
- Size: TBD (suggest 5–10% of supply, negotiated with Zaal)
- Precedent: $IMAN launch playbook

ZAO does **not** take an ongoing fee cut. This keeps the fee split entirely between boosters, creator, and treasury — the people actually doing the work.

---

## Sparkz Default Configuration

Zoostr is also the first live example of a **Sparkz default config**. The Sparkz platform default is **creator-first (97/2/1)** — creator keeps 97%, treasury gets 2%, community pool starts at 1%. Zoostr evolved to 50% community after 30+ consistent boosters proved the leaderboard. The advisor starts every creator at 97/2/1 and explains when to grow the community share.

| Parameter | Zoostr Setting | Sparkz Default |
|-----------|---------------|----------------|
| Fee tier | 1% (Clanker) | 1% |
| Fee recipient | 0xSplits contract | 0xSplits contract |
| Community pool | 50% (evolved from 1% as boosters showed up) | 1% (creator-first; grows when community is proven) |
| Creator pool | 25% | 97% |
| Treasury | 25% | 2% (1% community governance + 1% ZOL compute) |
| ZAO stake | Locked token alloc | Locked token alloc (never a fee slice) |
| Snapshot cadence | Weekly | Weekly |
| Update controller | ZAO + creator multisig | Creator + ZAO multisig |

---

## Open Questions for Launch

1. **Split controller:** Who is the signer on the 0xSplits update? Suggest 2-of-3 multisig: Zaal + Aziz + ZAO.
2. **Treasury governance:** What can the 25% treasury be used for? Suggest a simple on-chain vote (Snapshot) with token-weighted quorum.
3. **ZAO lock size + duration:** Align with Zaal before deploy.
4. **Leaderboard snapshot logic:** Does `zabalLikesCount` reset weekly or accumulate? Accumulating rewards consistent boosters; resetting rewards recent activity. Recommend: accumulating score for distribution weight, with a "recent activity" multiplier TBD.
5. **Minimum points threshold:** Should boosters need a minimum point count to be eligible? Prevents dust distributions. Suggest: > 10 points.

---

*Last updated: 2026-07-17 · Draft — not final · Zaal deploys, not this doc*
