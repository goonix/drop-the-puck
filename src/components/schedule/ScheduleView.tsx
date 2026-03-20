import { useAppSelector } from '../../store/hooks'
import { useSchedule } from '../../hooks/useSchedule'
import DateNavigator from './DateNavigator'
import GameList from './GameList'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import { useAppDispatch } from '../../store/hooks'
import { loadSchedule } from '../../store/slices/scheduleSlice'

export default function ScheduleView() {
  const dispatch = useAppDispatch()
  const selectedDate = useAppSelector(s => s.ui.selectedDate)
  const { games, status, error } = useSchedule(selectedDate)

  return (
    <div className="flex flex-col h-full">
      <DateNavigator />
      <div className="flex-1 overflow-y-auto">
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
  )
}
