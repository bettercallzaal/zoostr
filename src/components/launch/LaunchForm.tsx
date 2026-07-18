'use client'

import { useState, useCallback } from 'react'
import {
  DEFAULT_CONFIG,
  METRIC_LABELS,
  METRIC_DESCRIPTIONS,
  GOV_LABELS,
  treasuryPct,
  generateDeployConfig,
  generateLaunchThread,
  generateXThread,
  type LaunchConfig,
  type CommunityMetric,
  type TreasuryGov,
} from '@/lib/launcher'
import StepIndicator from './StepIndicator'
import FeeSplitPreview from './FeeSplitPreview'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-300">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-4 py-2.5 rounded-lg bg-zao-dark border border-zao-border text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm'

const ASSUMED_DAILY_VOL = 10_000

function getAdvisorTip(step: number, cfg: LaunchConfig): string {
  const weeklyVol = ASSUMED_DAILY_VOL * 7
  const fee = 0.01

  switch (step) {
    case 0: {
      if (cfg.creatorHandle) {
        const base = cfg.creatorHandle.replace(/[^a-zA-Z0-9]/g, '')
        const suggested = base.charAt(0).toUpperCase() + base.slice(1) + 'r'
        const tick = (base + 'r').toUpperCase().slice(0, 6)
        return `Based on @${cfg.creatorHandle}: consider "${suggested}" / $${tick}. Pick a name that says what you and your community are building. The ticker should be unmistakable — 4–6 chars.`
      }
      return 'Pick a name that says something about what you and your community are building together. The ticker should be short and unmistakable — 4–6 chars.'
    }
    case 1: {
      const weeklyPool = weeklyVol * fee * (cfg.communityPct / 100)
      const flag =
        cfg.communityPct < 10
          ? ' Creator-first default — the Sparkz platform standard. Grow this as real contributors prove themselves. Zoostr started at 1% and grew to 50% after 30+ consistent boosters.'
          : cfg.communityPct > 60
          ? ' Above 60% leaves little for creator operations. This is Zoostr-level territory — it works when 30+ consistent boosters have proven the leaderboard.'
          : ''
      return `At $${ASSUMED_DAILY_VOL.toLocaleString()}/day, the community pool is ~$${weeklyPool.toFixed(0)}/week.${flag}`
    }
    case 2: {
      const weeklyCreator = weeklyVol * fee * (cfg.creatorPct / 100)
      return `At $${ASSUMED_DAILY_VOL.toLocaleString()}/day, your creator share generates ~$${weeklyCreator.toFixed(0)}/week. Not a grant, not a one-time drop — it runs as long as people trade.`
    }
    case 3: {
      const tPct = treasuryPct(cfg)
      const monthlyTreasury = ASSUMED_DAILY_VOL * 30 * fee * (tPct / 100)
      const flag = tPct < 2 ? ' Treasury below 2% means no governance reserve. Consider leaving at least 2% (the Sparkz standard).' : ''
      return `Treasury accrues ~$${monthlyTreasury.toFixed(0)}/month at $${ASSUMED_DAILY_VOL.toLocaleString()}/day. It's the community's collective wallet — give it a governance model so they know it's theirs.${flag}`
    }
    case 4: {
      const tok = cfg.tokenTicker ? `$${cfg.tokenTicker.toUpperCase().replace(/^\$/, '')}` : 'the token'
      return `ZAO takes a locked ${cfg.zaoStakePct}% token stake — not a fee cut. ZAO holds ${tok} just like your community does. ${cfg.zaoLockMonths}-month lock with 3-month cliff. If the empire wins, everyone wins.`
    }
    default:
      return ''
  }
}

export default function LaunchForm() {
  const [step, setStep] = useState(0)
  const [cfg, setCfg] = useState<LaunchConfig>(DEFAULT_CONFIG)
  const [exported, setExported] = useState<{ config: string; thread: string; xThread: string } | null>(null)
  const [zaoConsent, setZaoConsent] = useState(false)

  const update = useCallback(
    (patch: Partial<LaunchConfig>) => setCfg((prev) => ({ ...prev, ...patch })),
    []
  )

  const updateCommunityPct = (val: number) => {
    const maxCreator = 100 - val
    update({
      communityPct: val,
      creatorPct: Math.min(cfg.creatorPct, maxCreator),
    })
  }

  const updateCreatorPct = (val: number) => {
    const maxCreator = 100 - cfg.communityPct
    update({ creatorPct: Math.min(val, maxCreator) })
  }

  const treasury = treasuryPct(cfg)
  const canProceed = [
    cfg.tokenName.trim() && cfg.tokenTicker.trim() && cfg.creatorHandle.trim(),
    cfg.communityPct >= 1 && cfg.communityPct <= 80,
    cfg.creatorPct >= 10 && treasury >= 0,
    true,
    zaoConsent,
  ][step]

  function handleExport() {
    const config = generateDeployConfig(cfg)
    const thread = generateLaunchThread(cfg)
    const xThread = generateXThread(cfg)
    setExported({ config, thread, xThread })
  }

  function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const ticker = cfg.tokenTicker.toUpperCase().replace(/^\$/, '')

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={step} />

      {/* AI advisor tip */}
      <div className="mb-6 p-4 rounded-xl bg-zao-card border border-zao-border/50 flex gap-3">
        <span className="text-gold-400 text-lg flex-shrink-0">⚡</span>
        <p className="text-sm text-slate-400 leading-relaxed">{getAdvisorTip(step, cfg)}</p>
      </div>

      <div className="card-dark p-8 space-y-6">
        {/* ─── Step 0: Empire ─── */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold text-white">Tell us about your empire.</h2>
            <Field label="Your Farcaster / social handle" hint="e.g. zaal, cashlessman.eth">
              <input
                className={inputCls}
                placeholder="@handle"
                value={cfg.creatorHandle}
                onChange={(e) => update({ creatorHandle: e.target.value.replace(/^@/, '') })}
              />
            </Field>
            <Field label="Token name" hint="e.g. Zoostr, Coolcoin, Empirex">
              <input
                className={inputCls}
                placeholder="Token name"
                value={cfg.tokenName}
                onChange={(e) => update({ tokenName: e.target.value })}
              />
            </Field>
            <Field label="Token ticker" hint="4–6 characters, no $ needed">
              <input
                className={inputCls}
                placeholder="TICKER"
                maxLength={8}
                value={cfg.tokenTicker}
                onChange={(e) => update({ tokenTicker: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
              />
            </Field>
            <Field
              label="One-line description"
              hint="What is this token and who is it for? Goes on clanker.world."
            >
              <input
                className={inputCls}
                placeholder="e.g. Back the empire. 50% of every trading fee goes to the community — by points, weekly."
                value={cfg.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </Field>
          </>
        )}

        {/* ─── Step 1: Community ─── */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-white">How does your community earn their share?</h2>

            <Field label="Community metric">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(METRIC_LABELS) as CommunityMetric[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => update({ communityMetric: key })}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      cfg.communityMetric === key
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-zao-border text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold mb-1">{METRIC_LABELS[key]}</div>
                    <div className="text-xs opacity-70">{METRIC_DESCRIPTIONS[key].split('—')[0]}</div>
                  </button>
                ))}
              </div>
            </Field>

            {cfg.communityMetric === 'leaderboard' && (
              <Field
                label="Leaderboard API endpoint"
                hint="URL that returns your leaderboard scores. Leave blank to fill in later."
              >
                <input
                  className={inputCls}
                  placeholder="https://your-api.com/leaderboard"
                  value={cfg.metricApiUrl}
                  onChange={(e) => update({ metricApiUrl: e.target.value })}
                />
              </Field>
            )}

            <Field
              label={`Minimum threshold — ${cfg.minThreshold} points`}
              hint="Boosters below this are excluded from the split (dust prevention)."
            >
              <input
                type="range"
                min={0}
                max={50}
                value={cfg.minThreshold}
                onChange={(e) => update({ minThreshold: Number(e.target.value) })}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0 (no minimum)</span>
                <span>50 pts</span>
              </div>
            </Field>

            <Field
              label={`Community fee share — ${cfg.communityPct}%`}
              hint="Portion of each trading fee that flows to your community."
            >
              <input
                type="range"
                min={1}
                max={80}
                value={cfg.communityPct}
                onChange={(e) => updateCommunityPct(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1% (creator-first default)</span>
                <span>80% (max)</span>
              </div>
            </Field>

            <FeeSplitPreview cfg={cfg} />
          </>
        )}

        {/* ─── Step 2: Creator ─── */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-white">How does this sustain you?</h2>

            <Field
              label={`Creator fee share — ${cfg.creatorPct}%`}
              hint="Your ongoing income from the empire you built. Runs as long as people trade."
            >
              <input
                type="range"
                min={10}
                max={Math.max(10, 100 - cfg.communityPct)}
                value={cfg.creatorPct}
                onChange={(e) => updateCreatorPct(Number(e.target.value))}
                className="w-full accent-zao-violet"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10% (minimum)</span>
                <span>{100 - cfg.communityPct}% (max given community share)</span>
              </div>
            </Field>

            <Field
              label="Creator wallet address (Base)"
              hint="Ethereum address where your creator share lands. Can be updated later via the 0xSplits controller."
            >
              <input
                className={inputCls}
                placeholder="0x..."
                value={cfg.creatorWallet}
                onChange={(e) => update({ creatorWallet: e.target.value })}
              />
            </Field>

            <FeeSplitPreview cfg={cfg} />
          </>
        )}

        {/* ─── Step 3: Treasury ─── */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-white">What does the community own collectively?</h2>

            <div className="p-4 rounded-xl bg-zao-dark border border-zao-border">
              <div className="text-sm text-slate-400 mb-1">Treasury share (auto-calculated)</div>
              <div className="text-3xl font-black text-white">{treasury}%</div>
              <div className="text-xs text-slate-500 mt-1">
                = 100% − {cfg.communityPct}% community − {cfg.creatorPct}% creator
              </div>
            </div>

            <Field
              label="Treasury governance"
              hint="Who decides how treasury funds are used?"
            >
              <div className="space-y-2">
                {(Object.keys(GOV_LABELS) as TreasuryGov[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => update({ treasuryGov: key })}
                    className={`w-full p-3 rounded-lg border text-left text-sm transition-colors ${
                      cfg.treasuryGov === key
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-zao-border text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {GOV_LABELS[key]}
                  </button>
                ))}
              </div>
            </Field>

            <FeeSplitPreview cfg={cfg} />
          </>
        )}

        {/* ─── Step 4: ZAO Partnership ─── */}
        {step === 4 && !exported && (
          <>
            <h2 className="text-xl font-bold text-white">ZAO backs you — here&apos;s how.</h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zao-dark border border-zao-border">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">ZAO stake terms</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stake size</span>
                    <span className="text-white font-semibold">{cfg.zaoStakePct}% of initial supply</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lock duration</span>
                    <span className="text-white font-semibold">{cfg.zaoLockMonths} months + 3-month cliff</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ZAO fee cut</span>
                    <span className="text-green-400 font-semibold">None — token stake only</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zao-card border border-zao-border/50 text-sm text-slate-400 space-y-2">
                <p>ZAO holds <strong className="text-white">${ticker || 'TOKEN'}</strong> for {cfg.zaoLockMonths} months. ZAO doesn&apos;t take a cut of every trade — ZAO holds the token just like your community does.</p>
                <p>If the empire wins, everyone wins. If it doesn&apos;t, ZAO loses alongside you. That&apos;s the deal.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 accent-gold-500"
                  checked={zaoConsent}
                  onChange={(e) => setZaoConsent(e.target.checked)}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I understand ZAO holds {cfg.zaoStakePct}% of {cfg.tokenName || 'the token'} for {cfg.zaoLockMonths} months with a 3-month cliff. This is publicly disclosed at launch.
                </span>
              </label>
            </div>

            <div className="pt-2 border-t border-zao-border">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest">Full config summary</h3>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Token" value={`${cfg.tokenName} ($${ticker})`} />
                <SummaryRow label="Creator" value={`@${cfg.creatorHandle}`} />
                <SummaryRow label="Community share" value={`${cfg.communityPct}% via ${METRIC_LABELS[cfg.communityMetric]}`} />
                <SummaryRow label="Creator share" value={`${cfg.creatorPct}%`} />
                <SummaryRow label="Treasury" value={`${treasury}% · ${GOV_LABELS[cfg.treasuryGov]}`} />
                <SummaryRow label="Min threshold" value={`${cfg.minThreshold} points`} />
                <SummaryRow label="ZAO stake" value={`${cfg.zaoStakePct}% locked ${cfg.zaoLockMonths}mo`} />
                <SummaryRow label="Chain" value="Base · Clanker v4 · 1% fee" />
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-black text-lg transition-colors"
            >
              Generate deploy config + launch threads ↓
            </button>
          </>
        )}

        {/* ─── Export / Download ─── */}
        {step === 4 && exported && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-xl">✓</span>
              <h2 className="text-xl font-bold text-white">Your config is ready.</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Download both files. Review the deploy config, then follow the steps — the actual deploy is one click on clanker.world.
            </p>

            <div className="space-y-3">
              <button
                onClick={() =>
                  downloadFile(exported.config, `${ticker.toLowerCase() || 'token'}-deploy-config.md`)
                }
                className="w-full py-3 px-5 rounded-lg border border-gold-500 text-gold-400 hover:bg-gold-500/10 font-semibold text-sm transition-colors flex items-center justify-between"
              >
                <span>deploy-config.md</span>
                <span className="text-xs text-slate-500">Step-by-step launch checklist</span>
                <span>↓</span>
              </button>

              <button
                onClick={() =>
                  downloadFile(exported.thread, `${ticker.toLowerCase() || 'token'}-launch-thread-farcaster.md`)
                }
                className="w-full py-3 px-5 rounded-lg border border-zao-border text-slate-300 hover:border-slate-500 font-semibold text-sm transition-colors flex items-center justify-between"
              >
                <span>launch-thread-farcaster.md</span>
                <span className="text-xs text-slate-500">5-cast Farcaster thread</span>
                <span>↓</span>
              </button>

              <button
                onClick={() =>
                  downloadFile(exported.xThread, `${ticker.toLowerCase() || 'token'}-launch-thread-x.md`)
                }
                className="w-full py-3 px-5 rounded-lg border border-zao-border text-slate-300 hover:border-slate-500 font-semibold text-sm transition-colors flex items-center justify-between"
              >
                <span>launch-thread-x.md</span>
                <span className="text-xs text-slate-500">5-tweet X thread + standalone</span>
                <span>↓</span>
              </button>
            </div>

            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`configuring my Sparkz launch ⚡\n\n${cfg.tokenName || 'my token'} ($${ticker || 'TOKEN'})\n${cfg.communityPct}% fee share to the community · ${cfg.creatorPct}% creator\nweekly distribution via 0xSplits\n\nsparkz.xyz/launch`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-zao-violet/40 text-zao-violet hover:border-zao-violet/70 hover:bg-zao-violet/5 text-sm font-semibold transition-colors"
            >
              Cast your launch config ↗
            </a>

            <div className="mt-4 p-4 rounded-xl bg-zao-dark border border-zao-border/50 text-xs text-slate-500 space-y-1">
              <p>• deploy-config.md has the exact Clanker fields and 0xSplits setup steps</p>
              <p>• Fill [SITE_URL] and community numbers in both threads before posting</p>
              <p>• Run <code className="text-slate-400">npm run receipt</code> from the repo for a cast-ready live snapshot</p>
              <p>• The deploy itself is a human action — the config just removes all the guesswork</p>
            </div>

            <button
              onClick={() => { setExported(null); setStep(0); setCfg(DEFAULT_CONFIG); setZaoConsent(false) }}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              Start over ↩
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      {!(step === 4 && exported) && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-lg border border-zao-border text-slate-400 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
          >
            ← Back
          </button>
          {step < 4 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
            >
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-zao-border/40 pb-2">
      <span className="text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  )
}
