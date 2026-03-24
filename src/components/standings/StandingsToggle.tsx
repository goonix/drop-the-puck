import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setStandingsGrouping } from '../../store/slices/uiSlice';

export function StandingsToggle() {
  const dispatch = useAppDispatch();
  const grouping = useAppSelector((s) => s.ui.standingsGrouping);

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {(['conference', 'division', 'wildcard'] as const).map((g) => (
        <button
          key={g}
          onClick={() => dispatch(setStandingsGrouping(g))}
          className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md transition-colors capitalize ${
            grouping === g
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
