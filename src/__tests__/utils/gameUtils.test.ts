import { describe, it, expect } from 'vitest';
import { isLive, isFinal, isFuture, getGameStatus, normalizeGame } from '../../utils/gameUtils';
import type { NormalizedGame } from '../../types/schedule';
import { rawScheduleResponse } from '../../test/fixtures/schedule';

function makeGame(overrides: Partial<NormalizedGame>): NormalizedGame {
  return {
    id: 1,
    date: '2025-10-08',
    startTimeUTC: '2025-10-09T00:00:00Z',
    gameState: 'FINAL',
    period: 3,
    periodType: 'REG',
    clockTimeRemaining: '0:00',
    clockRunning: false,
    inIntermission: false,
    awayTeamAbbrev: 'EDM',
    awayTeamName: 'Oilers',
    awayScore: 3,
    awaySog: 28,
    homeTeamAbbrev: 'TOR',
    homeTeamName: 'Maple Leafs',
    homeScore: 2,
    homeSog: 30,
    venue: 'Scotiabank Arena',
    gameOutcome: 'REG',
    goals: [],
    tvBroadcasts: [],
    ...overrides,
  };
}

describe('isLive', () => {
  it('returns true for LIVE', () => expect(isLive(makeGame({ gameState: 'LIVE' }))).toBe(true));
  it('returns true for CRIT', () => expect(isLive(makeGame({ gameState: 'CRIT' }))).toBe(true));
  it('returns false for FINAL', () => expect(isLive(makeGame({ gameState: 'FINAL' }))).toBe(false));
  it('returns false for OFF', () => expect(isLive(makeGame({ gameState: 'OFF' }))).toBe(false));
  it('returns false for FUT', () => expect(isLive(makeGame({ gameState: 'FUT' }))).toBe(false));
});

describe('isFinal', () => {
  it('returns true for FINAL', () => expect(isFinal(makeGame({ gameState: 'FINAL' }))).toBe(true));
  it('returns true for OFF', () => expect(isFinal(makeGame({ gameState: 'OFF' }))).toBe(true));
  it('returns false for LIVE', () => expect(isFinal(makeGame({ gameState: 'LIVE' }))).toBe(false));
});

describe('isFuture', () => {
  it('returns true for FUT', () => expect(isFuture(makeGame({ gameState: 'FUT' }))).toBe(true));
  it('returns true for PRE', () => expect(isFuture(makeGame({ gameState: 'PRE' }))).toBe(true));
  it('returns false for LIVE', () => expect(isFuture(makeGame({ gameState: 'LIVE' }))).toBe(false));
});

describe('getGameStatus', () => {
  it('returns "Final" for regular final', () => {
    expect(getGameStatus(makeGame({ gameState: 'FINAL', gameOutcome: 'REG' }))).toBe('Final');
  });
  it('returns "Final/OT" for OT final', () => {
    expect(getGameStatus(makeGame({ gameState: 'FINAL', gameOutcome: 'OT' }))).toBe('Final/OT');
  });
  it('returns "Final/SO" for shootout final', () => {
    expect(getGameStatus(makeGame({ gameState: 'FINAL', gameOutcome: 'SO' }))).toBe('Final/SO');
  });
  it('returns period and clock for live regular time', () => {
    const g = makeGame({
      gameState: 'LIVE',
      period: 2,
      clockTimeRemaining: '14:30',
      periodType: 'REG',
    });
    expect(getGameStatus(g)).toBe('P2 14:30');
  });
  it('returns OT clock for live OT', () => {
    const g = makeGame({
      gameState: 'LIVE',
      period: 4,
      clockTimeRemaining: '3:45',
      periodType: 'OT',
    });
    expect(getGameStatus(g)).toBe('OT 3:45');
  });
  it('returns "SO" for live shootout', () => {
    const g = makeGame({ gameState: 'LIVE', periodType: 'SO' });
    expect(getGameStatus(g)).toBe('SO');
  });
  it('returns intermission label during intermission', () => {
    const g = makeGame({ gameState: 'LIVE', period: 1, inIntermission: true });
    expect(getGameStatus(g)).toBe('INT - P1');
  });
  it('returns a non-empty string for future game', () => {
    const g = makeGame({ gameState: 'FUT', startTimeUTC: '2025-10-09T23:00:00Z' });
    expect(getGameStatus(g)).toBeTruthy();
  });
});

describe('normalizeGame', () => {
  it('maps id correctly', () => {
    const game = normalizeGame(rawScheduleResponse.games[0]);
    expect(game.id).toBe(2024020001);
  });

  it('maps gameState correctly', () => {
    const game = normalizeGame(rawScheduleResponse.games[0]);
    expect(game.gameState).toBe('FINAL');
  });

  it('maps awayTeamAbbrev and homeTeamAbbrev', () => {
    const game = normalizeGame(rawScheduleResponse.games[0]);
    expect(game.awayTeamAbbrev).toBe('EDM');
    expect(game.homeTeamAbbrev).toBe('TOR');
  });

  it('maps scores correctly', () => {
    const game = normalizeGame(rawScheduleResponse.games[0]);
    expect(game.awayScore).toBe(3);
    expect(game.homeScore).toBe(2);
  });

  it('maps awayTeamName from commonName.default', () => {
    const game = normalizeGame(rawScheduleResponse.games[0]);
    expect(game.awayTeamName).toBe('Oilers');
  });

  it('falls back to abbrev when commonName is absent', () => {
    const rawGame = {
      ...rawScheduleResponse.games[0],
      awayTeam: {
        ...rawScheduleResponse.games[0].awayTeam,
        commonName: undefined as unknown as { default: string },
      },
    };
    const game = normalizeGame(rawGame);
    expect(game.awayTeamName).toBe('EDM');
  });

  it('score defaults to 0 when undefined', () => {
    const rawGame = {
      ...rawScheduleResponse.games[0],
      awayTeam: {
        ...rawScheduleResponse.games[0].awayTeam,
        score: undefined,
      },
    };
    const game = normalizeGame(rawGame);
    expect(game.awayScore).toBe(0);
  });
});
