import type { NormalizedGame } from '../types/schedule';
import type { NHLScoreGame } from '../types/nhl';
import { formatGameTime } from './dateUtils';

export function isLive(game: NormalizedGame): boolean {
  return game.gameState === 'LIVE' || game.gameState === 'CRIT';
}

export function isFinal(game: NormalizedGame): boolean {
  return game.gameState === 'FINAL' || game.gameState === 'OFF';
}

export function isFuture(game: NormalizedGame): boolean {
  return game.gameState === 'FUT' || game.gameState === 'PRE';
}

export function getGameStatus(game: NormalizedGame): string {
  if (isFinal(game)) {
    if (game.gameOutcome && game.gameOutcome !== 'REG') {
      return `Final/${game.gameOutcome}`;
    }
    return 'Final';
  }
  if (isLive(game)) {
    if (game.inIntermission) {
      return `INT - P${game.period}`;
    }
    if (game.periodType === 'OT') return `OT ${game.clockTimeRemaining}`;
    if (game.periodType === 'SO') return 'SO';
    return `P${game.period} ${game.clockTimeRemaining}`;
  }
  return formatGameTime(game.startTimeUTC);
}

export function normalizeGame(raw: NHLScoreGame): NormalizedGame {
  return {
    id: raw.id,
    date: raw.gameDate,
    startTimeUTC: raw.startTimeUTC,
    gameState: raw.gameState as NormalizedGame['gameState'],
    period: raw.period ?? 0,
    periodType: raw.periodDescriptor?.periodType ?? 'REG',
    clockTimeRemaining: raw.clock?.timeRemaining ?? '',
    clockRunning: raw.clock?.running ?? false,
    inIntermission: raw.clock?.inIntermission ?? false,
    awayTeamAbbrev: raw.awayTeam.abbrev,
    awayTeamName: raw.awayTeam.commonName?.default ?? raw.awayTeam.abbrev,
    awayScore: raw.awayTeam.score ?? 0,
    awaySog: raw.awayTeam.sog ?? 0,
    homeTeamAbbrev: raw.homeTeam.abbrev,
    homeTeamName: raw.homeTeam.commonName?.default ?? raw.homeTeam.abbrev,
    homeScore: raw.homeTeam.score ?? 0,
    homeSog: raw.homeTeam.sog ?? 0,
    venue: raw.venue?.default ?? '',
    gameOutcome: raw.gameOutcome?.lastPeriodType ?? null,
    tvBroadcasts: (raw.tvBroadcasts ?? []).map((b) => ({
      network: b.network,
      market: b.market,
      countryCode: b.countryCode,
    })),
    goals: (raw.goals ?? []).map((g) => ({
      period: g.period,
      periodType: g.periodDescriptor?.periodType ?? 'REG',
      timeInPeriod: g.timeInPeriod,
      scorerName: g.name?.default ?? '',
      teamAbbrev: g.teamAbbrev?.default ?? '',
      assists: g.assists?.map((a) => a.name?.default ?? '') ?? [],
      goalModifier: g.goalModifier ?? '',
    })),
  };
}
