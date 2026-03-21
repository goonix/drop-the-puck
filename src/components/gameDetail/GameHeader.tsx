import { useEffect, useRef, useState } from 'react'
import type { BoxScore } from '../../types/gameDetail'
import TeamLogo from '../common/TeamLogo'
import { getGameStatus } from '../../utils/gameUtils'
import { getTeamColor } from '../../utils/teamUtils'
import type { NormalizedGame } from '../../types/schedule'

interface Props {
  boxScore: BoxScore
}

// Adapt BoxScore to NormalizedGame-compatible shape for getGameStatus
function toGameLike(b: BoxScore): NormalizedGame {
  return {
    id: b.gameId,
    date: '',
    startTimeUTC: '',
    gameState: b.gameState as NormalizedGame['gameState'],
    period: b.period,
    periodType: b.periodType,
    clockTimeRemaining: b.clockTimeRemaining,
    clockRunning: false,
    inIntermission: false,
    awayTeamAbbrev: b.awayTeamAbbrev,
    awayTeamName: b.awayTeamName,
    awayScore: b.awayScore,
    awaySog: b.awaySog,
    homeTeamAbbrev: b.homeTeamAbbrev,
    homeTeamName: b.homeTeamName,
    homeScore: b.homeScore,
    homeSog: b.homeSog,
    venue: '',
    gameOutcome: b.gameOutcome,
    goals: [],
    tvBroadcasts: [],
  }
}

export default function GameHeader({ boxScore }: Props) {
  const status = getGameStatus(toGameLike(boxScore))
  const homeColor = getTeamColor(boxScore.homeTeamAbbrev)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700/50">
      <div className="h-1" style={{ backgroundColor: homeColor }} />
      <div className="px-4 py-4">
        {/* Status */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">{status}</div>

        {/* Score */}
        <div className="flex items-center justify-between gap-2">
          <TeamBlock
            abbrev={boxScore.awayTeamAbbrev}
            name={boxScore.awayTeamName}
            score={boxScore.awayScore}
            sog={boxScore.awaySog}
          />
          <span className="text-2xl font-bold text-gray-300 dark:text-gray-500">–</span>
          <TeamBlock
            abbrev={boxScore.homeTeamAbbrev}
            name={boxScore.homeTeamName}
            score={boxScore.homeScore}
            sog={boxScore.homeSog}
            home
          />
        </div>
      </div>
    </div>
  )
}

function TeamBlock({
  abbrev,
  score,
  sog,
  home = false,
}: {
  abbrev: string
  name?: string
  score: number
  sog: number
  home?: boolean
}) {
  const prevScore = useRef(score)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    if (score > prevScore.current) {
      setFlashing(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlashing(true))
      })
      const t = setTimeout(() => setFlashing(false), 1400)
      prevScore.current = score
      return () => clearTimeout(t)
    }
    prevScore.current = score
  }, [score])

  return (
    <div className={`flex flex-col items-center gap-1 flex-1 ${home ? 'items-end' : 'items-start'}`}>
      <TeamLogo abbrev={abbrev} size={48} dark />
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{abbrev}</span>
      <span className={`text-4xl font-bold text-gray-900 dark:text-white tabular-nums ${flashing ? 'score-flash' : ''}`}>
        {score}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500">{sog} SOG</span>
    </div>
  )
}
