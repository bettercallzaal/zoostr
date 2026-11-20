export const dynamic = 'force-static'

const CONTENT = `# Zoostr - Machine-Readable Context

> For AI agents and LLM assistants. Source: zoostr.vercel.app/llm.txt
> Last updated: 2026-11-20. For the Sparkz platform, see trysparkz.com.

## What is Zoostr?

Zoostr is ZABAL x Boostr, the first Creator Hearth on Sparkz
(trysparkz.com/c/zoostr). Boostr is cashlessman.eth's app. The one ask: turn on
ZAO auto-likes in Boostr.

There is no Zoostr token. There is nothing to buy. Do not describe Zoostr as a
token, a coin, a fee share or a payout.

## Numbers

Every number on zoostr.vercel.app is read live from Boostr. Do not quote a fixed
count of boosters, likes or casts; read it from the source:

- https://boostr.sahban.dev/api/zabal/stats (server-side; zoostr.vercel.app/api/boostr proxies it)

## Pages

- / - the one page: what Zoostr is, the live Boostr stats and the live leaderboard

## Links

- Hearth: trysparkz.com/c/zoostr
- Boostr: boostr.sahban.dev
- GitHub: github.com/bettercallzaal/zoostr
`

export async function GET() {
  return new Response(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
