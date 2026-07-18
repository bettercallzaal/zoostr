export default function ZolLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOL</span>
            <span className="text-white"> · Meme Engine</span>
          </div>
          <div className="w-24 h-4 rounded bg-zao-card/40 animate-pulse" />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 space-y-8">
        {/* Empire stats card */}
        <div className="card-dark p-6 animate-pulse">
          <div className="h-3 w-40 rounded bg-zao-card/60 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 w-16 rounded-lg bg-zao-card/60 mb-1" />
                <div className="h-3 w-24 rounded bg-zao-card/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 earners card */}
        <div className="card-dark p-6 animate-pulse">
          <div className="h-3 w-36 rounded bg-zao-card/60 mb-4" />
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-zao-card/40" />
                  <div className="w-6 h-6 rounded-full bg-zao-card/60" />
                  <div className="h-4 w-28 rounded bg-zao-card/60" />
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-10 rounded bg-zao-card/40" />
                  <div className="h-4 w-20 rounded bg-zao-card/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Draft variants */}
        <div className="animate-pulse">
          <div className="h-3 w-52 rounded bg-zao-card/60 mb-4" />
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-dark p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-32 rounded bg-zao-card/60" />
                  <div className="h-4 w-20 rounded bg-zao-card/40" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-zao-card/40" />
                  <div className="h-3 w-5/6 rounded bg-zao-card/40" />
                  <div className="h-3 w-4/6 rounded bg-zao-card/40" />
                  <div className="h-3 w-3/4 rounded bg-zao-card/40" />
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="h-9 w-32 rounded-lg bg-zao-card/60" />
                  <div className="h-9 w-40 rounded-lg bg-zao-card/40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loop guide card */}
        <div className="card-dark p-6 animate-pulse">
          <div className="h-3 w-36 rounded bg-zao-card/60 mb-4" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-4 w-32 rounded bg-zao-card/60 mb-2" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-zao-card/40" />
                  <div className="h-3 w-5/6 rounded bg-zao-card/40" />
                  <div className="h-3 w-4/6 rounded bg-zao-card/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
