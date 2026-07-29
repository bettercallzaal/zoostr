import { fetchBoostrStats } from '@/lib/boostr'
import BoostBoard from '@/components/BoostBoard'
import type { BoostrStats } from '@/lib/types'

// ISR: the board is regenerated at most once a minute; the client also polls /api/boostr.
export const revalidate = 60

async function getStats(): Promise<BoostrStats | null> {
  try {
    return await fetchBoostrStats()
  } catch {
    return null
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-zoostr-ink text-zoostr-bone">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-6 sm:px-8">
        {/* Masthead */}
        <header className="flex items-center justify-between border-b border-zoostr-line pb-5">
          <span className="font-display text-xl font-extrabold tracking-tight">
            ZOOSTR<span className="text-zoostr-acid">.</span>
          </span>
          <span className="shrink-0 pl-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-zoostr-dim sm:tracking-[0.22em]">
            Sparkz 001
            <span className="hidden sm:inline"> · ZABAL x Boostr</span>
          </span>
        </header>

        {/* Hero */}
        <section className="pb-12 pt-14 sm:pt-20">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-zoostr-acid">
            The first Sparkz launch
          </p>
          <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[0.92] tracking-tight sm:text-[5rem]">
            The empire,
            <br />
            <span className="text-zoostr-dim">before the token.</span>
          </h1>
          <p className="mt-7 max-w-xl font-mono text-sm leading-relaxed text-zoostr-dim">
            Zoostr is tokenless-first. No supply, no splits, nothing to buy - the splits are still
            open and being crowdsourced. What exists today is the people boosting ZABAL Gamez posts
            on Boostr. They <span className="text-zoostr-bone">are</span> the empire. This is them,
            live.
          </p>
        </section>

        <BoostBoard initial={stats} />

        {/* Footer teaser */}
        <footer className="mt-16 border-t border-zoostr-line pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zoostr-dim">
            Three tracks coming
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Artist <span className="text-zoostr-line">/</span> Builder{' '}
            <span className="text-zoostr-line">/</span> Creator
          </p>
          <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-zoostr-dim">
            Tap in by submitting or voting. Not open yet - the leaderboard comes first.
          </p>
          <p className="mt-10 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-zoostr-dim">
            Live from the Boostr API · refreshed every 60s
          </p>
        </footer>
      </div>
    </main>
  )
}
