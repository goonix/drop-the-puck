import type { NormalizedGame } from '../../types/schedule';
import { GameCard } from './GameCard';
import { useFavoriteTeams } from '../../hooks/useFavoriteTeam';

interface Props {
  games: NormalizedGame[];
}

export function GameList({ games }: Props) {
  const { isFavorite } = useFavoriteTeams();

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <span className="text-4xl mb-3">🏒</span>
        <p>No games scheduled</p>
      </div>
    );
  }

  // Sort: favorite team games first, then by start time
  const sorted = [...games].sort((a, b) => {
    const aFav = isFavorite(a.awayTeamAbbrev) || isFavorite(a.homeTeamAbbrev);
    const bFav = isFavorite(b.awayTeamAbbrev) || isFavorite(b.homeTeamAbbrev);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.startTimeUTC.localeCompare(b.startTimeUTC);
  });

  return (
    <div className="flex flex-col gap-2 p-3">
      {sorted.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
