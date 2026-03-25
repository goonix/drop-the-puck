import { useState } from 'react';
import { useAtom } from 'jotai';
import { ThemeToggle } from '../common/ThemeToggle';
import { FavoriteTeamPicker } from '../common/FavoriteTeamPicker';
import { useFavoriteTeams } from '../../hooks/useFavoriteTeam';
import { hornMutedAtom } from '../../store/atoms';

export function Header() {
  const [showPicker, setShowPicker] = useState(false);
  const { favoriteTeamAbbrevs } = useFavoriteTeams();
  const [hornMuted, setHornMuted] = useAtom(hornMutedAtom);

  return (
    <>
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏒</span>
          <span className="font-bold text-gray-900 dark:text-white text-base">Drop the Puck</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Favorite Teams"
          >
            <span className="text-yellow-500 dark:text-yellow-400">★</span>
            {favoriteTeamAbbrevs.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {favoriteTeamAbbrevs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setHornMuted(!hornMuted)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title={hornMuted ? 'Unmute goal horn' : 'Mute goal horn'}
          >
            {hornMuted ? '🔇' : '🔊'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {showPicker && <FavoriteTeamPicker onClose={() => setShowPicker(false)} />}
    </>
  );
}
