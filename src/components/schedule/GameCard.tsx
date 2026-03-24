import { useEffect, useRef } from 'react';
import { playGoalHorn } from '../../utils/goalHorn';
import type { NormalizedGame } from '../../types/schedule';
import { TeamLogo } from '../common/TeamLogo';
import { GameStatusBadge } from './GameStatusBadge';
import { isLive, isFinal } from '../../utils/gameUtils';
import { getTeamColor } from '../../utils/teamUtils';
import { useFavoriteTeams } from '../../hooks/useFavoriteTeam';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedGame } from '../../store/slices/scheduleSlice';
import { setActiveView } from '../../store/slices/uiSlice';

interface Props {
  game: NormalizedGame;
}

export function GameCard({ game }: Props) {
  const dispatch = useAppDispatch();
  const selectedGameId = useAppSelector((s) => s.schedule.selectedGameId);
  const hornMuted = useAppSelector((s) => s.ui.hornMuted);
  const { isFavorite } = useFavoriteTeams();

  const isSelected = selectedGameId === game.id;
  const live = isLive(game);
  const final = isFinal(game);
  const awayFav = isFavorite(game.awayTeamAbbrev);
  const homeFav = isFavorite(game.homeTeamAbbrev);
  const hasFavorite = awayFav || homeFav;

  const handleClick = () => {
    dispatch(setSelectedGame(game.id));
    dispatch(setActiveView('gameDetail'));
  };

  const favoriteColor = hasFavorite
    ? getTeamColor(awayFav ? game.awayTeamAbbrev : game.homeTeamAbbrev)
    : null;

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left rounded-xl p-3 transition-all border ${
        isSelected
          ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/40 dark:border-blue-600/60'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-800 dark:hover:border-gray-600'
      } ${hasFavorite ? 'ring-1' : ''}`}
      style={
        hasFavorite && favoriteColor
          ? ({ '--tw-ring-color': favoriteColor + '80' } as React.CSSProperties)
          : undefined
      }
    >
      {/* Status row */}
      <div className="flex justify-between items-center mb-2">
        <GameStatusBadge game={game} />
        {live && <span className="text-xs text-gray-400 dark:text-gray-500">{game.venue}</span>}
      </div>

      {/* Teams */}
      <div className="space-y-1.5">
        <TeamScoreRow
          abbrev={game.awayTeamAbbrev}
          name={game.awayTeamName}
          score={game.awayScore}
          sog={game.awaySog}
          isWinner={final && game.awayScore > game.homeScore}
          showScore={live || final}
          isFav={awayFav}
          hornMuted={hornMuted}
        />
        <TeamScoreRow
          abbrev={game.homeTeamAbbrev}
          name={game.homeTeamName}
          score={game.homeScore}
          sog={game.homeSog}
          isWinner={final && game.homeScore > game.awayScore}
          showScore={live || final}
          isFav={homeFav}
          hornMuted={hornMuted}
        />
      </div>
      {!live && !final && game.tvBroadcasts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {game.tvBroadcasts
            .filter((b) => b.market === 'N')
            .slice(0, 3)
            .map((b) => (
              <span
                key={b.network}
                className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
              >
                {b.network}
              </span>
            ))}
        </div>
      )}
    </button>
  );
}

interface TeamScoreRowProps {
  abbrev: string;
  name: string;
  score: number;
  sog: number;
  isWinner: boolean;
  showScore: boolean;
  isFav: boolean;
  hornMuted: boolean;
}

function TeamScoreRow({ abbrev, score, isWinner, showScore, isFav, hornMuted }: TeamScoreRowProps) {
  const prevScore = useRef(score);
  const scoreRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (score > prevScore.current) {
      prevScore.current = score;
      if (!hornMuted) playGoalHorn(abbrev);
      const el = scoreRef.current;
      if (el) {
        el.classList.remove('score-flash');
        void el.offsetWidth; // trigger reflow to restart animation
        el.classList.add('score-flash');
      }
    } else {
      prevScore.current = score;
    }
  }, [score, abbrev, hornMuted]);

  return (
    <div className="flex items-center gap-2">
      <TeamLogo abbrev={abbrev} size={28} dark />
      <span
        className={`flex-1 text-sm truncate ${isWinner ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
      >
        {abbrev}
        {isFav && <span className="ml-1 text-yellow-500 dark:text-yellow-400">★</span>}
      </span>
      {showScore && (
        <span
          ref={scoreRef}
          className={`text-lg font-bold tabular-nums ${isWinner ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
        >
          {score}
        </span>
      )}
    </div>
  );
}
