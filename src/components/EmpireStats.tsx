type Props = {
  activeContributorsCount: number
  totalLikesGenerated: number
  totalCastsLiked: number
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl sm:text-3xl font-bold text-gradient-gold tabular-nums">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function EmpireStats({ activeContributorsCount, totalLikesGenerated, totalCastsLiked }: Props) {
  return (
    <div className="card-dark glow-gold p-6 sm:p-8">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
        <Stat label="Active Boosters" value={activeContributorsCount} />
        <Stat label="Total Likes" value={totalLikesGenerated} />
        <Stat label="Casts Liked" value={totalCastsLiked} />
      </div>
    </div>
  )
}
