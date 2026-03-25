import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { selectedDateAtom } from '../../store/atoms';
import { useScheduleQuery } from '../../hooks/useScheduleQuery';
import { DateNavigator } from './DateNavigator';
import { GameList } from './GameList';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

export function ScheduleView() {
  const selectedDate = useAtomValue(selectedDateAtom);
  const { games, prevDate, nextDate, isLoading, isError, error, refetch } =
    useScheduleQuery(selectedDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pullDistance, threshold } = usePullToRefresh(scrollRef, refetch, true);

  return (
    <div className="flex flex-col h-full">
      <DateNavigator prevDate={prevDate} nextDate={nextDate} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {pullDistance > 0 && (
          <div className="flex justify-center py-2" style={{ opacity: pullDistance / threshold }}>
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
        {isLoading && games.length === 0 && <LoadingSpinner />}
        {isError && (
          <ErrorMessage
            message={error instanceof Error ? error.message : 'Failed to load schedule'}
            onRetry={refetch}
          />
        )}
        {(!isLoading || games.length > 0) && !isError && <GameList games={games} />}
      </div>
    </div>
  );
}
