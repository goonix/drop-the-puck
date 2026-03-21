export interface BracketTeam {
  id: number
  abbrev: string
  name: string
  logo: string
}

export interface PlayoffSeries {
  seriesLetter: string
  seriesTitle: string
  seriesAbbrev: string
  playoffRound: number
  topSeedRank: number
  topSeedRankAbbrev: string
  topSeedWins: number
  bottomSeedRank: number
  bottomSeedRankAbbrev: string
  bottomSeedWins: number
  topSeedTeam: BracketTeam | null
  bottomSeedTeam: BracketTeam | null
}

export interface BracketData {
  series: PlayoffSeries[]
}
