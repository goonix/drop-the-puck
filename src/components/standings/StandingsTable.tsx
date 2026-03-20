import type { TeamStanding } from '../../types/standings'
import TeamRow from './TeamRow'

interface Props {
  title: string
  standings: TeamStanding[]
}

export default function StandingsTable({ title, standings }: Props) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2 bg-gray-100 dark:bg-gray-800/60">
        {title}
      </h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700/50">
            <th className="py-1.5 pl-3 pr-1 text-left text-xs text-gray-500 font-medium w-6">#</th>
            <th className="py-1.5 pr-3 text-left text-xs text-gray-500 font-medium">Team</th>
            <th className="py-1.5 px-2 text-center text-xs text-gray-500 font-medium">GP</th>
            <th className="py-1.5 px-2 text-center text-xs text-gray-500 font-medium">W</th>
            <th className="py-1.5 px-2 text-center text-xs text-gray-500 font-medium">L</th>
            <th className="py-1.5 px-2 text-center text-xs text-gray-500 font-medium">OTL</th>
            <th className="py-1.5 pl-2 pr-3 text-center text-xs text-gray-500 font-medium">PTS</th>
            <th className="py-1.5 px-2 text-center text-xs text-gray-500 font-medium hidden sm:table-cell">STK</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <TeamRow key={s.teamAbbrev} standing={s} rank={i + 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
