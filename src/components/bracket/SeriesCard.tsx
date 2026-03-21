import type { PlayoffSeries } from '../../types/bracket'
import TeamLogo from '../common/TeamLogo'

interface Props {
  series: PlayoffSeries
}

export default function SeriesCard({ series }: Props) {
  const top = series.topSeedTeam
  const bot = series.bottomSeedTeam
  const maxWins = 4
  const topWon = series.topSeedWins === maxWins
  const botWon = series.bottomSeedWins === maxWins
  const inProgress = series.topSeedWins > 0 || series.bottomSeedWins > 0
  const decided = topWon || botWon

  return (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-3">
      <TeamMatchup
        team={top}
        seedLabel={series.topSeedRankAbbrev}
        wins={series.topSeedWins}
        isWinner={topWon}
        isLoser={botWon}
        inProgress={inProgress}
      />
      <div className="my-1.5 border-t border-gray-100 dark:border-gray-700/30" />
      <TeamMatchup
        team={bot}
        seedLabel={series.bottomSeedRankAbbrev}
        wins={series.bottomSeedWins}
        isWinner={botWon}
        isLoser={topWon}
        inProgress={inProgress}
      />
      {decided && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
          {topWon ? (top?.abbrev ?? 'TBD') : (bot?.abbrev ?? 'TBD')} wins series
        </p>
      )}
    </div>
  )
}

function TeamMatchup({
  team,
  seedLabel,
  wins,
  isWinner,
  isLoser,
  inProgress,
}: {
  team: PlayoffSeries['topSeedTeam']
  seedLabel: string
  wins: number
  isWinner: boolean
  isLoser: boolean
  inProgress: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${isLoser ? 'opacity-40' : ''}`}>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-7 shrink-0">{seedLabel}</span>
      {team ? (
        <TeamLogo abbrev={team.abbrev} size={22} dark />
      ) : (
        <span className="w-[22px] h-[22px] rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      )}
      <span className={`flex-1 text-sm truncate ${isWinner ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
        {team?.abbrev ?? 'TBD'}
      </span>
      {inProgress && (
        <span className={`text-sm font-bold tabular-nums ${isWinner ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {wins}
        </span>
      )}
    </div>
  )
}
