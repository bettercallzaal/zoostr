import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zao-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <Link href="/" className="font-black text-2xl tracking-tight">
          <span className="text-gradient-gold">ZOO</span>
          <span className="text-white">STR</span>
        </Link>
      </div>

      <h1 className="text-6xl font-black text-gradient-gold mb-4">404</h1>
      <p className="text-xl font-semibold text-white mb-2">Page not found.</p>
      <p className="text-slate-400 mb-10 max-w-sm">
        That page doesn&apos;t exist — but the empire is still here.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold transition-colors"
        >
          Back to Zoostr
        </Link>
        <Link
          href="/leaderboard"
          className="px-6 py-3 rounded-lg border border-zao-border hover:border-gold-500 text-white font-medium transition-colors"
        >
          View leaderboard
        </Link>
      </div>
    </main>
  )
}
