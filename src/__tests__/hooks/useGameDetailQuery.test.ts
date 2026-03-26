import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useGameDetailQuery } from '../../hooks/useGameDetailQuery';
import { fetchBoxScore, fetchPlayByPlay } from '../../api/gameApi';
import { renderHookWithQuery } from '../../test/utils';
import { rawBoxScoreResponse, rawPlaysResponse } from '../../test/fixtures/gameDetail';

vi.mock('../../api/gameApi');
const mockFetchBoxScore = vi.mocked(fetchBoxScore);
const mockFetchPlayByPlay = vi.mocked(fetchPlayByPlay);

describe('useGameDetailQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when gameId is null — queries not enabled', () => {
    mockFetchBoxScore.mockResolvedValue(rawBoxScoreResponse);
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    renderHookWithQuery(() => useGameDetailQuery(null));
    expect(mockFetchBoxScore).not.toHaveBeenCalled();
    expect(mockFetchPlayByPlay).not.toHaveBeenCalled();
  });

  it('returns isLoading true while queries are loading', () => {
    mockFetchBoxScore.mockReturnValue(new Promise(() => {}));
    mockFetchPlayByPlay.mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches both boxscore and plays when gameId provided', async () => {
    mockFetchBoxScore.mockResolvedValue(rawBoxScoreResponse);
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchBoxScore).toHaveBeenCalledWith(2024020001);
    expect(mockFetchPlayByPlay).toHaveBeenCalledWith(2024020001);
  });

  it('combines data: boxScore from boxscore query, plays from plays query', async () => {
    mockFetchBoxScore.mockResolvedValue(rawBoxScoreResponse);
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.boxScore).not.toBeNull();
    expect(result.current.boxScore?.awayTeamAbbrev).toBe('EDM');
    expect(result.current.plays).toHaveLength(3);
    expect(result.current.scoringPlays).toHaveLength(2);
  });

  it('uses boxScore.byPeriod when non-empty', async () => {
    mockFetchBoxScore.mockResolvedValue(rawBoxScoreResponse);
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // rawBoxScoreResponse has linescore with 3 periods
    expect(result.current.byPeriod).toHaveLength(3);
    expect(result.current.byPeriod[0]).toMatchObject({ period: 1, awayGoals: 1, homeGoals: 0 });
  });

  it('falls back to play-reconstructed byPeriod when boxScore.byPeriod is empty', async () => {
    const boxscoreNoLinescore = { ...rawBoxScoreResponse, linescore: undefined };
    mockFetchBoxScore.mockResolvedValue(boxscoreNoLinescore);
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Falls back to plays-derived byPeriod (2 periods from fixture)
    expect(result.current.byPeriod).toHaveLength(2);
  });

  it('returns isError true when boxscore fails', async () => {
    mockFetchBoxScore.mockRejectedValue(new Error('boxscore failed'));
    mockFetchPlayByPlay.mockResolvedValue(rawPlaysResponse);
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('returns isError true when plays query fails', async () => {
    mockFetchBoxScore.mockResolvedValue(rawBoxScoreResponse);
    mockFetchPlayByPlay.mockRejectedValue(new Error('plays failed'));
    const { result } = renderHookWithQuery(() => useGameDetailQuery(2024020001));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
