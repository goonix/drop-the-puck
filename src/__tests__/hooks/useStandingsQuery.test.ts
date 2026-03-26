import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useStandingsQuery } from '../../hooks/useStandingsQuery';
import { fetchStandings } from '../../api/standingsApi';
import { renderHookWithQuery } from '../../test/utils';
import { rawStandingsResponse } from '../../test/fixtures/standings';

vi.mock('../../api/standingsApi');
const mockFetchStandings = vi.mocked(fetchStandings);

describe('useStandingsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isLoading:true initially', () => {
    mockFetchStandings.mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithQuery(() => useStandingsQuery());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.standings).toEqual([]);
  });

  it('returns normalized standings on success', async () => {
    mockFetchStandings.mockResolvedValue(rawStandingsResponse);
    const { result } = renderHookWithQuery(() => useStandingsQuery());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.standings).toHaveLength(2);
    expect(result.current.standings[0].teamAbbrev).toBe('BOS');
    expect(result.current.standings[0].points).toBe(135);
  });

  it('returns isError:true on failure', async () => {
    mockFetchStandings.mockRejectedValue(new Error('network error'));
    const { result } = renderHookWithQuery(() => useStandingsQuery());
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.standings).toEqual([]);
  });

  it('maps conference and division correctly', async () => {
    mockFetchStandings.mockResolvedValue(rawStandingsResponse);
    const { result } = renderHookWithQuery(() => useStandingsQuery());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.standings[0].conference).toBe('Eastern');
    expect(result.current.standings[0].division).toBe('Atlantic');
    expect(result.current.standings[1].conference).toBe('Eastern');
    expect(result.current.standings[1].division).toBe('Atlantic');
  });
});
