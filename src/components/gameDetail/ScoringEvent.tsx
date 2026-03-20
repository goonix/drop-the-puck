import type { ScoringPlay } from '../../types/gameDetail'
import TeamLogo from '../common/TeamLogo'

interface Props {
  play: ScoringPlay
  awayAbbrev: string
  homeAbbrev?: string
}

function periodLabel(periodType: string, period: number): string {
  if (periodType === 'OT') return 'OT'
  if (periodType === 'SO') return 'SO'
  return `P${period}`
}

export default function ScoringEvent({ play, awayAbbrev }: Props) {
  const isAway = play.teamAbbrev === awayAbbrev
  const assists = [
    play.assist1Name ? `${play.assist1Name}${play.assist1Total != null ? ` (${play.assist1Total})` : ''}` : null,
    play.assist2Name ? `${play.assist2Name}${play.assist2Total != null ? ` (${play.assist2Total})` : ''}` : null,
  ].filter(Boolean)

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700/30 last:border-0">
      {/* Score */}
      <div className="flex items-center gap-1 min-w-[52px] text-sm tabular-nums font-bold">
        <span className={isAway ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>{play.awayScore}</span>
        <span className="text-gray-300 dark:text-gray-600">–</span>
        <span className={!isAway ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>{play.homeScore}</span>
      </div>

      {/* Team logo */}
      <TeamLogo abbrev={play.teamAbbrev} size={20} dark />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
          {play.scorerName} ({play.scorerTotal})
          {play.goalModifier && play.goalModifier !== 'none' && (
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 uppercase">{play.goalModifier}</span>
          )}
        </p>
        {assists.length > 0 && (
          <p className="text-xs text-gray-500 truncate">{assists.join(', ')}</p>
        )}
      </div>

      {/* Time */}
      <div className="text-xs text-gray-500 text-right whitespace-nowrap">
        <div>{periodLabel(play.periodType, play.period)}</div>
        <div>{play.timeInPeriod}</div>
      </div>
    </div>
  )
}
