import { useBracket } from '../../hooks/useBracket'
import SeriesCard from './SeriesCard'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import type { PlayoffSeries } from '../../types/bracket'

const ROUND_ORDER = ['R1', 'R2', 'CF', 'SCF']
const ROUND_LABELS: Record<string, string> = {
  R1: '1st Round',
  R2: '2nd Round',
  CF: 'Conference Finals',
  SCF: 'Stanley Cup Final',
}

export default function BracketView() {
  const { data, status, error } = useBracket()

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Playoff Bracket</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {status === 'loading' && <LoadingSpinner />}
        {status === 'failed' && <ErrorMessage message={error ?? 'Failed to load bracket'} />}
        {status === 'succeeded' && data && renderBracket(data.series)}
      </div>
    </div>
  )
}

function renderBracket(series: PlayoffSeries[]) {
  const byRound: Record<string, PlayoffSeries[]> = {}
  for (const s of series) {
    const key = s.seriesAbbrev
    if (!byRound[key]) byRound[key] = []
    byRound[key].push(s)
  }

  return (
    <div className="p-3 space-y-6">
      {ROUND_ORDER.map(roundKey => {
        const roundSeries = byRound[roundKey]
        if (!roundSeries) return null
        return (
          <div key={roundKey}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {ROUND_LABELS[roundKey]}
            </h3>
            <div className={`grid gap-3 ${roundSeries.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-sm'}`}>
              {roundSeries.map(s => (
                <SeriesCard key={s.seriesLetter} series={s} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
