import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedDate } from '../../store/slices/uiSlice';
import { setSelectedGame } from '../../store/slices/scheduleSlice';
import { prevDate, nextDate, formatDisplayDate, todayString } from '../../utils/dateUtils';

export function DateNavigator() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((s) => s.ui.selectedDate);
  const prevD = useAppSelector((s) => s.schedule.prevDate);
  const nextD = useAppSelector((s) => s.schedule.nextDate);

  const navigate = (date: string) => {
    dispatch(setSelectedDate(date));
    dispatch(setSelectedGame(null));
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('date', date);
    window.history.pushState({}, '', url.toString());
  };

  const goToToday = () => navigate(todayString());
  const isToday = selectedDate === todayString();

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700/50">
      <button
        onClick={() => navigate(prevD ?? prevDate(selectedDate))}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Previous day"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToToday}
        className={`flex-1 text-center text-sm font-medium py-1 rounded-lg transition-colors ${
          isToday
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {formatDisplayDate(selectedDate)}
      </button>

      <button
        onClick={() => navigate(nextD ?? nextDate(selectedDate))}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Next day"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
