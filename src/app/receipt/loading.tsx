export default function ReceiptLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      {/* Nav skeleton */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <span className="text-gradient-gold">ZOO</span>
            <span className="text-white">STR</span>
          </div>
          <div className="w-28 h-7 rounded-lg bg-zao-card/60 animate-pulse" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block h-6 w-36 rounded-full bg-zao-card/60 animate-pulse mb-5" />
          <div className="h-8 w-72 rounded-lg bg-zao-card/60 animate-pulse mx-auto mb-2" />
          <div className="h-4 w-48 rounded bg-zao-card/40 animate-pulse mx-auto" />
        </div>

        {/* Empire stats card */}
        <div className="card-dark p-6">
          <div className="h-3 w-28 rounded bg-zao-card/60 animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-7 w-16 rounded bg-zao-card/60 animate-pulse mb-1" />
                <div className="h-3 w-20 rounded bg-zao-card/40 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Pool calculation card */}
        <div className="card-dark p-6">
          <div className="h-3 w-24 rounded bg-zao-card/60 animate-pulse mb-4" />
          <div className="h-10 w-32 rounded-lg bg-zao-card/60 animate-pulse mb-1" />
          <div className="h-3 w-40 rounded bg-zao-card/40 animate-pulse" />
        </div>

        {/* Distribution table */}
        <div className="card-dark overflow-hidden">
          <div className="px-5 py-4 border-b border-zao-border">
            <div className="h-3 w-32 rounded bg-zao-card/60 animate-pulse" />
          </div>
          <div className="divide-y divide-zao-border/50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 animate-pulse">
                <div className="w-5 h-3 rounded bg-zao-card/60 flex-shrink-0" />
                <div className="w-8 h-8 rounded-full bg-zao-card/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-24 rounded bg-zao-card/60 mb-1" />
                  <div className="h-3 w-16 rounded bg-zao-card/40" />
                </div>
                <div className="h-3 w-10 rounded bg-zao-card/60 hidden sm:block" />
                <div className="h-3 w-12 rounded bg-zao-card/60" />
                <div className="h-4 w-14 rounded bg-zao-card/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
