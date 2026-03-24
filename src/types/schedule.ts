export type GameState = 'FUT' | 'PRE' | 'LIVE' | 'CRIT' | 'FINAL' | 'OFF';

export interface NormalizedGame {
  id: number;
  date: string;
  startTimeUTC: string;
  gameState: GameState;
  period: number;
  periodType: string;
  clockTimeRemaining: string;
  clockRunning: boolean;
  inIntermission: boolean;
  awayTeamAbbrev: string;
  awayTeamName: string;
  awayScore: number;
  awaySog: number;
  homeTeamAbbrev: string;
  homeTeamName: string;
  homeScore: number;
  homeSog: number;
  venue: string;
  gameOutcome: string | null;
  goals: NormalizedGoal[];
  tvBroadcasts: { network: string; market: string; countryCode: string }[];
}

export interface NormalizedGoal {
  period: number;
  periodType: string;
  timeInPeriod: string;
  scorerName: string;
  teamAbbrev: string;
  assists: string[];
  goalModifier: string;
}
