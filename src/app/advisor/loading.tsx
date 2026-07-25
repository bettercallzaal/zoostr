export default function AdvisorLoading() {
  return (
    <main className="min-h-screen bg-zao-dark">
      <div className="border-b border-zao-border bg-zao-card/80 h-14" />
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10">
        <div className="flex justify-center mb-6">
          <div className="h-6 w-52 rounded-full bg-zao-card animate-pulse" />
        </div>
        <div className="h-12 w-80 mx-auto rounded-lg bg-zao-card animate-pulse mb-3" />
        <div className="h-4 w-64 mx-auto rounded bg-zao-card animate-pulse" />
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-zao-border animate-pulse" />
          ))}
        </div>
        <div className="h-7 w-64 rounded-lg bg-zao-card animate-pulse mb-5" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-zao-card animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
