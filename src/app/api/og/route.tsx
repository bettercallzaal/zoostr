import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 60

const MIN_POINTS = 10

const C = {
  bg: '#0a0a14',
  card: '#12121e',
  border: '#1e1e38',
  gold: '#fbbf24',
  goldDim: '#fbbf2433',
  silver: '#94a3b8',
  silverDim: '#94a3b833',
  bronze: '#b45309',
  bronzeDim: '#b4530933',
  purple: '#8b5cf6',
  green: '#4ade80',
  greenBg: '#052e16',
  greenBorder: '#166534',
  text: '#e2e8f0',
  muted: '#64748b',
}

type User = {
  fid: number
  username: string
  zabalLikesCount: number
  followers_count: number
  zabalEnabled: boolean
}

function initial(username: string): string {
  return username.replace(/[^a-zA-Z]/g, '')[0]?.toUpperCase() ?? '?'
}

function pct(pts: number, total: number): string {
  return total > 0 ? ((pts / total) * 100).toFixed(1) : '0.0'
}

export async function GET() {
  // Fetch live data inline (edge-safe, no lib imports)
  let top3: User[] = []
  let empireStats = { active: 0, allTime: 0, likes: 0, casts: 0 }
  let total = 0

  try {
    const res = await fetch('https://boostr.itscashless.com/api/zabaal/stats', {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const raw = await res.json()
      const s = raw?.stats
      if (s) {
        const users: User[] = (s.zabalUsers ?? [])
          .filter((u: User) => u.zabalEnabled && u.zabalLikesCount >= MIN_POINTS)
          .sort(
            (a: User, b: User) =>
              b.zabalLikesCount - a.zabalLikesCount || b.followers_count - a.followers_count
          )
        top3 = users.slice(0, 3)
        total = users.reduce((sum: number, u: User) => sum + u.zabalLikesCount, 0)
        empireStats = {
          active: s.activeContributorsCount ?? 0,
          allTime: s.allTimeContributorsCount ?? 0,
          likes: s.totalLikesGenerated ?? 0,
          casts: s.totalCastsLiked ?? 0,
        }
      }
    }
  } catch {
    // render with empty data rather than failing
  }

  // Podium display order: 2nd (left), 1st (center), 3rd (right)
  const displayOrder = [1, 0, 2]
  const podiumColor = [C.gold, C.silver, C.bronze]
  const podiumDim = [C.goldDim, C.silverDim, C.bronzeDim]
  const podiumHeight = [176, 136, 112] // px for rank 1, 2, 3

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: C.bg,
          padding: '44px 52px 36px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: C.gold,
                letterSpacing: '-3px',
                lineHeight: '1',
              }}
            >
              ZOOSTR
            </div>
            <div
              style={{
                fontSize: '18px',
                color: C.purple,
                letterSpacing: '3px',
                marginTop: '6px',
              }}
            >
              ZABAL × BOOSTR · A SPARKZ LAUNCH
            </div>
          </div>

          {/* Live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: C.greenBg,
              border: `1px solid ${C.greenBorder}`,
              borderRadius: '20px',
              padding: '8px 18px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: C.green,
              }}
            />
            <div
              style={{
                color: C.green,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1.5px',
              }}
            >
              LIVE
            </div>
          </div>
        </div>

        {/* Podium */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '20px',
            flex: 1,
          }}
        >
          {displayOrder.map((rank) => {
            const user = top3[rank]
            if (!user)
              return (
                <div key={rank} style={{ display: 'flex', width: '260px' }} />
              )
            const color = podiumColor[rank]
            const dim = podiumDim[rank]
            const isFirst = rank === 0
            const circleSz = isFirst ? 84 : 68

            return (
              <div
                key={user.fid}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  width: '260px',
                }}
              >
                {/* Avatar circle */}
                <div
                  style={{
                    width: `${circleSz}px`,
                    height: `${circleSz}px`,
                    borderRadius: '50%',
                    background: dim,
                    border: `2px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isFirst ? '30px' : '24px',
                    fontWeight: 900,
                    color: color,
                  }}
                >
                  {initial(user.username)}
                </div>

                {/* Name + stats */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <div
                    style={{
                      fontSize: isFirst ? '17px' : '15px',
                      color: C.text,
                      fontWeight: 700,
                    }}
                  >
                    @{user.username}
                  </div>
                  <div
                    style={{
                      fontSize: isFirst ? '24px' : '20px',
                      fontWeight: 900,
                      color: color,
                    }}
                  >
                    {user.zabalLikesCount} pts
                  </div>
                  <div style={{ fontSize: '13px', color: C.purple }}>
                    {pct(user.zabalLikesCount, total)}% fee share
                  </div>
                </div>

                {/* Podium block */}
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: `${podiumHeight[rank]}px`,
                    background: dim,
                    border: `1px solid ${color}44`,
                    borderRadius: '8px 8px 0 0',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '40px',
                      fontWeight: 900,
                      color: `${color}33`,
                    }}
                  >
                    #{rank + 1}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom stats bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: 'flex', gap: '36px' }}>
            {[
              { label: 'ACTIVE BOOSTERS', value: empireStats.active },
              { label: 'TOTAL LIKES', value: empireStats.likes },
              { label: 'CASTS LIKED', value: empireStats.casts },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    color: C.gold,
                    lineHeight: '1',
                  }}
                >
                  {value.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: C.muted,
                    letterSpacing: '1.5px',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '16px', color: C.muted }}>zoostr.xyz</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
