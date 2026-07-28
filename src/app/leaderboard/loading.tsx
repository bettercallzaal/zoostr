export default function LeaderboardLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav skeleton */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </div>
          <div className="w-24 h-7 rounded-lg bg-zao-card/60 animate-pulse" />
        </div>
      </nav>

      {/* Header skeleton */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="h-10 w-72 rounded-lg bg-zao-card/60 animate-pulse mb-3" />
            <div className="h-4 w-full max-w-md rounded bg-zao-card/40 animate-pulse mb-2" />
            <div className="h-4 w-64 rounded bg-zao-card/40 animate-pulse mb-3" />
            <div className="flex gap-2 mt-3">
              <div className="h-6 w-40 rounded-full bg-zao-card/40 animate-pulse" />
              <div className="h-6 w-52 rounded-full bg-zao-card/40 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-6 text-center flex-shrink-0">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-8 w-12 rounded bg-zao-card/60 animate-pulse mb-1 mx-auto" />
                <div className="h-3 w-16 rounded bg-zao-card/40 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table skeleton */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg bg-zao-card/40 animate-pulse"
            >
              <div className="w-6 h-4 rounded bg-zao-card/60 flex-shrink-0" />
              <div className="w-10 h-10 rounded-full bg-zao-card/60 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-32 rounded bg-zao-card/60 mb-1" />
                <div className="h-3 w-20 rounded bg-zao-card/40" />
              </div>
              <div className="hidden sm:block h-4 w-16 rounded bg-zao-card/60" />
              <div className="h-4 w-20 rounded bg-zao-card/60" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
