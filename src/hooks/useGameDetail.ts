import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadBoxScore, loadPlayByPlay, setGameId } from '../store/slices/gameDetailSlice';
import { usePolling } from './usePolling';
import { isLive } from '../utils/gameUtils';

export function useGameDetail(gameId: number | null) {
  const dispatch = useAppDispatch();
  const boxScore = useAppSelector((s) => s.gameDetail.boxScore);
  const plays = useAppSelector((s) => s.gameDetail.plays);
  const scoringPlays = useAppSelector((s) => s.gameDetail.scoringPlays);
  const players = useAppSelector((s) => s.gameDetail.players);
  const playerStats = useAppSelector((s) => s.gameDetail.playerStats);
  const boxScoreStatus = useAppSelector((s) => s.gameDetail.boxScoreStatus);
  const playsStatus = useAppSelector((s) => s.gameDetail.playsStatus);

  const liveGame = useAppSelector((s) => {
    if (!gameId) return false;
    for (const games of Object.values(s.schedule.gamesByDate)) {
      const g = games.find((g) => g.id === gameId);
      if (g) return isLive(g);
    }
    return false;
  });

  useEffect(() => {
    dispatch(setGameId(gameId));
    if (gameId) {
      dispatch(loadBoxScore(gameId));
      dispatch(loadPlayByPlay(gameId));
    }
  }, [gameId, dispatch]);

  const refresh = () => {
    if (gameId) {
      dispatch(loadBoxScore(gameId));
      dispatch(loadPlayByPlay(gameId));
    }
  };

  usePolling(refresh, 30000, liveGame && gameId !== null);

  return { boxScore, plays, scoringPlays, players, playerStats, boxScoreStatus, playsStatus };
}
