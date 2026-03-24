import type { BoxScore as BoxScoreType } from '../../types/gameDetail';

interface Props {
  boxScore: BoxScoreType;
}

function periodLabel(periodType: string, period: number): string {
  if (periodType === 'OT') return 'OT';
  if (periodType === 'SO') return 'SO';
  return `P${period}`;
}

export function BoxScore({ boxScore }: Props) {
  const periods = boxScore.byPeriod;

  return (
    <div className="px-4 py-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Score by Period
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700/50">
            <th className="text-left py-1.5 text-gray-500 dark:text-gray-400 font-medium">Team</th>
            {periods.map((p, i) => (
              <th
                key={i}
                className="text-center py-1.5 text-gray-500 dark:text-gray-400 font-medium px-2"
              >
                {periodLabel(p.periodType, p.period)}
              </th>
            ))}
            <th className="text-center py-1.5 text-gray-900 dark:text-white font-semibold px-2">
              T
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 dark:border-gray-700/30">
            <td className="py-2 text-gray-700 dark:text-gray-300 font-medium">
              {boxScore.awayTeamAbbrev}
            </td>
            {periods.map((p, i) => (
              <td
                key={i}
                className="text-center py-2 text-gray-700 dark:text-gray-300 tabular-nums px-2"
              >
                {p.awayGoals}
              </td>
            ))}
            <td className="text-center py-2 text-gray-900 dark:text-white font-bold tabular-nums px-2">
              {boxScore.awayScore}
            </td>
          </tr>
          <tr>
            <td className="py-2 text-gray-700 dark:text-gray-300 font-medium">
              {boxScore.homeTeamAbbrev}
            </td>
            {periods.map((p, i) => (
              <td
                key={i}
                className="text-center py-2 text-gray-700 dark:text-gray-300 tabular-nums px-2"
              >
                {p.homeGoals}
              </td>
            ))}
            <td className="text-center py-2 text-gray-900 dark:text-white font-bold tabular-nums px-2">
              {boxScore.homeScore}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Team stats */}
      {boxScore.teamStats.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Team Stats
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700/50">
                <th className="py-1 text-center text-gray-500 dark:text-gray-400 font-medium">
                  {boxScore.awayTeamAbbrev}
                </th>
                <th className="py-1 text-center text-gray-500 dark:text-gray-400 font-medium" />
                <th className="py-1 text-center text-gray-500 dark:text-gray-400 font-medium">
                  {boxScore.homeTeamAbbrev}
                </th>
              </tr>
            </thead>
            <tbody>
              {boxScore.teamStats.map((stat, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700/20">
                  <td className="py-1.5 text-center text-gray-700 dark:text-gray-200 tabular-nums">
                    {stat.awayValue}
                  </td>
                  <td className="py-1.5 text-center text-xs text-gray-500 capitalize">
                    {formatStatCategory(String(stat.category))}
                  </td>
                  <td className="py-1.5 text-center text-gray-700 dark:text-gray-200 tabular-nums">
                    {stat.homeValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatStatCategory(cat: string): string {
  return cat
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
