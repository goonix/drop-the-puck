export interface BoxScorePeriod {
  period: number
  periodType: string
  awayGoals: number
  homeGoals: number
}

export interface BoxScore {
  gameId: number
  gameState: string
  period: number
  periodType: string
  clockTimeRemaining: string
  awayTeamAbbrev: string
  awayTeamName: string
  awayScore: number
  awaySog: number
  homeTeamAbbrev: string
  homeTeamName: string
  homeScore: number
  homeSog: number
  byPeriod: BoxScorePeriod[]
  teamStats: TeamStat[]
  gameOutcome: string | null
}

export interface TeamStat {
  category: string
  awayValue: string | number
  homeValue: string | number
}

export interface ScoringPlay {
  eventId: number
  period: number
  periodType: string
  timeInPeriod: string
  scorerName: string
  scorerTotal: number
  assist1Name: string | null
  assist1Total: number | null
  assist2Name: string | null
  assist2Total: number | null
  teamAbbrev: string
  awayScore: number
  homeScore: number
  goalModifier?: string
  scorerHeadshot?: string | null
}

export interface Play {
  eventId: number
  period: number
  periodType: string
  timeInPeriod: string
  timeRemaining: string
  typeCode: number
  typeDescKey: string
  sortOrder: number
  details: Record<string, unknown>
}

export interface PlayerInfo {
  playerId: number
  name: string
  sweaterNumber: number
  positionCode: string
  headshot: string
}

export interface SkaterStat {
  playerId: number
  sweaterNumber: number
  name: string
  position: string
  goals: number
  assists: number
  points: number
  plusMinus: number
  pim: number
  hits: number
  sog: number
  blockedShots: number
  toi: string
  faceoffWinningPctg: number
  giveaways: number
  takeaways: number
}

export interface GoalieStat {
  playerId: number
  sweaterNumber: number
  name: string
  position: string
  shotsAgainst: number
  saves: number
  goalsAgainst: number
  toi: string
  starter: boolean
}

export interface TeamPlayerStats {
  forwards: SkaterStat[]
  defense: SkaterStat[]
  goalies: GoalieStat[]
}

export interface PlayerGameStats {
  awayTeam: TeamPlayerStats
  homeTeam: TeamPlayerStats
}
