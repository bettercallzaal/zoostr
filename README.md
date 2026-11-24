# Zoostr

## Links

- [Zoostr Hearth on Sparkz](https://trysparkz.com/c/zoostr)
- [Zoostr bot](https://zoostr-bot.vercel.app)
- [Sparkz](https://trysparkz.com)
- [The ZAO](https://thezao.com)

> **Status: no token, nothing to buy.** Free to join and optional. Points and rank on the leaderboard. No payouts or fee sharing are promised. Not live yet.

**Zoostr is the first Sparkz launch  -  ZABAL × Boostr.**

A live Boostr leaderboard ranks contributors by points. Zoostr is optional and free to join.

Built and marketed by ZOL. Deployed by humans. [trysparkz.com](https://trysparkz.com)

---

## What it does

- **Live leaderboard**  -  pulls from the Boostr API (`boostr.sahban.dev/api/zabal/stats`), ranks contributors by points (ISR, refreshes every 60s)
- **Machine-readable context**  -  `GET /llm.txt` describes the site for AI agents

## Pages

`zoostr.vercel.app` is one page (`/`). Every older route redirects to `/` with a permanent redirect (see `next.config.ts`). Token-era page files, scripts and components were removed on 2026-11-24.

## Scripts

```bash
npm run dev             # local dev
npm run resolve-wallets # resolve Farcaster FIDs to Base wallet addresses, writes fid-wallets.json
npm test                # node --test
```

## Environment variables

See `.env.example` for the list with comments.

## Framing (never violate)

- Lead with the community: "back the empire"
- ZOL drafts. Zaal (or designated human) approves. No autonomous on-chain actions.
- Do not describe Zoostr as a token, a coin, a share of fees or a payout.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v3 · Boostr API · Neynar API

---

*A Sparkz launch by ZAO · Co-built with Boostr · [trysparkz.com](https://trysparkz.com)*
