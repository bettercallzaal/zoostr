export default function LaunchLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav skeleton */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </div>
          <div className="w-20 h-7 rounded-lg bg-zao-card/60 animate-pulse" />
        </div>
      </nav>

      {/* Launch form skeleton */}
      <section className="max-w-3xl mx-auto px-4 pt-14 pb-24">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-10 animate-pulse">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-zao-card/60 flex-shrink-0" />
              {i < 4 && <div className="h-px flex-1 bg-zao-card/40" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="card-dark p-8 animate-pulse">
          <div className="h-4 w-24 rounded bg-zao-card/60 mb-3" />
          <div className="h-7 w-64 rounded-lg bg-zao-card/60 mb-2" />
          <div className="h-5 w-full max-w-sm rounded bg-zao-card/40 mb-8" />

          {/* Form fields */}
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-4 w-28 rounded bg-zao-card/60 mb-2" />
                <div className="h-10 w-full rounded-lg bg-zao-card/40" />
              </div>
            ))}
          </div>

          {/* Next button */}
          <div className="mt-8 h-11 w-28 rounded-lg bg-gold-500/20 animate-pulse" />
        </div>
      </section>
    </main>
  )
}
