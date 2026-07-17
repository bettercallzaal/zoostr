'use client'

import { treasuryPct, type LaunchConfig } from '@/lib/launcher'

export default function FeeSplitPreview({ cfg }: { cfg: LaunchConfig }) {
  const treasury = treasuryPct(cfg)
  const bars = [
    { label: 'Community', pct: cfg.communityPct, color: 'bg-gold-500' },
    { label: 'Creator', pct: cfg.creatorPct, color: 'bg-zao-violet' },
    { label: 'Treasury', pct: treasury, color: 'bg-slate-600' },
  ]

  return (
    <div className="p-4 rounded-xl bg-zao-dark border border-zao-border">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">
        Fee split preview (1% per trade)
      </div>

      {/* Stacked bar */}
      <div className="h-6 rounded-full overflow-hidden flex mb-3">
        {bars.map(({ label, pct, color }) =>
          pct > 0 ? (
            <div
              key={label}
              className={`${color} flex items-center justify-center text-xs font-bold text-black/60`}
              style={{ width: `${pct}%`, minWidth: pct > 0 ? '2rem' : 0 }}
            >
              {pct >= 12 ? `${pct}%` : ''}
            </div>
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {bars.map(({ label, pct, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-slate-400">
              {label} <span className="text-white font-semibold">{pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
