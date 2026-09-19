import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 60

// Same locked palette as the landing page: ink, bone, one accent.
const C = {
  ink: '#08080a',
  line: '#1c1c19',
  bone: '#ede9e0',
  dim: '#7e7a70',
  acid: '#c2f53c',
}

type User = {
  fid: number
  username: string
  zabalLikesCount: number
  followers_count: number
  zabalEnabled: boolean
}

function initial(username: string): string {
  return username.replace(/[^a-zA-Z0-9]/g, '')[0]?.toUpperCase() ?? '?'
}

const fmt = (n: number) => n.toLocaleString('en-US')

export async function GET(request: Request) {
  const [syne, monoRegular, monoSemi] = await Promise.all(
    ['Syne-ExtraBold.ttf', 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-SemiBold.ttf'].map((f) =>
      fetch(new URL(`/fonts/${f}`, request.url)).then((r) => r.arrayBuffer())
    )
  )

  // Fetch live data inline (edge-safe, no lib imports)
  let users: User[] = []
  let empire = { active: 0, likes: 0, casts: 0 }

  try {
    const statsUrl =
      process.env.BOOSTR_STATS_URL ?? 'https://boostr.itscashless.com/api/zabaal/stats'
    const res = await fetch(statsUrl, {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const raw = await res.json()
      const s = raw?.stats
      if (s) {
        users = (s.zabalUsers ?? []).sort(
          (a: User, b: User) =>
            b.zabalLikesCount - a.zabalLikesCount || b.followers_count - a.followers_count
        )
        empire = {
          active: s.activeContributorsCount ?? 0,
          likes: s.totalLikesGenerated ?? 0,
          casts: s.totalCastsLiked ?? 0,
        }
      }
    }
  } catch {
    // render with empty data rather than failing
  }

  // Competition ranking so ties share a number, exactly like the page
  const top = users.slice(0, 6).map((u, i) => ({
    ...u,
    rank: 1 + users.filter((o) => o.zabalLikesCount > u.zabalLikesCount).length,
    tied: users.filter((o) => o.zabalLikesCount === u.zabalLikesCount).length > 1,
    i,
  }))

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: C.ink,
          padding: '46px 56px 40px',
          fontFamily: 'IBM Plex Mono',
          boxSizing: 'border-box',
        }}
      >
        {/* Masthead */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${C.line}`,
            paddingBottom: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Syne',
              fontSize: '44px',
              color: C.bone,
              letterSpacing: '-1.5px',
            }}
          >
            ZOOSTR
            <span style={{ color: C.acid }}>.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.acid }}
            />
            <div style={{ fontSize: '15px', color: C.dim, letterSpacing: '3px' }}>
              SPARKZ 001 · ZABAL X BOOSTR
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, paddingTop: '38px' }}>
          {/* Left: the claim + the live counters */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '480px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Syne',
                fontSize: '62px',
                lineHeight: '0.94',
                letterSpacing: '-2px',
              }}
            >
              <div style={{ display: 'flex', color: C.bone }}>The empire,</div>
              <div style={{ display: 'flex', color: C.dim }}>before</div>
              <div style={{ display: 'flex', color: C.dim }}>the token.</div>
            </div>

            <div style={{ display: 'flex', gap: '38px', marginTop: '44px' }}>
              {[
                { label: 'CONTRIBUTORS', value: empire.active },
                { label: 'BOOSTS', value: empire.likes },
                { label: 'CASTS', value: empire.casts },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', color: C.dim, letterSpacing: '2px' }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Syne',
                      fontSize: '34px',
                      color: C.bone,
                      lineHeight: '1',
                    }}
                  >
                    {fmt(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the board */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: '48px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: C.dim,
                letterSpacing: '2.5px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex' }}>LIVE LEADERBOARD</div>
              <div style={{ display: 'flex' }}>BOOSTS</div>
            </div>

            {top.map((u) => (
              <div
                key={u.fid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '11px 0',
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '34px',
                    fontSize: '15px',
                    color: C.dim,
                  }}
                >
                  {u.tied ? '=' : ''}
                  {String(u.rank).padStart(2, '0')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: `1px solid ${C.line}`,
                    background: '#111110',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Syne',
                    fontSize: '15px',
                    color: C.dim,
                  }}
                >
                  {initial(u.username)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    fontSize: '19px',
                    color: C.bone,
                  }}
                >
                  @{u.username}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'Syne',
                    fontSize: '24px',
                    color: u.i === 0 ? C.acid : C.bone,
                  }}
                >
                  {fmt(u.zabalLikesCount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${C.line}`,
            paddingTop: '18px',
            marginTop: '8px',
            fontSize: '13px',
            color: C.dim,
            letterSpacing: '2px',
          }}
        >
          <div style={{ display: 'flex' }}>TOKENLESS-FIRST · SPLITS STILL OPEN</div>
          <div style={{ display: 'flex' }}>ZOOSTR.XYZ</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Syne', data: syne, style: 'normal', weight: 800 },
        { name: 'IBM Plex Mono', data: monoRegular, style: 'normal', weight: 400 },
        { name: 'IBM Plex Mono', data: monoSemi, style: 'normal', weight: 600 },
      ],
    }
  )
}
