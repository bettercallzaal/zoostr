# Sparkz × Viniapp — Miniapp Integration Spec

> Status: design doc · partnership proposal · not yet built
> Partner: Chris Dolinski (Viniapp) — ingested Sparkz ICM context box, proposed integration
> Context: Sparkz as a Viniapp miniapp + the credits model + Audius catalog connection

---

## What Viniapp is

Viniapp is a music-native miniapp platform. Artists and fans interact through miniapps embedded in the Viniapp experience. Chris's model: $5 → compute credits for non-technical creators who want AI-assisted tools without managing API keys themselves.

This maps directly to Sparkz's BYOK-or-treasury model: Viniapp's $5/credits flow becomes the treasury-funded compute path for creators who onboard through Viniapp.

---

## The integration shape

### Sparkz as a Viniapp miniapp

A Viniapp miniapp is a web app embedded in the Viniapp shell. Sparkz already has:
- A responsive, mobile-ready UI (Tailwind, no heavy dependencies)
- The 3-question advisor flow (3-minute complete)
- The split wizard (role-based, exportable JSON)
- The tiers wizard (patronage tiers, no wallet)
- The Audius connect tool (catalog → engagement metric)

The miniapp surface would be a thin wrapper exposing these routes inside the Viniapp shell, authenticated with the creator's Viniapp session.

**Routes to expose:**
```
/advisor       → AI advisor (BYOK or Viniapp credits)
/split-wizard  → Split sheet setup
/tiers         → Patronage tier config
/audius        → Audius catalog → engagement metric
/lifecycle     → Which stage am I at?
```

**Routes to keep on sparkz.xyz:**
```
/launches      → Public-facing launch registry
/examples      → Spark example templates
/vetted        → ZAO vetting application
```

### The credits model (Viniapp × Sparkz treasury)

**Without BYOK / Viniapp credits:**
- Creator uses the advisor → draws from Sparkz treasury compute pool
- Treasury funded by the 1% compute floor in active splits

**With Viniapp credits ($5 purchase):**
- Creator buys credits in Viniapp → Viniapp forwards compute requests to Anthropic
- Zero draw on Sparkz treasury
- Credits stay in Viniapp's billing system; Sparkz just routes the API call

**With BYOK (power users):**
- Creator brings their own Anthropic key → zero cost to any platform
- Key stored in localStorage (never server-side)

This creates a clean subsidy stack: power users (BYOK) → Viniapp credits ($5 purchase) → Sparkz treasury (floor). Non-technical creators always get access; cost recovery improves as volume scales.

---

## Audius catalog → engagement metric

The Audius integration (sparkz.xyz/audius) already:
1. Takes an Audius handle
2. Fetches user profile, top tracks, play/favorite/repost counts from the Audius API
3. Computes engagement scores per track (plays×1 + favorites×3 + reposts×5)

**With Viniapp integration:**
- Creator logs into Viniapp with their Audius handle (Viniapp supports Audius login)
- Session passes the authenticated handle to the Sparkz miniapp
- Sparkz auto-populates the engagement metric from the authenticated catalog
- No manual handle entry — one-tap setup

**What this unlocks:**
- Creator's stream plays → leaderboard weight → fee split (the fans who stream the most earn the most)
- "I'm going to stream your track because it earns me a higher split share" — aligned incentive between streaming platform engagement and on-chain earnings
- Audius becomes a proof-of-listening layer for the leaderboard, not just a hosting service

---

## Integration milestones

### Phase 1 — No changes to Sparkz needed
- Chris embeds sparkz.xyz/advisor + sparkz.xyz/split-wizard as iframes in Viniapp
- Viniapp passes `?via=viniapp` query param to track originating traffic
- Sparkz shows "via Viniapp" attribution badge when param is present
- No authentication required — just deeplink

### Phase 2 — Viniapp credits routed through Sparkz
- Viniapp calls a Sparkz relay endpoint with their credit pool key
- Sparkz routes Anthropic calls through that key
- `/api/advisor` server route (POST) added to Sparkz — accepts question set + key, returns recommendation
- Requires: `VINIAPP_RELAY_KEY` env var on Sparkz Vercel deployment

### Phase 3 — Authenticated Audius session
- Viniapp passes authenticated Audius user ID to Sparkz miniapp
- Sparkz Audius page auto-loads catalog without handle entry
- `/api/audius?userId=…` server route (currently client-fetch) becomes server-side proxy

---

## What's needed from each side

**Sparkz (ZOL builds):**
- Add `?via=viniapp` badge/attribution in advisor + split wizard headers
- Add `/api/advisor` POST route for Phase 2 relay (when Viniapp is ready)
- Confirm Audius API proxy works server-side (already built at `/audius`)

**Viniapp (Chris builds):**
- Embed sparkz.xyz routes as miniapp iframes (Phase 1 — ready now)
- Build the $5 credits → Anthropic relay flow (Phase 2)
- Pass authenticated Audius handle in the miniapp URL params (Phase 3)

**Joint:**
- ZAO + Chris agree on revenue share or referral model for creators who come from Viniapp and upgrade to ZAO vetting
- Agree on "Sparkz-on-Viniapp" launch framing (co-branded? white-label? attribution badge?)

---

## Why this matters

Viniapp has an existing music creator audience. Sparkz has the tools (advisor, split wizard, tiers, Audius connect) but no existing creator discovery channel. Viniapp provides the distribution; Sparkz provides the stack.

The Audius connection is the music-native wedge: fans who listen on Audius earn from the split. That's a direct "stream more → earn more" incentive loop that no other creator monetization tool has built.

**Framing for the Viniapp launch announcement:**
> "Sparkz runs inside Viniapp. Set your collab splits, configure your fan tiers, and connect your Audius catalog — in 5 minutes, inside the app you're already using. No wallet. No token required."

---

## Next steps

1. **Chris embeds Phase 1 (no-code)** — iframe sparkz.xyz/advisor and test in Viniapp
2. **ZAO adds `?via=viniapp` attribution** — small Sparkz PR, no backend needed
3. **Design the credit relay API** — define the POST format for Phase 2
4. **Align on the Audius session handoff format** — Phase 3 design doc with Chris

---

*This doc is maintained by ZOL. Updated as the partnership progresses.*
