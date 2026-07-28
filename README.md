# Zoostr

**Zoostr is the first Sparkz launch — ZABAL × Boostr.**

A live Boostr leaderboard + weekly fee allocation for the people who built the empire. 50% of every $ZOOSTR trading fee accumulates for leaderboard participants by points, weekly, on-chain — claim your share at splits.org, no lockups, no deadline.

Built and marketed by ZOL. Deployed by humans. [sparkz.xyz](https://sparkz.xyz)

---

## What it does

- **Live leaderboard** — pulls from the Boostr API (`/api/zabaal/stats`), ranks contributors by points, shows projected weekly earnings at any trading volume (ISR, refreshes every 60s)
- **Weekly receipt** — shareable proof of who earned what, with Farcaster Frame embed
- **0xSplits integration** — the Clanker fee recipient is a 0xSplits contract, so leaderboard → split weights update without touching the token contract
- **Meme Engine** — human-in-the-loop CLI for weekly cast generation, approval, and posting (no autonomous publishing)
- **ZOL admin** — `/zol` page for reviewing draft casts, empire stats, and eligible booster weights
- **Creator tools** — Sparkz launcher, AI advisor, split wizard, patronage tiers, BYOK settings
- **Community** — Culture Circles, Audius integration, discoverability feed, ZAO vetting

## The core architecture

Clanker v4 `rewardBps` are immutable after deploy. Sparkz's fix: set the fee recipient to a single 0xSplits contract address. Inside Splits, recipients and weights are fully adjustable weekly from the live leaderboard. One immutable Clanker address → mutable, on-chain, auditable fee split.

## Pages

| Route | What it is |
|-------|-----------|
| `/` | Homepage: hero, live leaderboard embed, tokenomics, fee split visual, collectables teaser |
| `/leaderboard` | Full earnings calculator — search by username, adjust volume slider |
| `/receipt` | Weekly allocation snapshot — shareable as Farcaster Frame |
| `/rewards` | Empire rewards deep-dive — 4-step flow, pool math, booster tiers, remix rewards, weekly cadence |
| `/discover` | Live discoverability feed — featured sparks, trending contributors, rewards sidebar |
| `/circles` | Culture Circles — composable pre-token mutual backing graph; Zoostr live circle |
| `/advisor` | 3-question AI advisor → recommended split + token timing + fee model |
| `/split-wizard` | Music-native split sheet wizard — roles + % + collaborators → 0xSplits JSON |
| `/patronage` | Tokenless recurring membership builder — Supporter/Patron/Council tiers |
| `/examples` | 8 tokenless spark templates — solo EP, collab, crowdfund, fan-backed, ZAO-backed, etc. |
| `/audius` | Audius handle lookup → per-track split configurator → 0xSplits JSON export |
| `/back` | Fan fiat backing page — Spark/Booster/Patron tiers ($5/$25/$100), card-only, no wallet |
| `/settings` | BYOK settings — bring your own Anthropic key; treasury-funded fallback explainer |
| `/vetted` | ZAO curation program — 50 slots/quarter, badge on homepage |
| `/launch` | Sparkz Launcher config wizard (for creators launching their own token) |
| `/zol` | Admin page: draft cast variants, empire stats, ZOL approve panel (unlisted) |
| `GET /llm.txt` | Machine-readable context for AI agents — empire data, pages, API endpoints, framing rules, ZOL human-gate rule |

## Scripts

```bash
npm run dev            # local dev
npm run snapshot       # compute split weights from live leaderboard → splits-update.json + receipt-*.md
npm run resolve-wallets # resolve Farcaster FIDs → Base wallet addresses → fid-wallets.json
npm run receipt        # cast-ready receipt summary (paste into post)
npm run detect-moment  # detect weekly cast moment + generate 3 draft variants
npm run post-cast -- --approve 1  # post variant 1 via Neynar (human approval required)
npm run track-remix    # score quote-casts + replies 24h after posting
```

## Environment variables

| Variable | Required for |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | OG images, sitemap canonical |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | "Token Live" banner on homepage (set after Clanker deploy) |
| `NEXT_PUBLIC_SPLITS_ADDRESS` | Receipt page splits link; meme-engine draft links |
| `NEXT_PUBLIC_COMMUNITY_SHARE_PCT` | Earnings projections (leaderboard, receipt, /zol, /rewards); set to `50` for Zoostr |
| `NEXT_PUBLIC_SPARKZ_URL` | /launch page cross-link to sparkz.xyz |
| `NEYNAR_API_KEY` | Meme Engine posting + `/api/zol/post` |
| `NEYNAR_SIGNER_UUID` | Neynar signer for posting |
| `ZOL_ASSUMED_VOLUME` | /zol admin page earnings projections (default: 10000) |
| `STRIPE_SECRET_KEY` | /back card payments (omit to show waitlist mode) |
| `RESEND_API_KEY` | Email notifications for /back and /vetted applications |
| `ZAO_NOTIFY_EMAIL` | Where backing and vetting notifications go (default: zaalp99@gmail.com) |

See `.env.example` for a complete list with comments.

## Framing (never violate)

- Lead with the community, not the coin: "back the empire"
- Fee allocation is the proof, not the pitch
- Perks = what holders enjoy today — not guaranteed future entitlements
- ZOL drafts. Zaal (or designated human) approves. No autonomous on-chain actions.
- "Claim at splits.org" — Pull model; fees accumulate, no deadline, no auto-payout

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v3 · Boostr API · Neynar API · 0xSplits · Clanker v4

---

*A Sparkz launch by ZAO · Co-built with Boostr · [sparkz.xyz](https://sparkz.xyz)*
