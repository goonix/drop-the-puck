import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useScheduleQuery } from '../../hooks/useScheduleQuery';
import { fetchScore } from '../../api/scheduleApi';
import { renderHookWithQuery } from '../../test/utils';
import { rawScheduleResponse } from '../../test/fixtures/schedule';

vi.mock('../../api/scheduleApi');
const mockFetchScore = vi.mocked(fetchScore);

describe('useScheduleQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isLoading:true initially', () => {
    mockFetchScore.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHookWithQuery(() => useScheduleQuery('2025-10-08'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.games).toEqual([]);
  });

  it('returns normalized games on success', async () => {
    mockFetchScore.mockResolvedValue(rawScheduleResponse);
    const { result } = renderHookWithQuery(() => useScheduleQuery('2025-10-08'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.games).toHaveLength(2);
    expect(result.current.games[0].awayTeamAbbrev).toBe('EDM');
    expect(result.current.games[0].homeTeamAbbrev).toBe('TOR');
    expect(result.current.games[0].awayScore).toBe(3);
  });

  it('returns prevDate and nextDate from response', async () => {
    mockFetchScore.mockResolvedValue(rawScheduleResponse);
    const { result } = renderHookWithQuery(() => useScheduleQuery('2025-10-08'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.prevDate).toBe('2025-10-07');
    expect(result.current.nextDate).toBe('2025-10-09');
  });

  it('returns isError:true on failure', async () => {
    mockFetchScore.mockRejectedValue(new Error('network error'));
    const { result } = renderHookWithQuery(() => useScheduleQuery('2025-10-08'));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.games).toEqual([]);
  });
});
