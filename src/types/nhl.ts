// Raw NHL API response types

export interface NHLTeamRef {
  id: number;
  abbrev: string;
  placeName: { default: string };
  commonName: { default: string };
  logo: string;
  darkLogo?: string;
}

export interface NHLGoal {
  period: number;
  periodDescriptor: { number: number; periodType: string };
  timeInPeriod: string;
  playerId: number;
  name: { default: string };
  firstName: { default: string };
  lastName: { default: string };
  goalModifier: string;
  assists: Array<{ playerId: number; name: { default: string } }>;
  teamAbbrev: { default: string };
  headshot: string;
  highlightClipSharingUrl?: string;
}

export interface NHLScoreGame {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  gameState: string;
  gameScheduleState: string;
  awayTeam: NHLTeamRef & { score?: number; sog?: number };
  homeTeam: NHLTeamRef & { score?: number; sog?: number };
  clock?: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  period?: number;
  periodDescriptor?: { number: number; periodType: string; maxRegulationPeriods: number };
  goals: NHLGoal[];
  venue: { default: string };
  tvBroadcasts: Array<{ id: number; market: string; countryCode: string; network: string }>;
  gameOutcome?: { lastPeriodType: string };
  threeMinRecap?: string;
}

export interface NHLScoreResponse {
  prevDate: string;
  currentDate: string;
  nextDate: string;
  games: NHLScoreGame[];
}

export interface NHLStanding {
  conferenceAbbrev: string;
  conferenceName: string;
  divisionAbbrev: string;
  divisionName: string;
  teamName: { default: string };
  teamAbbrev: { default: string };
  teamLogo: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  pointPctg: number;
  goalFor: number;
  goalAgainst: number;
  goalDifferential: number;
  homeWins: number;
  homeLosses: number;
  homeOtLosses: number;
  roadWins: number;
  roadLosses: number;
  roadOtLosses: number;
  l10Wins: number;
  l10Losses: number;
  l10OtLosses: number;
  streakCode: string;
  streakCount: number;
  placeName: { default: string };
  clinchIndicator?: string;
  wildcardSequence: number;
  leagueSequence: number;
  conferenceSequence: number;
  divisionSequence: number;
}

export interface NHLStandingsResponse {
  wildCardIndicator: boolean;
  standings: NHLStanding[];
}

export interface NHLBoxScorePeriod {
  period: number;
  periodDescriptor: { number: number; periodType: string };
  away: number;
  home: number;
}

export interface NHLBoxScoreTeam {
  id: number;
  commonName?: { default: string };
  name?: { default: string };
  abbrev: string;
  logo?: string;
  score: number;
  sog: number;
}

export interface NHLBoxScoreResponse {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  gameState: string;
  gameScheduleState: string;
  awayTeam: NHLBoxScoreTeam;
  homeTeam: NHLBoxScoreTeam;
  clock?: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  period?: number;
  periodDescriptor?: { number: number; periodType: string; maxRegulationPeriods: number };
  linescore?: {
    byPeriod: NHLBoxScorePeriod[];
    totals: { away: number; home: number };
  };
  gameOutcome?: { lastPeriodType: string };
  teamGameStats?: Array<{
    category: string;
    awayValue: string | number;
    homeValue: string | number;
  }>;
}

export interface NHLPlay {
  eventId: number;
  periodDescriptor: { number: number; periodType: string; maxRegulationPeriods: number };
  timeInPeriod: string;
  timeRemaining: string;
  situationCode: string;
  homeTeamDefendingSide: string;
  typeCode: number;
  typeDescKey: string;
  sortOrder: number;
  details?: {
    eventOwnerTeamId?: number;
    losingPlayerId?: number;
    winningPlayerId?: number;
    scoringPlayerId?: number;
    scoringPlayerTotal?: number;
    assist1PlayerId?: number;
    assist1PlayerTotal?: number;
    assist2PlayerId?: number;
    assist2PlayerTotal?: number;
    goalieInNetId?: number;
    awayScore?: number;
    homeScore?: number;
    shotType?: string;
    shootingPlayerId?: number;
    blockingPlayerId?: number;
    reason?: string;
    hittingPlayerId?: number;
    hitteePlayerId?: number;
    playerId?: number;
    descKey?: string;
    duration?: number;
    committedByPlayerId?: number;
    drawnByPlayerId?: number;
    xCoord?: number;
    yCoord?: number;
    zoneCode?: string;
  };
}

export interface NHLRoster {
  playerId: number;
  firstName: { default: string };
  lastName: { default: string };
  sweaterNumber: number;
  positionCode: string;
  headshot: string;
}

export interface NHLPlayByPlayResponse {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  gameState: string;
  awayTeam: { id: number; name: { default: string }; abbrev: string; logo: string; score: number };
  homeTeam: { id: number; name: { default: string }; abbrev: string; logo: string; score: number };
  clock?: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  period?: number;
  periodDescriptor?: { number: number; periodType: string };
  plays: NHLPlay[];
  rosterSpots: NHLRoster[];
}
