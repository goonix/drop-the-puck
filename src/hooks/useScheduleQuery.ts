import { useQuery } from '@tanstack/react-query';
import { fetchScore } from '../api/scheduleApi';
import { normalizeGame } from '../utils/gameUtils';
import type { NormalizedGame } from '../types/schedule';

interface ScheduleQueryData {
  games: NormalizedGame[];
  prevDate: string | null;
  nextDate: string | null;
}

function isGameLive(game: NormalizedGame): boolean {
  return game.gameState === 'LIVE' || game.gameState === 'CRIT';
}

export function useScheduleQuery(date: string) {
  const { data, isLoading, isError, error, refetch } = useQuery<ScheduleQueryData>({
    queryKey: ['schedule', date],
    queryFn: async () => {
      const raw = await fetchScore(date);
      return {
        games: raw.games.map(normalizeGame),
        prevDate: raw.prevDate ?? null,
        nextDate: raw.nextDate ?? null,
      };
    },
    refetchInterval: (query) => {
      const games = query.state.data?.games;
      if (games && games.some(isGameLive)) {
        return 30_000;
      }
      return false;
    },
    refetchIntervalInBackground: false,
  });

  return {
    games: data?.games ?? [],
    prevDate: data?.prevDate ?? null,
    nextDate: data?.nextDate ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
