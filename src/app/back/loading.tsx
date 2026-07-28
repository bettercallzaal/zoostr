export default function BackLoading() {
  return (
    <div className="min-h-screen bg-zao-dark">
      {/* Nav skeleton */}
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="h-5 w-24 bg-zao-border rounded animate-pulse" />
          <div className="h-4 w-36 bg-zao-border rounded animate-pulse" />
        </div>
      </nav>

      {/* Header skeleton */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-10 flex flex-col items-center gap-4">
        <div className="h-6 w-40 bg-zao-border rounded-full animate-pulse" />
        <div className="h-12 w-72 bg-zao-border rounded animate-pulse" />
        <div className="h-4 w-80 bg-zao-border rounded animate-pulse" />
      </section>

      {/* Tiers skeleton */}
      <section className="max-w-3xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-zao-border bg-zao-card p-6 flex flex-col gap-4">
            <div className="h-6 w-20 bg-zao-border rounded animate-pulse" />
            <div className="h-10 w-24 bg-zao-border rounded animate-pulse" />
            <div className="h-4 w-full bg-zao-border rounded animate-pulse" />
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-3 w-full bg-zao-border rounded animate-pulse" />
              ))}
            </div>
            <div className="h-10 w-full bg-zao-border rounded-xl animate-pulse mt-auto" />
          </div>
        ))}
      </section>
    </div>
  )
}
