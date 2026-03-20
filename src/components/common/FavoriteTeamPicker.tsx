import { ALL_TEAMS, getTeamFullName, getTeamColor } from '../../utils/teamUtils'
import TeamLogo from './TeamLogo'
import { useFavoriteTeams } from '../../hooks/useFavoriteTeam'

interface Props {
  onClose: () => void
}

export default function FavoriteTeamPicker({ onClose }: Props) {
  const { isFavorite, toggle } = useFavoriteTeams()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Favorite Teams</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Team list */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2">
          {ALL_TEAMS.map(abbrev => {
            const fav = isFavorite(abbrev)
            const color = getTeamColor(abbrev)
            return (
              <button
                key={abbrev}
                onClick={() => toggle(abbrev)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                  fav
                    ? 'border-transparent text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                style={fav ? { backgroundColor: color + '33', borderColor: color + '99' } : undefined}
              >
                <TeamLogo abbrev={abbrev} size={28} dark />
                <div className="min-w-0">
                  <p className="text-xs font-semibold">{abbrev}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{getTeamFullName(abbrev).split(' ').slice(-1)[0]}</p>
                </div>
                {fav && <span className="ml-auto text-yellow-500 dark:text-yellow-400 text-sm">★</span>}
              </button>
            )
          })}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
