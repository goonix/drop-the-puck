import type { Play, PlayerInfo } from '../../types/gameDetail';
import { TeamLogo } from '../common/TeamLogo';

interface Props {
  plays: Play[];
  players: Record<number, PlayerInfo>;
}

const EVENT_LABELS: Record<string, string> = {
  goal: 'Goal',
  'shot-on-goal': 'Shot',
  'missed-shot': 'Missed Shot',
  'blocked-shot': 'Block',
  hit: 'Hit',
  faceoff: 'Faceoff',
  stoppage: 'Stoppage',
  'period-start': 'Period Start',
  'period-end': 'Period End',
  penalty: 'Penalty',
  takeaway: 'Takeaway',
  giveaway: 'Giveaway',
  'delayed-penalty': 'Delayed Penalty',
};

function periodLabel(periodType: string, period: number): string {
  if (periodType === 'OT') return 'OT';
  if (periodType === 'SO') return 'SO';
  return `P${period}`;
}

export function PlayByPlay({ plays, players }: Props) {
  const reversed = [...plays].reverse();

  return (
    <div className="px-4 py-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Play by Play
      </h3>
      <div className="space-y-0">
        {reversed.map((play) => (
          <PlayRow key={play.eventId} play={play} players={players} />
        ))}
      </div>
    </div>
  );
}

function PlayRow({ play, players }: { play: Play; players: Record<number, PlayerInfo> }) {
  const label = EVENT_LABELS[play.typeDescKey] ?? play.typeDescKey;
  const d = play.details as Record<string, number>;

  const primaryPlayer =
    d.scoringPlayerId ||
    d.winningPlayerId ||
    d.shootingPlayerId ||
    d.hittingPlayerId ||
    d.committedByPlayerId ||
    d.playerId;
  const player = primaryPlayer ? players[primaryPlayer] : null;

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-100 dark:border-gray-700/20 last:border-0 text-xs">
      <span className="text-gray-400 dark:text-gray-600 w-8 text-right tabular-nums">
        {play.timeInPeriod}
      </span>
      <span className="text-gray-400 dark:text-gray-600 w-6">
        {periodLabel(play.periodType, play.period)}
      </span>
      <span
        className={`w-24 font-medium ${play.typeCode === 505 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-1.5 truncate">
        {play.teamAbbrev && <TeamLogo abbrev={play.teamAbbrev} size={16} dark />}
        <span className="text-gray-500 dark:text-gray-400 truncate">{player?.name ?? ''}</span>
      </div>
    </div>
  );
}
