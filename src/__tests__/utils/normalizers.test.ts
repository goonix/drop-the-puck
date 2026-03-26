import { describe, it, expect } from 'vitest';
import {
  normalizeBoxScore,
  normalizePlayByPlay,
  normalizeStandings,
} from '../../utils/normalizers';
import { rawBoxScoreResponse, rawPlaysResponse } from '../../test/fixtures/gameDetail';
import { rawStandingsResponse } from '../../test/fixtures/standings';
import type { NHLBoxScoreResponse, NHLPlayByPlayResponse } from '../../types/nhl';

describe('normalizeBoxScore', () => {
  it('maps awayTeamName from commonName.default', () => {
    const result = normalizeBoxScore(rawBoxScoreResponse);
    expect(result.boxScore.awayTeamName).toBe('Oilers');
  });

  it('falls back to name.default when commonName absent', () => {
    const modified: NHLBoxScoreResponse = {
      ...rawBoxScoreResponse,
      awayTeam: {
        ...rawBoxScoreResponse.awayTeam,
        commonName: undefined,
        name: { default: 'Edmonton Oilers' },
      },
    };
    const result = normalizeBoxScore(modified);
    expect(result.boxScore.awayTeamName).toBe('Edmonton Oilers');
  });

  it('falls back to abbrev when neither commonName nor name present', () => {
    const modified: NHLBoxScoreResponse = {
      ...rawBoxScoreResponse,
      awayTeam: {
        ...rawBoxScoreResponse.awayTeam,
        commonName: undefined,
        name: undefined,
      },
    };
    const result = normalizeBoxScore(modified);
    expect(result.boxScore.awayTeamName).toBe('EDM');
  });

  it('constructs byPeriod from linescore correctly', () => {
    const result = normalizeBoxScore(rawBoxScoreResponse);
    expect(result.boxScore.byPeriod).toHaveLength(3);
    expect(result.boxScore.byPeriod[0]).toMatchObject({ period: 1, awayGoals: 1, homeGoals: 0 });
    expect(result.boxScore.byPeriod[1]).toMatchObject({ period: 2, awayGoals: 1, homeGoals: 2 });
    expect(result.boxScore.byPeriod[2]).toMatchObject({ period: 3, awayGoals: 1, homeGoals: 0 });
  });

  it('handles absent linescore — byPeriod should be []', () => {
    const modified: NHLBoxScoreResponse = {
      ...rawBoxScoreResponse,
      linescore: undefined,
    };
    const result = normalizeBoxScore(modified);
    expect(result.boxScore.byPeriod).toEqual([]);
  });

  it('reads gameOutcome correctly', () => {
    const result = normalizeBoxScore(rawBoxScoreResponse);
    expect(result.boxScore.gameOutcome).toBe('REG');
  });

  it('maps gameId, gameState, scores, and sog', () => {
    const result = normalizeBoxScore(rawBoxScoreResponse);
    expect(result.boxScore.gameId).toBe(2024020001);
    expect(result.boxScore.gameState).toBe('FINAL');
    expect(result.boxScore.awayScore).toBe(3);
    expect(result.boxScore.homeScore).toBe(2);
    expect(result.boxScore.awaySog).toBe(28);
    expect(result.boxScore.homeSog).toBe(30);
  });
});

describe('normalizePlayByPlay', () => {
  it('builds players lookup from rosterSpots', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    expect(result.players[8478402]).toMatchObject({ name: 'Connor McDavid', positionCode: 'C' });
    expect(result.players[8479318]).toMatchObject({ name: 'Auston Matthews', positionCode: 'C' });
  });

  it('maps teamAbbrev for away team plays', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    const awayGoal = result.plays.find((p) => p.typeCode === 505 && p.teamAbbrev === 'EDM');
    expect(awayGoal).toBeDefined();
    expect(awayGoal?.teamAbbrev).toBe('EDM');
  });

  it('maps teamAbbrev for home team plays', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    const homeGoal = result.plays.find((p) => p.typeCode === 505 && p.teamAbbrev === 'TOR');
    expect(homeGoal).toBeDefined();
    expect(homeGoal?.teamAbbrev).toBe('TOR');
  });

  it('sets teamAbbrev to undefined for plays without eventOwnerTeamId', () => {
    const modified: NHLPlayByPlayResponse = {
      ...rawPlaysResponse,
      plays: [
        {
          ...rawPlaysResponse.plays[2],
          details: {},
        },
      ],
    };
    const result = normalizePlayByPlay(modified);
    expect(result.plays[0].teamAbbrev).toBeUndefined();
  });

  it('extracts only typeCode===505 plays as scoringPlays', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    expect(result.scoringPlays).toHaveLength(2);
    expect(result.scoringPlays.every((p) => p.teamAbbrev !== undefined)).toBe(true);
  });

  it('sets scorerName from player lookup', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    const edGoal = result.scoringPlays.find((p) => p.teamAbbrev === 'EDM');
    expect(edGoal?.scorerName).toBe('Connor McDavid');
  });

  it('returns "Unknown" for scorer not in roster', () => {
    const modified: NHLPlayByPlayResponse = {
      ...rawPlaysResponse,
      plays: [
        {
          ...rawPlaysResponse.plays[0],
          details: {
            ...rawPlaysResponse.plays[0].details,
            scoringPlayerId: 9999999,
          },
        },
      ],
    };
    const result = normalizePlayByPlay(modified);
    expect(result.scoringPlays[0].scorerName).toBe('Unknown');
  });

  it('computes byPeriod correctly from cumulative goal scores', () => {
    // P1: EDM 1-0 (awayGoals:1, homeGoals:0)
    // P2: EDM 1, TOR 1 -> cumulative 1-1, delta: awayGoals:0, homeGoals:1
    const result = normalizePlayByPlay(rawPlaysResponse);
    expect(result.byPeriod).toHaveLength(2);
    expect(result.byPeriod[0]).toMatchObject({ period: 1, awayGoals: 1, homeGoals: 0 });
    expect(result.byPeriod[1]).toMatchObject({ period: 2, awayGoals: 0, homeGoals: 1 });
  });

  it('returns all plays including non-goals', () => {
    const result = normalizePlayByPlay(rawPlaysResponse);
    expect(result.plays).toHaveLength(3);
  });
});

describe('normalizeStandings', () => {
  it('maps all fields from raw data correctly for first team', () => {
    const result = normalizeStandings(rawStandingsResponse);
    expect(result[0].teamAbbrev).toBe('BOS');
    expect(result[0].teamName).toBe('Bruins');
    expect(result[0].conference).toBe('Eastern');
    expect(result[0].division).toBe('Atlantic');
    expect(result[0].gamesPlayed).toBe(82);
    expect(result[0].wins).toBe(65);
    expect(result[0].losses).toBe(12);
    expect(result[0].otLosses).toBe(5);
    expect(result[0].points).toBe(135);
  });

  it('works with multiple teams', () => {
    const result = normalizeStandings(rawStandingsResponse);
    expect(result).toHaveLength(2);
    expect(result[1].teamAbbrev).toBe('TOR');
    expect(result[1].points).toBe(112);
  });

  it('maps conference and division correctly for second team', () => {
    const result = normalizeStandings(rawStandingsResponse);
    expect(result[1].conference).toBe('Eastern');
    expect(result[1].division).toBe('Atlantic');
  });

  it('maps sequence fields correctly', () => {
    const result = normalizeStandings(rawStandingsResponse);
    expect(result[0].leagueSequence).toBe(1);
    expect(result[0].conferenceSequence).toBe(1);
    expect(result[0].divisionSequence).toBe(1);
  });
});
