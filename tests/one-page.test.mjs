// Guard for website option B (Zaal, 2026-11-19): zoostr.vercel.app is one page, real numbers
// only, no token era. Fails if a token-era claim or a dead Boostr URL comes back on anything
// that still serves, or if a page route exists that is not redirected to /.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const LIVE_FILES = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/llm.txt/route.ts',
  'src/app/api/og/route.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/components/BoostBoard.tsx',
  'src/lib/boostr.ts',
]

const BANNED = [
  { name: 'a count like 50+ boosters', re: /\b\d+\+\s*(boosters|people|members|backers)\b/i },
  { name: '$ZOOSTR', re: /\$ZOOSTR/ },
  { name: 'Clanker', re: /clanker/i },
  { name: 'graduated', re: /\bgraduated\b/i },
  { name: 'receipt', re: /receipt/i },
  { name: 'dead Boostr domain', re: /itscashless/i },
  { name: 'old zabaal typo path', re: /zabaal/i },
  { name: 'dead zoostr.xyz domain', re: /zoostr\.xyz/i },
  { name: 'before the token', re: /before the token/i },
  { name: 'the token', re: /the token/i },
  { name: 'splits still open', re: /splits? (are|is) still open/i },
  { name: 'tokenless-first', re: /tokenless-first/i },
  { name: 'fee share', re: /fee share/i },
]

test('files that still serve carry no token-era claim or dead URL', () => {
  const found = []
  for (const f of LIVE_FILES) {
    assert.ok(existsSync(f), `missing ${f}`)
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      for (const b of BANNED) if (b.re.test(line)) found.push(`${f}:${i + 1} ${b.name}`)
    })
  }
  assert.deepEqual(found, [])
})

test('every page route other than / redirects to /', () => {
  const config = readFileSync('next.config.ts', 'utf8')
  const missing = []
  for (const name of readdirSync('src/app')) {
    const dir = join('src/app', name)
    if (!statSync(dir).isDirectory() || name === 'api') continue
    if (existsSync(join(dir, 'page.tsx')) && !config.includes(`'/${name}'`)) missing.push(name)
  }
  assert.deepEqual(missing, [])
})
