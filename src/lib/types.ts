// Raw shape returned by https://boostr.sahban.dev/api/zabal/stats (Boostr moved off
// boostr.itscashless.com on 2026-11-18). Boostr can send a row with username null, so the
// raw row is typed loosely and normalized in lib/boostr.ts before anything renders it.
export type RawContributor = {
  fid: number
  username: string | null
  followers_count: number | null
  pfp_url: string | null
  zabalLikesCount: number | null
  zabalEnabled: boolean | null
}

export type BoostrApiResponse = {
  success: boolean
  stats: {
    totalCastsLiked: number
    activeContributorsCount: number
    allTimeContributorsCount: number
    totalLikesGenerated: number
    zabalUsers: RawContributor[]
  }
}

// Normalized row: username always a display string ("fid-<n>" when Boostr has none) and
// profileUrl always a working link (by FID when there is no username).
export type Contributor = {
  fid: number
  username: string
  profileUrl: string
  followers_count: number
  pfp_url: string
  zabalLikesCount: number
  zabalEnabled: boolean
}

// Normalized shape used across the app
export type BoostrStats = {
  totalCastsLiked: number
  activeContributorsCount: number
  allTimeContributorsCount: number
  totalLikesGenerated: number
  contributors: Contributor[]
}
