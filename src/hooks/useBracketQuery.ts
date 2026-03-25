import { useQuery } from '@tanstack/react-query';
import { fetchBracket } from '../api/bracketApi';
import type { BracketData } from '../types/bracket';

export function useBracketQuery() {
  const year = new Date().getFullYear();

  const { data, isLoading, isError, error } = useQuery<BracketData>({
    queryKey: ['bracket', year],
    queryFn: () => fetchBracket(year),
    staleTime: 10 * 60 * 1000,
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
  };
}
