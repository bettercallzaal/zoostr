'use client'

import { useState } from 'react'

type Draft = {
  variant: 1 | 2 | 3
  angle: string
  text: string
}

export default function ZolApprovePanel({ drafts }: { drafts: Draft[] }) {
  const [selected, setSelected] = useState<1 | 2 | 3 | null>(null)
  const [edited, setEdited] = useState('')

  const activeDraft = selected ? drafts.find(d => d.variant === selected) : null

  const onSelect = (v: 1 | 2 | 3) => {
    setSelected(v)
    const draft = drafts.find(d => d.variant === v)
    if (draft) setEdited(draft.text)
  }

  const composeUrl = activeDraft
    ? `https://warpcast.com/~/compose?text=${encodeURIComponent(edited.slice(0, 1024))}`
    : null

  return (
    <div className="space-y-4">
      {/* Variant cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {drafts.map(d => (
          <button
            key={d.variant}
            onClick={() => onSelect(d.variant)}
            className={`card-dark p-4 text-left transition-colors hover:border-gold-500/30 ${
              selected === d.variant ? 'border-gold-500/60 bg-gold-500/5' : ''
            }`}
          >
            <div className="text-xs font-bold text-gold-400 mb-1">Variant {d.variant}</div>
            <div className="text-sm text-white font-semibold">{d.angle}</div>
            <div className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
              {d.text.slice(0, 120)}…
            </div>
          </button>
        ))}
      </div>

      {/* Full draft + edit */}
      {activeDraft && (
        <div className="card-dark p-6 border-gold-500/20 space-y-4">
          <div className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            Variant {activeDraft.variant} — {activeDraft.angle}
          </div>

          <textarea
            value={edited}
            onChange={e => setEdited(e.target.value)}
            rows={edited.split('\n').length + 2}
            className="w-full bg-zao-dark border border-zao-border rounded-lg p-4 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-gold-500/50 resize-none"
          />

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-slate-500">
              {edited.length} chars
              {edited.length > 1024 && (
                <span className="text-red-400 ml-2">⚠ over Farcaster limit (1024)</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEdited(activeDraft.text)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Reset to draft
              </button>
              {composeUrl && (
                <a
                  href={composeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-sm py-2 px-4 inline-block"
                >
                  Open in Warpcast →
                </a>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Clicking &ldquo;Open in Warpcast&rdquo; takes you to the Warpcast compose screen pre-filled with this text.
            You post it. That&rsquo;s the human gate. ZOL never posts without your final click.
          </p>
        </div>
      )}

      {!selected && (
        <p className="text-sm text-slate-600 text-center py-4">
          Select a variant above to review and approve.
        </p>
      )}
    </div>
  )
}
