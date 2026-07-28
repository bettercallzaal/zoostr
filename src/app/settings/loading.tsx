export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-zao-dark">
      <nav className="border-b border-zao-border bg-zao-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="h-5 w-24 bg-zao-border rounded animate-pulse" />
          <div className="h-4 w-20 bg-zao-border rounded animate-pulse" />
        </div>
      </nav>
      <section className="max-w-2xl mx-auto px-4 pt-16 pb-10 flex flex-col gap-4">
        <div className="h-6 w-36 bg-zao-border rounded-full animate-pulse" />
        <div className="h-12 w-48 bg-zao-border rounded animate-pulse" />
        <div className="h-4 w-80 bg-zao-border rounded animate-pulse" />
      </section>
      <section className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-zao-card border border-zao-border rounded-2xl p-6 flex flex-col gap-4">
          <div className="h-6 w-56 bg-zao-border rounded animate-pulse" />
          <div className="h-4 w-full bg-zao-border rounded animate-pulse" />
          <div className="h-10 w-full bg-zao-border rounded-xl animate-pulse" />
        </div>
      </section>
    </div>
  )
}
