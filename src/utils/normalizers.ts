import type {
  BoxScore,
  BoxScorePeriod,
  ScoringPlay,
  Play,
  PlayerInfo,
  SkaterStat,
  GoalieStat,
  TeamPlayerStats,
  PlayerGameStats,
} from '../types/gameDetail';
import type {
  NHLBoxScoreResponse,
  NHLPlayByPlayResponse,
  NHLStandingsResponse,
} from '../types/nhl';
import type { TeamStanding } from '../types/standings';

function parseTeamStats(raw: Record<string, unknown>): TeamPlayerStats {
  if (!raw) return { forwards: [], defense: [], goalies: [] };
  const parseSkater = (p: Record<string, unknown>): SkaterStat => ({
    playerId: p.playerId as number,
    sweaterNumber: p.sweaterNumber as number,
    name: (p.name as { default?: string })?.default ?? '',
    position: p.position as string,
    goals: (p.goals as number) ?? 0,
    assists: (p.assists as number) ?? 0,
    points: (p.points as number) ?? 0,
    plusMinus: (p.plusMinus as number) ?? 0,
    pim: (p.pim as number) ?? 0,
    hits: (p.hits as number) ?? 0,
    sog: (p.sog as number) ?? 0,
    blockedShots: (p.blockedShots as number) ?? 0,
    toi: (p.toi as string) ?? '0:00',
    faceoffWinningPctg: (p.faceoffWinningPctg as number) ?? 0,
    giveaways: (p.giveaways as number) ?? 0,
    takeaways: (p.takeaways as number) ?? 0,
  });
  return {
    forwards: ((raw.forwards as unknown[]) ?? []).map((p) =>
      parseSkater(p as Record<string, unknown>),
    ),
    defense: ((raw.defense as unknown[]) ?? []).map((p) =>
      parseSkater(p as Record<string, unknown>),
    ),
    goalies: ((raw.goalies as unknown[]) ?? []).map((p): GoalieStat => {
      const g = p as Record<string, unknown>;
      return {
        playerId: g.playerId as number,
        sweaterNumber: g.sweaterNumber as number,
        name: (g.name as { default?: string })?.default ?? '',
        position: g.position as string,
        shotsAgainst: (g.shotsAgainst as number) ?? 0,
        saves: (g.saves as number) ?? 0,
        goalsAgainst: (g.goalsAgainst as number) ?? 0,
        toi: (g.toi as string) ?? '0:00',
        starter: (g.starter as boolean) ?? false,
      };
    }),
  };
}

export interface BoxScoreResult {
  boxScore: BoxScore;
  playerStats: PlayerGameStats;
}

export function normalizeBoxScore(data: NHLBoxScoreResponse): BoxScoreResult {
  const awayName =
    data.awayTeam.commonName?.default ?? data.awayTeam.name?.default ?? data.awayTeam.abbrev;
  const homeName =
    data.homeTeam.commonName?.default ?? data.homeTeam.name?.default ?? data.homeTeam.abbrev;
  const boxScore: BoxScore = {
    gameId: data.id,
    gameState: data.gameState,
    period: data.periodDescriptor?.number ?? 0,
    periodType: data.periodDescriptor?.periodType ?? 'REG',
    clockTimeRemaining: data.clock?.timeRemaining ?? '',
    awayTeamAbbrev: data.awayTeam.abbrev,
    awayTeamName: awayName,
    awayScore: data.awayTeam.score,
    awaySog: data.awayTeam.sog,
    homeTeamAbbrev: data.homeTeam.abbrev,
    homeTeamName: homeName,
    homeScore: data.homeTeam.score,
    homeSog: data.homeTeam.sog,
    byPeriod:
      data.linescore?.byPeriod.map((p) => ({
        period: p.period,
        periodType: p.periodDescriptor.periodType,
        awayGoals: p.away,
        homeGoals: p.home,
      })) ?? [],
    teamStats: data.teamGameStats ?? [],
    gameOutcome: data.gameOutcome?.lastPeriodType ?? null,
  };
  const rawPgs = ((data as unknown as Record<string, unknown>).playerByGameStats ?? {}) as Record<
    string,
    unknown
  >;
  const playerStats: PlayerGameStats = {
    awayTeam: parseTeamStats((rawPgs.awayTeam ?? {}) as Record<string, unknown>),
    homeTeam: parseTeamStats((rawPgs.homeTeam ?? {}) as Record<string, unknown>),
  };
  return { boxScore, playerStats };
}

export interface PlaysResult {
  plays: Play[];
  scoringPlays: ScoringPlay[];
  players: Record<number, PlayerInfo>;
  byPeriod: BoxScorePeriod[];
}

export function normalizePlayByPlay(data: NHLPlayByPlayResponse): PlaysResult {
  const players: Record<number, PlayerInfo> = {};
  for (const r of data.rosterSpots ?? []) {
    players[r.playerId] = {
      playerId: r.playerId,
      name: `${r.firstName.default} ${r.lastName.default}`,
      sweaterNumber: r.sweaterNumber,
      positionCode: r.positionCode,
      headshot: r.headshot,
    };
  }

  const awayId = data.awayTeam.id;
  const homeId = data.homeTeam.id;

  const plays: Play[] = (data.plays ?? []).map((p) => {
    const d = (p.details ?? {}) as Record<string, unknown>;
    const ownerTeamId = d.eventOwnerTeamId as number | undefined;
    const teamAbbrev =
      ownerTeamId === awayId
        ? data.awayTeam.abbrev
        : ownerTeamId === homeId
          ? data.homeTeam.abbrev
          : undefined;
    return {
      eventId: p.eventId,
      period: p.periodDescriptor.number,
      periodType: p.periodDescriptor.periodType,
      timeInPeriod: p.timeInPeriod,
      timeRemaining: p.timeRemaining,
      typeCode: p.typeCode,
      typeDescKey: p.typeDescKey,
      sortOrder: p.sortOrder,
      details: d,
      teamAbbrev,
    };
  });

  const scoringPlays: ScoringPlay[] = plays
    .filter((p) => p.typeCode === 505)
    .map((p) => {
      const d = p.details as {
        scoringPlayerId?: number;
        scoringPlayerTotal?: number;
        assist1PlayerId?: number;
        assist1PlayerTotal?: number;
        assist2PlayerId?: number;
        assist2PlayerTotal?: number;
        eventOwnerTeamId?: number;
        awayScore?: number;
        homeScore?: number;
        goalModifier?: string;
      };
      const scorer = d.scoringPlayerId ? players[d.scoringPlayerId] : null;
      const assist1 = d.assist1PlayerId ? players[d.assist1PlayerId] : null;
      const assist2 = d.assist2PlayerId ? players[d.assist2PlayerId] : null;

      const teamAbbrev =
        d.eventOwnerTeamId === awayId ? data.awayTeam.abbrev : data.homeTeam.abbrev;

      return {
        eventId: p.eventId,
        period: p.period,
        periodType: p.periodType,
        timeInPeriod: p.timeInPeriod,
        scorerName: scorer?.name ?? 'Unknown',
        scorerTotal: d.scoringPlayerTotal ?? 0,
        scorerHeadshot: scorer?.headshot ?? null,
        assist1Name: assist1?.name ?? null,
        assist1Total: d.assist1PlayerTotal ?? null,
        assist2Name: assist2?.name ?? null,
        assist2Total: d.assist2PlayerTotal ?? null,
        teamAbbrev,
        awayScore: d.awayScore ?? 0,
        homeScore: d.homeScore ?? 0,
      };
    });

  // Reconstruct by-period linescore from goal plays
  type PeriodAcc = { periodType: string; away: number; home: number };
  const periodMap: Record<number, PeriodAcc> = {};
  for (const p of plays) {
    if (p.typeCode === 505) {
      const d = p.details as { awayScore?: number; homeScore?: number };
      periodMap[p.period] = {
        periodType: p.periodType,
        away: d.awayScore ?? 0,
        home: d.homeScore ?? 0,
      };
    }
  }
  const sortedPeriodNums = Object.keys(periodMap)
    .map(Number)
    .sort((a, b) => a - b);
  let prevAway = 0;
  let prevHome = 0;
  const byPeriod: BoxScorePeriod[] = sortedPeriodNums.map((pnum) => {
    const p = periodMap[pnum];
    const result: BoxScorePeriod = {
      period: pnum,
      periodType: p.periodType,
      awayGoals: p.away - prevAway,
      homeGoals: p.home - prevHome,
    };
    prevAway = p.away;
    prevHome = p.home;
    return result;
  });

  return { plays, scoringPlays, players, byPeriod };
}

export function normalizeStandings(data: NHLStandingsResponse): TeamStanding[] {
  return data.standings.map((s) => ({
    teamAbbrev: s.teamAbbrev.default,
    teamName: s.teamName.default,
    teamLogo: s.teamLogo,
    conference: s.conferenceName,
    division: s.divisionName,
    gamesPlayed: s.gamesPlayed,
    wins: s.wins,
    losses: s.losses,
    otLosses: s.otLosses,
    points: s.points,
    pointPctg: s.pointPctg,
    goalFor: s.goalFor,
    goalAgainst: s.goalAgainst,
    goalDifferential: s.goalDifferential,
    streakCode: s.streakCode,
    streakCount: s.streakCount,
    clinchIndicator: s.clinchIndicator,
    leagueSequence: s.leagueSequence,
    conferenceSequence: s.conferenceSequence,
    divisionSequence: s.divisionSequence,
    wildcardSequence: s.wildcardSequence,
  })) as TeamStanding[];
}
