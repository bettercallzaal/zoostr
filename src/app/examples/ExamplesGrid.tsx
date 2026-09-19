'use client'

import { useState } from 'react'
import Link from 'next/link'

type SplitEntry = { label: string; pct: number; note?: string }

export type Example = {
  id: string
  category: 'solo' | 'collab' | 'crowd' | 'community' | 'zao'
  emoji: string
  title: string
  tagline: string
  useCase: string
  split: SplitEntry[]
  highlight: string
  why: string
  wizardSeed?: string
}

const CATEGORIES = [
  { key: 'all', label: 'All templates' },
  { key: 'solo', label: 'Solo artist' },
  { key: 'collab', label: 'Collab' },
  { key: 'crowd', label: 'Crowdfund' },
  { key: 'community', label: 'Community' },
  { key: 'zao', label: 'ZAO-backed' },
]

const CATEGORY_COLORS: Record<string, string> = {
  solo: 'bg-gold-500/10 border-gold-500/30 text-gold-400',
  collab: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  crowd: 'bg-green-500/10 border-green-500/30 text-green-400',
  community: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  zao: 'bg-zao-violet/10 border-zao-violet/30 text-zao-violet',
}

const CATEGORY_LABELS: Record<string, string> = {
  solo: 'Solo',
  collab: 'Collab',
  crowd: 'Crowdfund',
  community: 'Community',
  zao: 'ZAO-backed',
}

export function ExamplesGrid({ examples }: { examples: Example[] }) {
  const [active, setActive] = useState<string>('all')

  const filtered = active === 'all' ? examples : examples.filter((ex) => ex.category === active)

  return (
    <>
      {/* Category pills */}
      <section className="max-w-5xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                active === cat.key
                  ? 'bg-gold-500/20 border-gold-500/50 text-gold-400 font-semibold'
                  : 'border-zao-border text-slate-400 bg-zao-card hover:border-gold-500/30 hover:text-gold-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-3">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}{' '}
          {active === 'all' ? 'below' : `in ${CATEGORIES.find((c) => c.key === active)?.label}`} —
          use any as a starting point in the split wizard
        </p>
      </section>

      {/* Examples grid */}
      <section className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="bg-zao-card border border-zao-border rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Card header */}
            <div className="p-6 pb-4 flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-black text-white text-lg">{ex.title}</h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-semibold ${CATEGORY_COLORS[ex.category]}`}
                  >
                    {CATEGORY_LABELS[ex.category]}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{ex.tagline}</p>
              </div>
            </div>

            {/* Use case */}
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-500 leading-relaxed">{ex.useCase}</p>
            </div>

            {/* Split breakdown */}
            <div className="px-6 pb-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Default split
              </div>
              <div className="space-y-2">
                {ex.split.map((entry) => (
                  <div key={entry.label} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-slate-300 font-medium">{entry.label}</span>
                        <span className="text-xs font-bold text-gold-400 tabular-nums">
                          {entry.pct}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-zao-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                          style={{ width: `${entry.pct}%` }}
                        />
                      </div>
                      {entry.note && (
                        <p className="text-xs text-slate-600 mt-0.5">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight */}
            <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-gold-500/5 border border-gold-500/20">
              <p className="text-xs text-gold-400 font-semibold">{ex.highlight}</p>
            </div>

            {/* Why */}
            <div className="px-6 pb-6 flex-1">
              <p className="text-xs text-slate-500 leading-relaxed">{ex.why}</p>
            </div>

            {/* CTAs */}
            <div className="px-6 pb-6 flex gap-3">
              <Link
                href={`/split-wizard?template=${ex.wizardSeed}`}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-colors"
              >
                Use this template →
              </Link>
              <Link
                href="/advisor"
                className="py-2.5 px-4 rounded-xl text-sm font-bold border border-zao-border text-slate-400 hover:border-zao-violet/50 hover:text-zao-violet transition-colors"
              >
                Ask AI
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
