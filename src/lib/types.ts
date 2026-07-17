// Raw shape returned by https://boostr.itscashless.com/api/zabaal/stats
export type BoostrApiResponse = {
  success: boolean
  stats: {
    totalCastsLiked: number
    activeContributorsCount: number
    allTimeContributorsCount: number
    totalLikesGenerated: number
    zabalUsers: Contributor[]
  }
}

export type Contributor = {
  fid: number
  username: string
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
