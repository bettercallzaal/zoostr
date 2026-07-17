import type { Contributor } from '@/lib/types'
import { feeSharePct } from '@/lib/boostr'

type Props = {
  top3: Contributor[]
  totalPoints: number
}

const MEDALS = ['🥇', '🥈', '🥉']
const HEIGHTS = ['h-32', 'h-24', 'h-20']
const ORDERS = ['order-2', 'order-1', 'order-3'] // 1st center, 2nd left, 3rd right

function PodiumCard({
  contributor,
  rank,
  totalPoints,
}: {
  contributor: Contributor
  rank: number
  totalPoints: number
}) {
  const shareStr = feeSharePct(contributor.zabalLikesCount, totalPoints)

  return (
    <div className={`flex flex-col items-center gap-2 ${ORDERS[rank - 1]}`}>
      <div
        className={`relative ${rank === 1 ? 'scale-110' : ''}`}
      >
        {rank === 1 && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 blur-md opacity-60" />
        )}
        <img
          src={contributor.pfp_url}
          alt={contributor.display_name}
          width={rank === 1 ? 80 : 64}
          height={rank === 1 ? 80 : 64}
          className={`relative rounded-full border-2 ${
            rank === 1 ? 'border-gold-400' : rank === 2 ? 'border-slate-400' : 'border-amber-700'
          }`}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${contributor.fid}`
          }}
        />
      </div>

      <div className="text-center">
        <div className="text-base font-semibold text-white leading-tight">
          {MEDALS[rank - 1]} {contributor.display_name}
        </div>
        <div className="text-xs text-slate-400">@{contributor.username}</div>
        <div className="mt-1 text-sm font-bold text-gradient-gold">
          {contributor.zabalLikesCount.toLocaleString()} pts
        </div>
        <div className="text-xs text-zao-violet">{shareStr}% fee share</div>
      </div>

      <div
        className={`w-24 sm:w-32 ${HEIGHTS[rank - 1]} rounded-t-lg flex items-end justify-center pb-2 ${
          rank === 1
            ? 'bg-gradient-to-t from-gold-600 to-gold-400'
            : rank === 2
            ? 'bg-gradient-to-t from-slate-600 to-slate-400'
            : 'bg-gradient-to-t from-amber-900 to-amber-700'
        }`}
      >
        <span className="text-2xl font-black text-white/30">#{rank}</span>
      </div>
    </div>
  )
}

export default function Podium({ top3, totalPoints }: Props) {
  if (top3.length === 0) return null

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-slate-300 mb-8 uppercase tracking-widest">
        Top Boosters
      </h2>
      <div className="flex items-end justify-center gap-4 sm:gap-8">
        {top3.map((c, i) => (
          <PodiumCard key={c.fid} contributor={c} rank={i + 1} totalPoints={totalPoints} />
        ))}
      </div>
    </div>
  )
}
