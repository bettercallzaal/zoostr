export type Contributor = {
  fid: number
  username: string
  display_name: string
  pfp_url: string
  followers_count: number
  zabalLikesCount: number
}

export type BoostrStats = {
  activeContributorsCount: number
  totalLikesGenerated: number
  totalCastsLiked: number
  contributors: Contributor[]
}
