export interface TeamStanding {
  teamAbbrev: string
  teamName: string
  teamLogo: string
  conference: string
  division: string
  gamesPlayed: number
  wins: number
  losses: number
  otLosses: number
  points: number
  pointPctg: number
  goalFor: number
  goalAgainst: number
  goalDifferential: number
  streakCode: string
  streakCount: number
  clinchIndicator?: string
  leagueSequence: number
  conferenceSequence: number
  divisionSequence: number
  wildcardSequence: number
}
