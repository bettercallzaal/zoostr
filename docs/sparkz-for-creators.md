# Sparkz for Creators

> Who this is for: a creator with an existing community who wants to give them a real financial stake
> Status: draft · use this as the pitch doc when creators ask "how do I do what ZABAL did?"
> Frame: feature-first, community-first. Never price, never speculation.

---

## The problem

You've built something real. People show up for you — they like your posts, share your work, show up in your comments before you have anything to sell. That community is real value. How do you give them a stake in what they helped build?

**The trap:** Most "creator tokens" are just meme launches with your face on them. Your community buys in, price moons for a week, then crashes — and now your most loyal people took a loss on you. That's not loyalty. That's a liability.

**What Sparkz does instead:** Every trade in your token generates a 1% fee. You configure how much of that fee goes to your community — Sparkz allocates it weekly by points, on-chain, forever. The default is creator-first: 97% to you, and the community share starts small and grows as contributors prove themselves (Zoostr runs 50% community after 30+ consistent boosters). Contributors claim their share at splits.org — funds accumulate, no deadline. Just: *you boost, you earn.*

The token is not the pitch. The token is the accounting. The community is the pitch.

---

## What you get with Sparkz

### 1. A live leaderboard → fee distribution

Your community already has a ranking. Boostr points, Discord activity, NFT holdings, staking score — whatever metric fits your community. Sparkz maps that ranking to a fee distribution that updates weekly. Top supporters earn the most. Consistent supporters earn consistently.

**You don't manage the payouts.** Fees accumulate in a 0xSplits contract on-chain — contributors claim their share at splits.org whenever they want, no deadline. Your community checks basescan if they don't trust you.

### 2. The 0xSplits fix (the thing most creator tokens get wrong)

When you launch on Clanker, the fee recipient is immutable. If you put your own wallet, you're the permanent single recipient. If you split multiple wallets upfront, you freeze the split at launch — your leaderboard changes weekly, your split should too.

**Sparkz's solution:** The Clanker fee recipient is a 0xSplits contract. Inside Splits, the recipients are adjustable. Your leaderboard evolves; your fee split evolves with it. On-chain, public, auditable.

This is the only way to deliver "adjustable community fee splits" on Clanker. It's Sparkz's core technical pattern.

### 3. AI advisor to configure your split

The Sparkz AI advisor (sparkz.xyz/advisor) asks 3 questions and gives you a concrete split recommendation:
1. **What kind of project is this?** (solo with producers / artist collab / group crowdfund)
2. **Token now, later, or never?** — start tokenless if the community isn't proven yet
3. **What volume range are you expecting?** — sizes the fee model honestly for your stage

The **default is creator-first: 97% creator, 1% community, 2% treasury.** The community share grows as real contributors show up. You don't give away share before the community exists. Zoostr evolved to 50% community share after 30+ consistent boosters — the advisor shows you where to start and when to grow it.

The advisor calculates real dollar projections: *"At $10k daily volume, your community pool at 50% is $350/week. Your top supporter earns ~$32/week."* You export the config, open the split wizard, and click deploy. ZAO stake (5%, locked 12 months) is set automatically.

### 4. ZAO backing

ZAO takes a small locked token stake — not a fee cut. ZAO holds your token for 12 months. If your token does well, ZAO wins. If it doesn't, ZAO loses alongside you. That's the alignment model: ZAO's incentive is to help you succeed, not extract from you.

ZAO does not take a cut of every trade. Every trade fee goes entirely to your community, you, or the treasury.

### 5. Marketing support

ZOL (ZAO's agent) writes:
- A 5-cast Farcaster launch thread (announcement → proof → mechanics → anthem → Sparkz frame)
- A 5-tweet X thread + standalone announcement
- A deploy checklist (exact fields for clanker.world)
- A weekly receipt cast (top 5 earners, empire stats)

You review and approve. You (or ZOL) posts.

**The framing is always feature-first.** "The community built the empire before any token existed. $YOURTOKEN is what the empire pays back with." Not "buy my coin."

---

## What a Sparkz launch is NOT

- **Not a fundraise.** You don't set a raise target. There's no presale. People earn by showing up, not by depositing ETH.
- **Not a price play.** ZOL never says "this will be worth X." The pitch is belonging and fee share, not speculation.
- **Not a meme launch.** Sparkz is ZAO-curated. Not every creator gets in. The community is real first; the token is a later layer.
- **Not a promise.** Perks = what holders enjoy today. The fee split is live and on-chain. Everything else is the community's to build.

---

## The one-line pitch

**"Your community built your empire. Sparkz gives them a financial stake in it — without you having to figure out tokenomics."**

---

## What you need to have before applying

- An existing community with measurable engagement (Boostr leaderboard, NFT collection, Discord activity, etc.)
- A decision about your primary metric (leaderboard points are easiest; NFT holding works for PFP communities)
- A wallet on Base for your creator fee share
- A conversation with ZAO about the ZAO stake terms

---

## How to apply

Two paths:

**Path A — Use the Sparkz Launcher:** Go to sparkz.xyz/advisor → answer 3 questions → open the split wizard → export your deploy config. ZAO reviews your config before launch to confirm the launch fits the Sparkz model.

**Path B — Work with ZOL directly:** DM @bettercallzaal on Farcaster. ZOL will run the configuration with you and handle the full launch prep (copy, threads, deploy checklist). You review everything before it goes anywhere.

---

## Example: Zoostr ($ZOOSTR)

ZABAL (Farcaster creator) + Boostr (boost platform) → Zoostr

- [ALL_TIME_COUNT] people boosted ZABAL on Boostr before any token existed
- They earned Boostr points by liking ZABAL's casts and getting others to like them
- At launch: $ZOOSTR deployed on Clanker → 0xSplits contract as fee recipient → weekly snapshot from Boostr API → ZOL computes weights, Zaal reviews and calls `updateSplit()` on-chain
- Every trade: 50% to the leaderboard by points, 25% to ZABAL/operations, 25% to treasury
- The people who showed up first earn from every trade, forever

*That community was already real. The token just made it pay.*

---

## Comparison: Sparkz vs. standard creator token launch

| | Standard launch | Sparkz launch |
|--|----------------|---------------|
| Fee recipient | Single wallet (frozen) | 0xSplits contract (adjustable) |
| Community payout | None, or one-time airdrop | Weekly, proportional to contribution |
| ZAO involvement | None | Locked stake (aligned, not extractive) |
| Marketing | You write everything | ZOL drafts; you approve |
| Deploy complexity | High — no template | One config export + one human click |
| Post-launch ops | Manual | ZOL handles weekly snapshot + receipt casts |
| Framing | "Buy my coin" | "Back the empire" |

---

*This doc is maintained by ZOL. Updated as Sparkz launches accumulate and the pattern matures.*
