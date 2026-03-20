import type { TeamStanding } from '../../types/standings'
import TeamLogo from '../common/TeamLogo'
import { useFavoriteTeams } from '../../hooks/useFavoriteTeam'
import { getTeamColor } from '../../utils/teamUtils'

interface Props {
  standing: TeamStanding
  rank: number
}

export default function TeamRow({ standing, rank }: Props) {
  const { isFavorite } = useFavoriteTeams()
  const fav = isFavorite(standing.teamAbbrev)
  const favColor = fav ? getTeamColor(standing.teamAbbrev) : null

  return (
    <tr
      className={`border-b border-gray-100 dark:border-gray-700/30 transition-colors ${
        fav ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20'
      }`}
      style={fav && favColor ? { backgroundColor: favColor + '22' } : undefined}
    >
      <td className="py-2 pl-3 pr-1 text-gray-400 dark:text-gray-500 text-xs w-6">{rank}</td>
      <td className="py-2 pr-3">
        <div className="flex items-center gap-2">
          <TeamLogo abbrev={standing.teamAbbrev} size={24} dark />
          <span className={`text-sm font-medium ${fav ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
            {standing.teamAbbrev}
            {fav && <span className="ml-1 text-yellow-500 dark:text-yellow-400 text-xs">★</span>}
          </span>
          {standing.clinchIndicator && (
            <span className="text-xs text-green-600 dark:text-green-400">{standing.clinchIndicator}</span>
          )}
        </div>
      </td>
      <td className="py-2 px-2 text-center text-sm text-gray-600 dark:text-gray-300 tabular-nums">{standing.gamesPlayed}</td>
      <td className="py-2 px-2 text-center text-sm text-gray-600 dark:text-gray-300 tabular-nums">{standing.wins}</td>
      <td className="py-2 px-2 text-center text-sm text-gray-600 dark:text-gray-300 tabular-nums">{standing.losses}</td>
      <td className="py-2 px-2 text-center text-sm text-gray-600 dark:text-gray-300 tabular-nums">{standing.otLosses}</td>
      <td className="py-2 pl-2 pr-3 text-center text-sm font-bold text-gray-900 dark:text-white tabular-nums">{standing.points}</td>
      <td className="py-2 px-2 text-center text-xs text-gray-500 dark:text-gray-400 tabular-nums hidden sm:table-cell">
        {standing.streakCode}{standing.streakCount}
      </td>
    </tr>
  )
}
