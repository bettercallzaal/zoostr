export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-zoostr-ink text-zoostr-bone">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-zoostr-line pb-5">
          <span className="font-display text-xl font-extrabold tracking-tight">
            ZOOSTR<span className="text-zoostr-acid">.</span>
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-zoostr-dim">
            Sparkz 001
          </span>
        </header>

        <section className="pb-12 pt-14 sm:pt-20">
          <div className="h-3 w-44 animate-pulse bg-zoostr-line" />
          <div className="mt-6 h-10 w-4/5 animate-pulse bg-zoostr-line sm:h-16" />
          <div className="mt-3 h-10 w-3/5 animate-pulse bg-zoostr-line sm:h-16" />
          <div className="mt-7 h-3 w-full max-w-xl animate-pulse bg-zoostr-line/70" />
          <div className="mt-2 h-3 w-2/3 max-w-md animate-pulse bg-zoostr-line/70" />
        </section>

        <div className="grid grid-cols-2 gap-6 border-y border-zoostr-line py-6 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-2.5 w-24 animate-pulse bg-zoostr-line" />
              <div className="mt-2 h-7 w-16 animate-pulse bg-zoostr-line" />
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-zoostr-line/70 pb-4">
              <div className="h-3 w-6 animate-pulse bg-zoostr-line" />
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zoostr-line" />
              <div className="flex-1">
                <div className="h-3 w-32 animate-pulse bg-zoostr-line" />
                <div className="mt-1.5 h-2 w-20 animate-pulse bg-zoostr-line/70" />
              </div>
              <div className="h-4 w-10 animate-pulse bg-zoostr-line" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
