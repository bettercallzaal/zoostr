import { NextResponse } from 'next/server'

const APP_NAME = 'Sparkz'
const DISCOVERY_NODE = 'https://discoveryprovider.audius.co'

export const runtime = 'edge'
export const revalidate = 300

interface AudiusUser {
  id: string
  handle: string
  name: string
  follower_count: number
  track_count: number
  profile_picture?: { '150x150'?: string; '480x480'?: string }
  cover_photo?: { '640x'?: string }
  bio?: string
}

interface AudiusTrack {
  id: string
  title: string
  play_count: number
  favorite_count: number
  repost_count: number
  duration: number
  genre: string
  mood?: string
  release_date?: string
  artwork?: { '150x150'?: string }
  permalink: string
  user: { handle: string; name: string }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get('handle')?.toLowerCase().replace(/^@/, '').trim()

  if (!handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  try {
    // Search for the user
    const searchRes = await fetch(
      `${DISCOVERY_NODE}/v1/users/search?query=${encodeURIComponent(handle)}&app_name=${APP_NAME}`,
      { next: { revalidate: 300 } },
    )
    if (!searchRes.ok) throw new Error('Audius search failed')
    const searchData = await searchRes.json()
    const users: AudiusUser[] = searchData.data ?? []

    // Find exact handle match first, then closest
    const user =
      users.find((u) => u.handle.toLowerCase() === handle) ??
      users[0]

    if (!user) {
      return NextResponse.json({ error: 'User not found on Audius' }, { status: 404 })
    }

    // Fetch their tracks
    const tracksRes = await fetch(
      `${DISCOVERY_NODE}/v1/users/${user.id}/tracks?limit=12&app_name=${APP_NAME}`,
      { next: { revalidate: 300 } },
    )
    if (!tracksRes.ok) throw new Error('Audius tracks fetch failed')
    const tracksData = await tracksRes.json()
    const tracks: AudiusTrack[] = tracksData.data ?? []

    return NextResponse.json({ user, tracks })
  } catch (err) {
    console.error('Audius API error:', err)
    return NextResponse.json(
      { error: 'Could not reach Audius — try again' },
      { status: 502 },
    )
  }
}
