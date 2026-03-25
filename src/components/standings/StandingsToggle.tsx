import { useAtom } from 'jotai';
import { standingsGroupingAtom } from '../../store/atoms';

export function StandingsToggle() {
  const [grouping, setGrouping] = useAtom(standingsGroupingAtom);

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {(['conference', 'division', 'wildcard'] as const).map((g) => (
        <button
          key={g}
          onClick={() => setGrouping(g)}
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
