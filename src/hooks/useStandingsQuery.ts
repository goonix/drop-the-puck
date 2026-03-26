import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '../api/standingsApi';
import type { TeamStanding } from '../types/standings';
import { normalizeStandings } from '../utils/normalizers';

export function useStandingsQuery() {
  const { data, isLoading, isError, error } = useQuery<TeamStanding[]>({
    queryKey: ['standings'],
    queryFn: async () => {
      const raw = await fetchStandings();
      return normalizeStandings(raw);
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    standings: data ?? [],
    isLoading,
    isError,
    error,
  };
}
