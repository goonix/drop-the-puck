import type { PlayoffSeries } from '../../types/bracket';
import { TeamLogo } from '../common/TeamLogo';

interface Props {
  series: PlayoffSeries;
}

export function BracketTreeCard({ series }: Props) {
  const top = series.topSeedTeam;
  const bot = series.bottomSeedTeam;
  const topWon = series.topSeedWins === 4;
  const botWon = series.bottomSeedWins === 4;
  const inProgress = series.topSeedWins > 0 || series.bottomSeedWins > 0;

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-lg px-2 py-1.5 shadow-sm">
      <TeamRow
        team={top}
        seed={series.topSeedRankAbbrev}
        wins={series.topSeedWins}
        isWinner={topWon}
        isLoser={botWon}
        inProgress={inProgress}
      />
      <div className="my-1 border-t border-gray-100 dark:border-gray-700/30" />
      <TeamRow
        team={bot}
        seed={series.bottomSeedRankAbbrev}
        wins={series.bottomSeedWins}
        isWinner={botWon}
        isLoser={topWon}
        inProgress={inProgress}
      />
    </div>
  );
}

function TeamRow({
  team,
  seed,
  wins,
  isWinner,
  isLoser,
  inProgress,
}: {
  team: PlayoffSeries['topSeedTeam'];
  seed: string;
  wins: number;
  isWinner: boolean;
  isLoser: boolean;
  inProgress: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${isLoser ? 'opacity-40' : ''}`}>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-5 shrink-0 tabular-nums">
        {seed}
      </span>
      {team ? (
        <TeamLogo abbrev={team.abbrev} size={20} dark />
      ) : (
        <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 inline-block" />
      )}
      <span
        className={`flex-1 text-xs truncate ${isWinner ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
      >
        {team?.abbrev ?? 'TBD'}
      </span>
      {inProgress && (
        <span
          className={`text-xs font-bold tabular-nums ${isWinner ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
        >
          {wins}
        </span>
      )}
    </div>
  );
}
