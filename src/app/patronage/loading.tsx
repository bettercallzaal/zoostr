export default function PatronageLoading() {
  return (
    <div className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="h-5 w-24 bg-zao-border rounded animate-pulse" />
          <div className="h-4 w-40 bg-zao-border rounded animate-pulse" />
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 flex flex-col items-center gap-4">
        <div className="h-6 w-48 bg-zao-border rounded-full animate-pulse" />
        <div className="h-12 w-64 bg-zao-border rounded animate-pulse" />
        <div className="h-4 w-96 bg-zao-border rounded animate-pulse" />
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-zao-border bg-zao-card p-5 flex flex-col gap-3">
              <div className="h-8 w-8 bg-zao-border rounded animate-pulse" />
              <div className="h-5 w-32 bg-zao-border rounded animate-pulse" />
              <div className="h-10 w-full bg-zao-border rounded-xl animate-pulse mt-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
