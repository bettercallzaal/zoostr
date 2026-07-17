'use client'

const STEPS = [
  'Empire',
  'Community',
  'Creator',
  'Treasury',
  'Review',
]

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : active
                    ? 'bg-transparent border-gold-400 text-gold-400'
                    : 'bg-transparent border-zao-border text-slate-600'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-1 whitespace-nowrap ${
                  active ? 'text-gold-400 font-semibold' : done ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 mb-4 ${i < current ? 'bg-gold-500' : 'bg-zao-border'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
