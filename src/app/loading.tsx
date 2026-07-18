export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav skeleton */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-7 rounded-lg bg-zao-card/60 animate-pulse hidden sm:block" />
            <div className="w-28 h-8 rounded-lg bg-zao-card/60 animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero skeleton */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-block h-6 w-44 rounded-full bg-zao-card/60 animate-pulse mb-8" />
        <div className="h-16 w-full max-w-2xl rounded-xl bg-zao-card/60 animate-pulse mx-auto mb-3" />
        <div className="h-16 w-3/4 max-w-xl rounded-xl bg-zao-card/60 animate-pulse mx-auto mb-6" />
        <div className="h-5 w-full max-w-lg rounded bg-zao-card/40 animate-pulse mx-auto mb-2" />
        <div className="h-5 w-2/3 max-w-md rounded bg-zao-card/40 animate-pulse mx-auto mb-10" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="h-12 w-40 rounded-lg bg-gold-500/20 animate-pulse" />
          <div className="h-12 w-36 rounded-lg bg-zao-card/60 animate-pulse" />
        </div>
      </section>

      {/* Leaderboard preview skeleton */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg bg-zao-card/40 animate-pulse"
            >
              <div className="w-6 h-4 rounded bg-zao-card/60 flex-shrink-0" />
              <div className="w-10 h-10 rounded-full bg-zao-card/60 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-28 rounded bg-zao-card/60 mb-1" />
                <div className="h-3 w-20 rounded bg-zao-card/40" />
              </div>
              <div className="h-4 w-16 rounded bg-zao-card/60 hidden sm:block" />
            </div>
          ))}
        </div>
      </section>

      {/* Tokenomics section skeleton */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="card-dark p-8 animate-pulse">
          <div className="h-7 w-48 rounded-lg bg-zao-card/60 mb-3" />
          <div className="h-5 w-full max-w-lg rounded bg-zao-card/40 mb-2" />
          <div className="h-5 w-3/4 rounded bg-zao-card/40 mb-6" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-zao-card/40" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
