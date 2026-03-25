import { useState } from 'react';
import { useBracketQuery } from '../../hooks/useBracketQuery';
import { SeriesCard } from './SeriesCard';
import { BracketOverlay } from './BracketOverlay';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import type { PlayoffSeries } from '../../types/bracket';
import { MOCK_BRACKET } from './mockBracket';

const ROUND_ORDER = ['R1', 'R2', 'CF', 'SCF'];
const ROUND_LABELS: Record<string, string> = {
  R1: '1st Round',
  R2: '2nd Round',
  CF: 'Conference Finals',
  SCF: 'Stanley Cup Final',
};

export function BracketView() {
  const { data, isLoading, isError, error } = useBracketQuery();
  const [showTree, setShowTree] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const overlayData = useMock ? MOCK_BRACKET : (data?.series ?? []);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Playoff Bracket</h2>
          <div className="hidden md:flex items-center gap-2">
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  setUseMock(true);
                  setShowTree(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 transition-colors"
                title="Preview with mock data (dev only)"
              >
                Preview
              </button>
            )}
            {!isLoading && !isError && data && (
              <button
                onClick={() => {
                  setUseMock(false);
                  setShowTree(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <span>⬡</span> Full Bracket
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && <LoadingSpinner />}
          {isError && (
            <ErrorMessage
              message={error instanceof Error ? error.message : 'Failed to load bracket'}
            />
          )}
          {!isLoading && !isError && data && renderBracket(data.series)}
        </div>
      </div>

      {showTree && (
        <BracketOverlay
          series={overlayData}
          onClose={() => {
            setShowTree(false);
            setUseMock(false);
          }}
        />
      )}
    </>
  );
}

function renderBracket(series: PlayoffSeries[]) {
  const byRound: Record<string, PlayoffSeries[]> = {};
  for (const s of series) {
    const key = s.seriesAbbrev;
    if (!byRound[key]) byRound[key] = [];
    byRound[key].push(s);
  }

  return (
    <div className="p-3 space-y-6">
      {ROUND_ORDER.map((roundKey) => {
        const roundSeries = byRound[roundKey];
        if (!roundSeries) return null;
        return (
          <div key={roundKey}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {ROUND_LABELS[roundKey]}
            </h3>
            <div
              className={`grid gap-3 ${roundSeries.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-sm'}`}
            >
              {roundSeries.map((s) => (
                <SeriesCard key={s.seriesLetter} series={s} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
