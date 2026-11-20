// Run: npm test (node --test; Node 23.6+ strips TypeScript types natively, no new dependency).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOOSTR_DEFAULT_URL, normalizeStats } from '../src/lib/boostr.ts'

// Shape as served by boostr.sahban.dev on 2026-11-19, trimmed. The second row mirrors the
// live row for FID 1052964, which had username null and failed a whole parse elsewhere.
const live = {
  success: true,
  stats: {
    totalCastsLiked: 383,
    activeContributorsCount: 76,
    allTimeContributorsCount: 94,
    totalLikesGenerated: 22554,
    zabalUsers: [
      { fid: 19640, username: 'zaal', followers_count: 10, pfp_url: 'https://x/p.png', zabalLikesCount: 5, zabalEnabled: true },
      { fid: 1052964, username: null, followers_count: null, pfp_url: null, zabalLikesCount: 3, zabalEnabled: true },
    ],
  },
}

test('default URL is the new Boostr domain and the zabal (not zabaal) path', () => {
  assert.equal(BOOSTR_DEFAULT_URL, 'https://boostr.sahban.dev/api/zabal/stats')
})

test('totals come straight from the Boostr fields', () => {
  const s = normalizeStats(live)
  assert.equal(s.totalCastsLiked, 383)
  assert.equal(s.activeContributorsCount, 76)
  assert.equal(s.allTimeContributorsCount, 94)
  assert.equal(s.totalLikesGenerated, 22554)
})

test('a null username does not fail the parse and still renders and links', () => {
  const s = normalizeStats(live)
  assert.equal(s.contributors.length, 2)
  const anon = s.contributors.find((c) => c.fid === 1052964)
  assert.equal(anon.username, 'fid-1052964')
  assert.equal(anon.profileUrl, 'https://farcaster.xyz/~/profiles/1052964')
  assert.equal(anon.followers_count, 0)
  assert.equal(anon.pfp_url, '')
  const zaal = s.contributors.find((c) => c.fid === 19640)
  assert.equal(zaal.profileUrl, 'https://farcaster.xyz/zaal')
})

test('success false is an error, never an empty board', () => {
  assert.throws(() => normalizeStats({ success: false, stats: live.stats }))
  assert.throws(() => normalizeStats({ success: true }))
})
