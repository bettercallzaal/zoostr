'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sparkz_anthropic_key'

export default function ByokSettings() {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [hasSavedKey, setHasSavedKey] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? ''
    setKey(stored)
    setHasSavedKey(Boolean(stored))
  }, [])

  function handleSave() {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim())
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setHasSavedKey(Boolean(key.trim()))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleClear() {
    localStorage.removeItem(STORAGE_KEY)
    setKey('')
    setHasSavedKey(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const masked = hasSavedKey && !show
    ? 'sk-ant-' + '•'.repeat(28)
    : key

  return (
    <div className="flex flex-col gap-6">
      {/* Status pill */}
      <div className="flex items-center gap-3">
        {hasSavedKey ? (
          <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-full px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            BYOK active — using your Anthropic key
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-zao-card border border-zao-border rounded-full px-3 py-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            Using treasury compute (free — powered by the 1% upkeep floor)
          </div>
        )}
      </div>

      {/* Key input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="byok-key" className="text-sm font-semibold text-slate-300">
          Anthropic API key
        </label>
        <div className="flex gap-2">
          <input
            id="byok-key"
            type={show ? 'text' : 'password'}
            value={masked}
            onChange={(e) => {
              setKey(e.target.value)
              setHasSavedKey(false)
            }}
            placeholder="sk-ant-api03-..."
            className="flex-1 bg-zao-dark border border-zao-border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60 font-mono"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="px-3 py-2.5 rounded-xl border border-zao-border text-xs text-slate-500 hover:text-slate-400 transition-colors"
            title={show ? 'Hide' : 'Show'}
          >
            {show ? '🙈' : '👁'}
          </button>
        </div>
        <p className="text-xs text-slate-600">
          Your key stays in your browser — never sent to our servers. Get yours at{' '}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400 underline"
          >
            console.anthropic.com
          </a>
          .
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gold-500 text-black text-sm font-bold hover:bg-gold-400 transition-colors"
        >
          {saved ? '✓ Saved' : 'Save key'}
        </button>
        {hasSavedKey && (
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 rounded-xl border border-zao-border text-sm text-slate-500 hover:text-red-400 hover:border-red-900/40 transition-colors"
          >
            Remove key
          </button>
        )}
      </div>
    </div>
  )
}
