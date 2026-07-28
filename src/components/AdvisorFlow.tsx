'use client'

import { useState } from 'react'
import Link from 'next/link'

type Q1 = 'solo' | 'collab' | 'collective' | 'crowdfund'
type Q2 = 'new' | 'growing' | 'proven'
type Q3 = 'later' | 'now' | 'never'

const FEE = 0.01
const VOLS = [
  { label: '$5k/day', daily: 5_000 },
  { label: '$25k/day', daily: 25_000 },
  { label: '$100k/day', daily: 100_000 },
]

function fmt(n: number) {
  if (n < 0.01) return '<$0.01'
  if (n < 10_000) return `$${Math.round(n).toLocaleString()}`
  return `$${(n / 1_000).toFixed(1)}k`
}

// ─── Recommendation engine ──────────────────────────────────────────────────

type Rec = {
  split: { community: number; creator: number; treasury: number }
  tokenRec: 'now' | 'later' | 'never' | 'splitsheet'
  headline: string
  reasoning: string
  warning?: string
  ctaLabel: string
  ctaHref: string
}

function recommend(q1: Q1, q2: Q2, q3: Q3): Rec {
  // Crowdfund: patronage model — configure the backer split via 0xSplits
  if (q1 === 'crowdfund') {
    return {
      split: { community: 80, creator: 10, treasury: 10 },
      tokenRec: 'never',
      headline: 'Patronage model. Fund the work, not the coin.',
      reasoning:
        'Crowdfunding works best without a speculative token. 80% of any fees go to the backer pool (equal share by contribution), 10% to the creator, 10% to the project treasury. Add a token only if the community pulls for it after the work ships — premature tokens often crash before the project is done.',
      ctaLabel: 'Configure your structure →',
      ctaHref: '/launch',
    }
  }

  // Collab: split-sheet must come first
  if (q1 === 'collab') {
    return {
      split: { community: 20, creator: 70, treasury: 10 },
      tokenRec: 'splitsheet',
      headline: 'Split-sheet first. Always.',
      reasoning:
        'Collab tokens only work when every co-creator has agreed to the split before launch. Set roles (artist / producer / manager), lock percentages into 0xSplits. This is the music-native differentiator — it kills 70% of revenue disputes. The 70% creator allocation routes through 0xSplits so each co-creator claims their own share directly.',
      warning:
        'Never launch a collab token without the split-sheet signed. On-chain is the only source of truth. Configure it in the Sparkz launcher before going live.',
      ctaLabel: 'Configure your split →',
      ctaHref: '/launch',
    }
  }

  // Tokenless forever
  if (q3 === 'never') {
    return {
      split: { community: 1, creator: 97, treasury: 2 },
      tokenRec: 'never',
      headline:
        q1 === 'collective'
          ? 'Collective patronage. No coin, no speculation.'
          : 'Patronage model. No coin, no speculation.',
      reasoning:
        q1 === 'collective'
          ? 'Tokenless collective: community earns via collectables and patronage tiers. Treasury funds governance. Add a token only if the community demands it after the culture is established.'
          : 'Tokenless is a valid long-term choice. 97% of trading fees stay with you. Community earns on-chain collectables as proof of contribution. No speculation, no FUD.',
      ctaLabel: 'Configure your split →',
      ctaHref: '/launch',
    }
  }

  // Collective cases
  if (q1 === 'collective') {
    if (q2 === 'proven' && q3 === 'now') {
      return {
        split: { community: 50, creator: 25, treasury: 25 },
        tokenRec: 'now',
        headline: 'The Zoostr model. Community-first is earned.',
        reasoning:
          "30+ verified contributors proves the community exists. 50% to the leaderboard pool — each person's share grows proportionally with every trade. 25% creator ops, 25% treasury for governance. This is the Zoostr model.",
        ctaLabel: 'Configure your launch →',
        ctaHref: '/launch',
      }
    }
    if (q2 === 'proven') {
      return {
        split: { community: 25, creator: 60, treasury: 15 },
        tokenRec: 'later',
        headline: 'Proven community, choosing to wait. Smart.',
        reasoning:
          "Give contributors 25% now as a public commitment signal. Keep 60% for ops. When you're ready, move to 50/25/25. The token will land on proven ground.",
        ctaLabel: 'Configure your split →',
        ctaHref: '/launch',
      }
    }
    if (q2 === 'growing') {
      return {
        split: { community: 20, creator: 70, treasury: 10 },
        tokenRec: 'later',
        headline: 'Building toward collective. Signal your intent.',
        reasoning:
          '10–30 backers is real traction. Put 20% in the community pool as a public commitment. Token when you hit 30+ consistent contributors and the leaderboard proves itself.',
        ctaLabel: 'Configure your split →',
        ctaHref: '/launch',
      }
    }
    // collective + new
    return {
      split: { community: 10, creator: 80, treasury: 10 },
      tokenRec: 'later',
      headline: 'Collective ambition, early stage. Build the leaderboard first.',
      reasoning:
        'The collective model needs a collective. Start with 10% community as a commitment signal, grow to 50/25/25 as real contributors show up. Token only after the leaderboard is proven.',
      ctaLabel: 'Configure your split →',
      ctaHref: '/launch',
    }
  }

  // Solo cases
  if (q2 === 'proven' && q3 === 'now') {
    return {
      split: { community: 20, creator: 70, treasury: 10 },
      tokenRec: 'now',
      headline: 'Your community has earned it.',
      reasoning:
        '30+ contributors is the Sparkz threshold for a token launch. Creator majority keeps the operation sustainable; community gets a real, on-chain stake. 70/20/10 — proven, sustainable, fair.',
      ctaLabel: 'Configure your launch →',
      ctaHref: '/launch',
    }
  }
  if (q2 === 'proven') {
    return {
      split: { community: 15, creator: 80, treasury: 5 },
      tokenRec: 'later',
      headline: 'Proven community, waiting on the token. Solid.',
      reasoning:
        "Raise the community slice to 15% as a signal of intent. When you're ready to launch, it'll land on solid ground.",
      ctaLabel: 'Configure your split →',
      ctaHref: '/launch',
    }
  }
  if (q2 === 'growing' && q3 === 'now') {
    return {
      split: { community: 15, creator: 75, treasury: 10 },
      tokenRec: 'now',
      headline: 'Early token — proceed carefully.',
      reasoning:
        '10–30 backers is promising, but early tokens without proven community are risky. 75/15/10 is a fair split if you proceed. Have a plan to grow the community share as the leaderboard builds.',
      warning:
        'Zoostr launched at 50% because 30+ boosters had proven themselves first. Early launches without a leaderboard often struggle to maintain value.',
      ctaLabel: 'Configure your launch →',
      ctaHref: '/launch',
    }
  }
  if (q2 === 'growing') {
    return {
      split: { community: 10, creator: 85, treasury: 5 },
      tokenRec: 'later',
      headline: 'Growing momentum. Signal intent, build the leaderboard.',
      reasoning:
        '10–30 backers is real traction. A 10% community pool signals you\'re building toward something bigger. Token when you hit 30+ consistent contributors.',
      ctaLabel: 'Configure your split →',
      ctaHref: '/launch',
    }
  }
  // solo + new
  return {
    split: { community: 1, creator: 97, treasury: 2 },
    tokenRec: 'later',
    headline: 'Creator-first default. Start the spark.',
    reasoning:
      'The Sparkz standard for a new creator. Keep most of the revenue while you build your community. The 1% community slice is a commitment signal — it grows as real contributors show up. Token when 10+ consistent backers prove the community exists.',
    ctaLabel: 'Configure your launch →',
    ctaHref: '/launch',
  }
}

// ─── Option card ─────────────────────────────────────────────────────────────

function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: {
  label: string
  description: string
  icon: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border text-left transition-colors ${
        selected
          ? 'border-gold-500 bg-gold-500/10'
          : 'border-zao-border hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div>
          <div
            className={`font-semibold text-sm mb-0.5 ${
              selected ? 'text-white' : 'text-slate-300'
            }`}
          >
            {label}
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">{description}</div>
        </div>
      </div>
    </button>
  )
}

// ─── Split bar ────────────────────────────────────────────────────────────────

function SplitBar({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-semibold">{pct}%</span>
      </div>
      <div className="h-6 rounded-md bg-zao-dark overflow-hidden">
        <div
          className={`h-full rounded-md bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Token rec badge config ───────────────────────────────────────────────────

const TOKEN_CFG = {
  now: {
    label: 'Token now',
    color: 'text-green-400',
    bg: 'bg-green-950/40',
    border: 'border-green-700/40',
    icon: '🪙',
  },
  later: {
    label: 'Token later',
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
    icon: '📅',
  },
  never: {
    label: 'Tokenless',
    color: 'text-slate-300',
    bg: 'bg-slate-800/40',
    border: 'border-slate-600/40',
    icon: '🚫',
  },
  splitsheet: {
    label: 'After split-sheet',
    color: 'text-zao-violet',
    bg: 'bg-zao-violet/10',
    border: 'border-zao-violet/30',
    icon: '📋',
  },
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdvisorFlow() {
  const [q1, setQ1] = useState<Q1 | null>(null)
  const [q2, setQ2] = useState<Q2 | null>(null)
  const [q3, setQ3] = useState<Q3 | null>(null)
  const [step, setStep] = useState(0) // 0, 1, 2 = questions; 3 = result

  const TOTAL_STEPS = 3
  const done = step === TOTAL_STEPS
  const rec =
    done && q1 && q2 && q3 ? recommend(q1, q2, q3) : null

  const canNext = [q1 !== null, q2 !== null, q3 !== null][step]

  function next() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
    else setStep(TOTAL_STEPS)
  }

  function reset() {
    setQ1(null)
    setQ2(null)
    setQ3(null)
    setStep(0)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!done && (
        <>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    i <= step ? 'bg-gold-500' : 'bg-zao-border'
                  }`}
                />
              </div>
            ))}
            <span className="text-xs text-slate-500 ml-1 flex-shrink-0">
              {step + 1} / 3
            </span>
          </div>

          {/* Q1 */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  What are you building?
                </h2>
                <p className="text-sm text-slate-500">
                  Sparkz adapts the split to your creator shape.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <OptionCard
                  icon="🎤"
                  label="Solo creator"
                  description="I'm the main act — music, content, or brand"
                  selected={q1 === 'solo'}
                  onClick={() => setQ1('solo')}
                />
                <OptionCard
                  icon="🤝"
                  label="Collaboration"
                  description="2+ co-creators, producers, or contributors splitting credit"
                  selected={q1 === 'collab'}
                  onClick={() => setQ1('collab')}
                />
                <OptionCard
                  icon="🏛️"
                  label="Collective"
                  description="Distributed ownership — the community is the product"
                  selected={q1 === 'collective'}
                  onClick={() => setQ1('collective')}
                />
                <OptionCard
                  icon="🚀"
                  label="Crowdfunding a project"
                  description="Raising to fund a specific work, then wind down"
                  selected={q1 === 'crowdfund'}
                  onClick={() => setQ1('crowdfund')}
                />
              </div>
            </div>
          )}

          {/* Q2 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  How proven is your community?
                </h2>
                <p className="text-sm text-slate-500">
                  The split should match how much your community has actually shown up.
                </p>
              </div>
              <div className="space-y-3">
                <OptionCard
                  icon="🌱"
                  label="Just getting started"
                  description="< 10 regular backers — building the leaderboard"
                  selected={q2 === 'new'}
                  onClick={() => setQ2('new')}
                />
                <OptionCard
                  icon="📈"
                  label="Growing momentum"
                  description="10–30 consistent supporters — real traction forming"
                  selected={q2 === 'growing'}
                  onClick={() => setQ2('growing')}
                />
                <OptionCard
                  icon="🔥"
                  label="Community proven"
                  description="30+ verified, active contributors (the Sparkz threshold)"
                  selected={q2 === 'proven'}
                  onClick={() => setQ2('proven')}
                />
              </div>
            </div>
          )}

          {/* Q3 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Coin timing?
                </h2>
                <p className="text-sm text-slate-500">
                  No token required to start — the spark runs without one.
                </p>
              </div>
              <div className="space-y-3">
                <OptionCard
                  icon="📅"
                  label="Token later"
                  description="Build the community first, launch the coin when it's earned"
                  selected={q3 === 'later'}
                  onClick={() => setQ3('later')}
                />
                <OptionCard
                  icon="🪙"
                  label="Token now"
                  description="Community is proven — time to give them a real on-chain stake"
                  selected={q3 === 'now'}
                  onClick={() => setQ3('now')}
                />
                <OptionCard
                  icon="🚫"
                  label="Tokenless forever"
                  description="Patronage + collectables only — no speculative coin"
                  selected={q3 === 'never'}
                  onClick={() => setQ3('never')}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-lg border border-zao-border text-slate-400 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
            >
              {step === 2 ? 'Get recommendation →' : 'Continue →'}
            </button>
          </div>
        </>
      )}

      {/* ─── Result ─── */}
      {done && rec && q1 && q2 && q3 && (
        <div className="space-y-5">
          <div className="card-dark p-7 sm:p-9">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-slate-500 uppercase tracking-widest">
                ZOL recommendation
              </span>
              {(() => {
                const cfg = TOKEN_CFG[rec.tokenRec]
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                )
              })()}
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-5">
              {rec.headline}
            </h2>

            {/* Split bars */}
            <div className="mb-6">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                Recommended fee split (1% per trade)
              </div>
              <div className="space-y-2.5">
                <SplitBar
                  label="Creator / operations"
                  pct={rec.split.creator}
                  color="from-zao-violet to-purple-400"
                />
                <SplitBar
                  label="Community / leaderboard pool"
                  pct={rec.split.community}
                  color="from-gold-500 to-gold-400"
                />
                <SplitBar
                  label="Treasury"
                  pct={rec.split.treasury}
                  color="from-slate-600 to-slate-500"
                />
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {rec.split.creator}% creator · {rec.split.community}% community ·{' '}
                {rec.split.treasury}% treasury · via 0xSplits on Base
              </div>
            </div>

            {/* Weekly pool estimate */}
            {rec.split.community > 0 && (
              <div className="mb-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Community pool — weekly estimate
                </div>
                <div className="flex flex-wrap gap-2">
                  {VOLS.map(({ label, daily }) => {
                    const pool = daily * FEE * (rec.split.community / 100) * 7
                    return (
                      <div
                        key={label}
                        className="flex-1 min-w-[80px] p-3 rounded-lg bg-zao-dark border border-zao-border text-center"
                      >
                        <div className="text-sm font-black text-gold-400">{fmt(pool)}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{label}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Your share = your points ÷ total points · claim at app.splits.org
                </div>
              </div>
            )}

            {/* Reasoning */}
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {rec.reasoning}
            </p>

            {/* Warning */}
            {rec.warning && (
              <div className="p-3 rounded-lg border border-amber-700/40 bg-amber-950/20 text-xs text-amber-400 mb-4">
                ⚠ {rec.warning}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-zao-border">
              <Link
                href={rec.ctaHref}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold transition-colors text-sm"
              >
                {rec.ctaLabel}
              </Link>
              <button
                onClick={reset}
                className="px-4 py-3 rounded-xl border border-zao-border text-slate-400 hover:border-slate-500 text-sm transition-colors"
              >
                Start over ↩
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center">
            Recommendations are based on your inputs — not financial advice. Actual splits
            are configured in the Sparkz launcher and deployed on-chain via 0xSplits.{' '}
            <a
              href="https://trysparkz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400"
            >
              Learn more at trysparkz.com →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
