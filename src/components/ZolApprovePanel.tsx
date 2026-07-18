'use client'

import { useState } from 'react'

type Draft = {
  variant: 1 | 2 | 3
  angle: string
  text: string
}

type PostState = 'idle' | 'posting' | 'posted' | 'error'

export default function ZolApprovePanel({ drafts }: { drafts: Draft[] }) {
  const [selected, setSelected] = useState<1 | 2 | 3 | null>(null)
  const [edited, setEdited] = useState('')
  const [postState, setPostState] = useState<PostState>('idle')
  const [postResult, setPostResult] = useState<{ hash?: string; error?: string } | null>(null)

  const activeDraft = selected ? drafts.find(d => d.variant === selected) : null

  const onSelect = (v: 1 | 2 | 3) => {
    setSelected(v)
    const draft = drafts.find(d => d.variant === v)
    if (draft) setEdited(draft.text)
    setPostState('idle')
    setPostResult(null)
  }

  const composeUrl = activeDraft
    ? `https://warpcast.com/~/compose?text=${encodeURIComponent(edited.slice(0, 1024))}`
    : null

  const postViaNeynar = async () => {
    if (!activeDraft || edited.length > 1024) return
    setPostState('posting')
    setPostResult(null)
    try {
      const res = await fetch('/api/zol/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: edited }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPostResult({ error: data.error ?? `HTTP ${res.status}` })
        setPostState('error')
      } else {
        setPostResult({ hash: data.cast_hash })
        setPostState('posted')
      }
    } catch (err) {
      setPostResult({ error: err instanceof Error ? err.message : 'Network error' })
      setPostState('error')
    }
  }

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
            onChange={e => {
              setEdited(e.target.value)
              setPostState('idle')
              setPostResult(null)
            }}
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
            <div className="flex gap-3 flex-wrap justify-end">
              <button
                onClick={() => {
                  setEdited(activeDraft.text)
                  setPostState('idle')
                  setPostResult(null)
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Reset to draft
              </button>
              <button
                onClick={postViaNeynar}
                disabled={postState === 'posting' || postState === 'posted' || edited.length > 1024}
                className="text-sm py-2 px-4 rounded-lg border border-zao-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {postState === 'posting' ? 'Posting…' : postState === 'posted' ? '✓ Posted' : 'Post via ZOL →'}
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

          {postState === 'posted' && postResult?.hash && (
            <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
              Cast posted — hash: <span className="font-mono">{postResult.hash}</span>
            </div>
          )}
          {postState === 'error' && postResult?.error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {postResult.error}
              {postResult.error.includes('NEYNAR') && (
                <span className="text-slate-500"> — set NEYNAR_API_KEY + NEYNAR_SIGNER_UUID in Vercel env vars, or use Warpcast</span>
              )}
            </div>
          )}

          <p className="text-xs text-slate-700 leading-relaxed">
            &ldquo;Post via ZOL&rdquo; calls Neynar directly (requires NEYNAR_API_KEY + NEYNAR_SIGNER_UUID).
            &ldquo;Open in Warpcast&rdquo; is always available as the fallback — you post it manually.
            That&rsquo;s the human gate. ZOL never posts without your final click.
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
