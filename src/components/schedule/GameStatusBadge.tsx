import type { NormalizedGame } from '../../types/schedule';
import { isLive, isFinal, getGameStatus } from '../../utils/gameUtils';

interface Props {
  game: NormalizedGame;
}

export function GameStatusBadge({ game }: Props) {
  const status = getGameStatus(game);
  const live = isLive(game);
  const final = isFinal(game);

  if (live) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        {status}
      </span>
    );
  }

  if (final) {
    return (
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
        {status}
      </span>
    );
  }

  return <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>;
}
