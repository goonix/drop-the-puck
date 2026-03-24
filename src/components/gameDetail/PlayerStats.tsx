import type { PlayerGameStats, SkaterStat, GoalieStat } from '../../types/gameDetail';

interface Props {
  playerStats: PlayerGameStats;
  awayAbbrev: string;
  homeAbbrev: string;
}

export function PlayerStats({ playerStats, awayAbbrev, homeAbbrev }: Props) {
  return (
    <div className="px-2 py-3 space-y-4">
      <TeamStats label={awayAbbrev} stats={playerStats.awayTeam} />
      <TeamStats label={homeAbbrev} stats={playerStats.homeTeam} />
    </div>
  );
}

function TeamStats({ label, stats }: { label: string; stats: PlayerGameStats['awayTeam'] }) {
  const skaters = [...stats.forwards, ...stats.defense].sort(
    (a, b) => b.points - a.points || b.goals - a.goals || b.toi.localeCompare(a.toi) * -1,
  );

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 py-1.5 mb-1 bg-gray-100 dark:bg-gray-800/60">
        {label}
      </h3>

      {/* Skaters */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700/50">
              <th className="text-left py-1.5 px-1 text-gray-500 font-medium w-6">#</th>
              <th className="text-left py-1.5 px-1 text-gray-500 font-medium">Player</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">G</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">A</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">P</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">+/-</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">SOG</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">HIT</th>
              <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">TOI</th>
            </tr>
          </thead>
          <tbody>
            {skaters.map((p) => (
              <SkaterRow key={p.playerId} player={p} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Goalies */}
      {stats.goalies.length > 0 && (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700/50">
                <th className="text-left py-1.5 px-1 text-gray-500 font-medium w-6">#</th>
                <th className="text-left py-1.5 px-1 text-gray-500 font-medium">Goalie</th>
                <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">SA</th>
                <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">SV</th>
                <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">GA</th>
                <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">SV%</th>
                <th className="text-center py-1.5 px-1.5 text-gray-500 font-medium">TOI</th>
              </tr>
            </thead>
            <tbody>
              {stats.goalies.map((g) => (
                <GoalieRow key={g.playerId} goalie={g} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SkaterRow({ player: p }: { player: SkaterStat }) {
  const isForward = ['L', 'R', 'C'].includes(p.position);
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/20 last:border-0">
      <td className="py-1.5 px-1 text-gray-400 dark:text-gray-500">{p.sweaterNumber}</td>
      <td className="py-1.5 px-1">
        <span className="text-gray-800 dark:text-gray-200 font-medium">{p.name}</span>
        <span className="ml-1 text-gray-400 dark:text-gray-600">
          {isForward ? p.position : 'D'}
        </span>
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {p.goals}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {p.assists}
      </td>
      <td className="py-1.5 px-1.5 text-center font-semibold text-gray-900 dark:text-white tabular-nums">
        {p.points}
      </td>
      <td
        className={`py-1.5 px-1.5 text-center tabular-nums ${p.plusMinus > 0 ? 'text-green-600 dark:text-green-400' : p.plusMinus < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
      >
        {p.plusMinus > 0 ? `+${p.plusMinus}` : p.plusMinus}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {p.sog}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {p.hits}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-500 dark:text-gray-400 tabular-nums">
        {p.toi}
      </td>
    </tr>
  );
}

function GoalieRow({ goalie: g }: { goalie: GoalieStat }) {
  const savePct = g.shotsAgainst > 0 ? (g.saves / g.shotsAgainst).toFixed(3) : '—';
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/20 last:border-0">
      <td className="py-1.5 px-1 text-gray-400 dark:text-gray-500">{g.sweaterNumber}</td>
      <td className="py-1.5 px-1">
        <span className="text-gray-800 dark:text-gray-200 font-medium">{g.name}</span>
        {g.starter && <span className="ml-1 text-xs text-blue-500">(S)</span>}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {g.shotsAgainst}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {g.saves}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {g.goalsAgainst}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">
        {savePct}
      </td>
      <td className="py-1.5 px-1.5 text-center text-gray-500 dark:text-gray-400 tabular-nums">
        {g.toi}
      </td>
    </tr>
  );
}
