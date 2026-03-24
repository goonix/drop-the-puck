import type { ScoringPlay } from '../../types/gameDetail';
import { ScoringEvent } from './ScoringEvent';

interface Props {
  scoringPlays: ScoringPlay[];
  awayAbbrev: string;
  homeAbbrev: string;
}

export function ScoringPlays({ scoringPlays, awayAbbrev, homeAbbrev }: Props) {
  if (scoringPlays.length === 0) {
    return <div className="py-8 text-center text-gray-500 text-sm">No goals yet</div>;
  }

  return (
    <div className="px-4 py-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Goals</h3>
      {scoringPlays.map((play) => (
        <ScoringEvent
          key={play.eventId}
          play={play}
          awayAbbrev={awayAbbrev}
          homeAbbrev={homeAbbrev}
        />
      ))}
    </div>
  );
}
