import { useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useSchedule } from '../../hooks/useSchedule';
import { DateNavigator } from './DateNavigator';
import { GameList } from './GameList';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useAppDispatch } from '../../store/hooks';
import { loadSchedule } from '../../store/slices/scheduleSlice';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

export function ScheduleView() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((s) => s.ui.selectedDate);
  const { games, status, error } = useSchedule(selectedDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pullDistance, threshold } = usePullToRefresh(
    scrollRef,
    () => dispatch(loadSchedule(selectedDate)),
    true,
  );

  return (
    <div className="flex flex-col h-full">
      <DateNavigator />
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
        {status === 'loading' && games.length === 0 && <LoadingSpinner />}
        {status === 'failed' && (
          <ErrorMessage
            message={error ?? 'Failed to load schedule'}
            onRetry={() => dispatch(loadSchedule(selectedDate))}
          />
        )}
        {(status === 'succeeded' || games.length > 0) && <GameList games={games} />}
      </div>
    </div>
  );
}
