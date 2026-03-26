import { useQuery } from '@tanstack/react-query';
import { fetchBoxScore, fetchPlayByPlay } from '../api/gameApi';
import type {
  BoxScore,
  BoxScorePeriod,
  ScoringPlay,
  Play,
  PlayerInfo,
  PlayerGameStats,
} from '../types/gameDetail';
import { normalizeBoxScore, normalizePlayByPlay } from '../utils/normalizers';
import type { BoxScoreResult, PlaysResult } from '../utils/normalizers';

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

function queryStatusToLoadingStatus(
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
): LoadingStatus {
  if (isLoading) return 'loading';
  if (isSuccess) return 'succeeded';
  if (isError) return 'failed';
  return 'idle';
}

export function useGameDetailQuery(gameId: number | null) {
  const boxScoreQuery = useQuery<BoxScoreResult>({
    queryKey: ['boxscore', gameId],
    queryFn: async () => {
      const data = await fetchBoxScore(gameId!);
      return normalizeBoxScore(data);
    },
    enabled: gameId !== null,
    refetchInterval: (query) => {
      const state = query.state.data?.boxScore?.gameState;
      if (state === 'LIVE' || state === 'CRIT') return 20_000;
      return false;
    },
    refetchIntervalInBackground: false,
  });

  const playsQuery = useQuery<PlaysResult>({
    queryKey: ['plays', gameId],
    queryFn: async () => {
      const data = await fetchPlayByPlay(gameId!);
      return normalizePlayByPlay(data);
    },
    enabled: gameId !== null,
    refetchInterval: (query) => {
      const state = boxScoreQuery.data?.boxScore?.gameState;
      if (state === 'LIVE' || state === 'CRIT') return 20_000;
      // Also check plays query's own data for game state context
      void query;
      return false;
    },
    refetchIntervalInBackground: false,
  });

  const boxScore: BoxScore | null = boxScoreQuery.data?.boxScore ?? null;
  const playerStats: PlayerGameStats | null = boxScoreQuery.data?.playerStats ?? null;
  const plays: Play[] = playsQuery.data?.plays ?? [];
  const scoringPlays: ScoringPlay[] = playsQuery.data?.scoringPlays ?? [];
  const players: Record<number, PlayerInfo> = playsQuery.data?.players ?? {};

  // Derive byPeriod: use boxScore's byPeriod if non-empty, else fall back to computed from plays
  const byPeriod: BoxScorePeriod[] =
    boxScore && boxScore.byPeriod.length > 0
      ? boxScore.byPeriod
      : (playsQuery.data?.byPeriod ?? []);

  const isLoading = boxScoreQuery.isLoading || playsQuery.isLoading;
  const isError = boxScoreQuery.isError || playsQuery.isError;

  const boxScoreStatus = queryStatusToLoadingStatus(
    boxScoreQuery.isLoading,
    boxScoreQuery.isSuccess,
    boxScoreQuery.isError,
  );
  const playsStatus = queryStatusToLoadingStatus(
    playsQuery.isLoading,
    playsQuery.isSuccess,
    playsQuery.isError,
  );

  const refetch = () => {
    void boxScoreQuery.refetch();
    void playsQuery.refetch();
  };

  return {
    boxScore,
    plays,
    scoringPlays,
    players,
    playerStats,
    byPeriod,
    isLoading,
    isError,
    boxScoreStatus,
    playsStatus,
    refetch,
  };
}
