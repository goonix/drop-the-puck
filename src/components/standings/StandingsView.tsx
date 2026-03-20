import { useAppSelector } from '../../store/hooks'
import { useStandings } from '../../hooks/useStandings'
import StandingsToggle from './StandingsToggle'
import StandingsTable from './StandingsTable'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import type { TeamStanding } from '../../types/standings'

export default function StandingsView() {
  const { standings, status, error } = useStandings()
  const grouping = useAppSelector(s => s.ui.standingsGrouping)

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 p-3 border-b border-gray-700/50">
        <StandingsToggle />
      </div>
      <div className="flex-1 overflow-y-auto">
        {status === 'loading' && <LoadingSpinner />}
        {status === 'failed' && <ErrorMessage message={error ?? 'Failed to load standings'} />}
        {status === 'succeeded' && grouping === 'wildcard' && renderWildcard(standings)}
        {status === 'succeeded' && grouping !== 'wildcard' && renderGrouped(standings, grouping)}
      </div>
    </div>
  )
}

function groupByKey(items: TeamStanding[], key: 'conference' | 'division'): Record<string, TeamStanding[]> {
  const result: Record<string, TeamStanding[]> = {}
  for (const item of items) {
    const k = key === 'conference' ? item.conference : item.division
    if (!result[k]) result[k] = []
    result[k].push(item)
  }
  return result
}

function renderGrouped(standings: TeamStanding[], grouping: 'conference' | 'division') {
  const sortOrder =
    grouping === 'conference'
      ? ['Eastern', 'Western']
      : ['Atlantic', 'Metropolitan', 'Central', 'Pacific']
  const grouped = groupByKey(standings, grouping)
  return sortOrder.map(key => {
    const group = grouped[key]
    if (!group) return null
    const sorted = [...group].sort((a, b) =>
      grouping === 'conference'
        ? a.conferenceSequence - b.conferenceSequence
        : a.divisionSequence - b.divisionSequence,
    )
    return (
      <StandingsTable
        key={key}
        title={`${key} ${grouping === 'conference' ? 'Conference' : 'Division'}`}
        standings={sorted}
      />
    )
  })
}

function renderWildcard(standings: TeamStanding[]) {
  const conferences = ['Eastern', 'Western']
  return conferences.map(conf => {
    const confTeams = standings.filter(s => s.conference === conf)

    // Division leaders: top 3 per division within this conference
    const divisionMap: Record<string, TeamStanding[]> = {}
    for (const t of confTeams) {
      if (!divisionMap[t.division]) divisionMap[t.division] = []
      divisionMap[t.division].push(t)
    }

    const divOrder = conf === 'Eastern'
      ? ['Atlantic', 'Metropolitan']
      : ['Central', 'Pacific']

    // Wildcard pool: teams ranked 4th or lower in their division
    const wildcardPool = confTeams
      .filter(t => t.divisionSequence > 3)
      .sort((a, b) => a.wildcardSequence - b.wildcardSequence)

    const inWildcard = wildcardPool.slice(0, 2)
    const outWildcard = wildcardPool.slice(2)

    const isEastern = conf === 'Eastern'
    const bannerClass = isEastern
      ? 'bg-blue-600 dark:bg-blue-700'
      : 'bg-orange-500 dark:bg-orange-600'

    return (
      <div key={conf} className="mb-6">
        {/* Conference banner */}
        <div className={`${bannerClass} px-3 py-2 flex items-center gap-2`}>
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            {conf} Conference
          </span>
        </div>

        {divOrder.map(div => {
          const leaders = (divisionMap[div] ?? [])
            .filter(t => t.divisionSequence <= 3)
            .sort((a, b) => a.divisionSequence - b.divisionSequence)
          return <StandingsTable key={div} title={`${div} Division`} standings={leaders} />
        })}
        <StandingsTable title="Wild Card" standings={inWildcard} />
        {outWildcard.length > 0 && (
          <StandingsTable title="Out of Playoff Position" standings={outWildcard} />
        )}
      </div>
    )
  })
}
