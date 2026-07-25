import Link from 'next/link'
import type { Contributor } from '@/lib/types'
import { feeSharePct, isEligible } from '@/lib/boostr'

type Props = {
  contributors: Contributor[]
  totalPoints: number
  showAll?: boolean
}

export default function LeaderboardTable({ contributors, totalPoints, showAll = false }: Props) {
  const rows = showAll ? contributors : contributors.slice(0, 20)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zao-border text-slate-500 text-xs uppercase tracking-wider">
            <th className="text-left py-3 px-4">#</th>
            <th className="text-left py-3 px-4">Booster</th>
            <th className="text-right py-3 px-4">Points</th>
            <th className="text-right py-3 px-4">Followers</th>
            <th className="text-right py-3 px-4">Fee Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr
              key={c.fid}
              className="border-b border-zao-border/50 hover:bg-white/3 transition-colors"
            >
              <td className="py-3 px-4 text-slate-500 font-mono">{i + 1}</td>
              <td className="py-3 px-4">
                <a
                  href={`https://warpcast.com/${c.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={c.pfp_url}
                    alt={c.username}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${c.fid}`
                    }}
                  />
                  <div className="font-medium text-white group-hover:text-gold-400 transition-colors leading-tight">
                    @{c.username}
                  </div>
                </a>
              </td>
              <td className="py-3 px-4 text-right font-bold text-gold-400 tabular-nums">
                {c.zabalLikesCount.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                {c.followers_count.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right font-medium tabular-nums">
                {isEligible(c)
                  ? <span className="text-zao-violet">{feeSharePct(c.zabalLikesCount, totalPoints)}%</span>
                  : <span className="text-slate-600">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!showAll && contributors.length > 20 && (
        <p className="text-center text-slate-500 text-xs py-4">
          <Link href="/leaderboard" className="hover:text-gold-400 transition-colors">
            + {contributors.length - 20} more boosters — see earnings projections →
          </Link>
        </p>
      )}
    </div>
  )
}
