import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useGameDetailQuery } from '../../hooks/useGameDetailQuery';
import { GameHeader } from './GameHeader';
import { BoxScore } from './BoxScore';
import { ScoringPlays } from './ScoringPlays';
import { PlayByPlay } from './PlayByPlay';
import { PlayerStats } from './PlayerStats';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

type Tab = 'scoring' | 'boxscore' | 'plays' | 'stats';

interface Props {
  onClose?: () => void;
}

export function GameDetailView({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('scoring');
  const gameId = useAppSelector((s) => s.ui.selectedGameId);
  const { boxScore, plays, scoringPlays, players, playerStats, boxScoreStatus, playsStatus } =
    useGameDetailQuery(gameId);

  if (!gameId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
        <span className="text-5xl">🏒</span>
        <p>Select a game to see details</p>
      </div>
    );
  }

  const loading = boxScoreStatus === 'loading' && !boxScore;

  return (
    <div className="flex flex-col h-full">
      {/* Close button (mobile) */}
      {onClose && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Game Detail</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && boxScore && (
        <>
          <GameHeader boxScore={boxScore} />

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700/50">
            {(
              [
                ['scoring', 'Goals'],
                ['boxscore', 'Box Score'],
                ['plays', 'Plays'],
                ['stats', 'Stats'],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'scoring' && (
              <ScoringPlays
                scoringPlays={scoringPlays}
                awayAbbrev={boxScore.awayTeamAbbrev}
                homeAbbrev={boxScore.homeTeamAbbrev}
              />
            )}
            {activeTab === 'boxscore' && <BoxScore boxScore={boxScore} />}
            {activeTab === 'plays' &&
              (playsStatus === 'loading' && plays.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <PlayByPlay plays={plays} players={players} />
              ))}
            {activeTab === 'stats' &&
              (playerStats ? (
                <PlayerStats
                  playerStats={playerStats}
                  awayAbbrev={boxScore.awayTeamAbbrev}
                  homeAbbrev={boxScore.homeTeamAbbrev}
                />
              ) : (
                <div className="py-8 text-center text-gray-500 text-sm">No stats available</div>
              ))}
          </div>
        </>
      )}

      {boxScoreStatus === 'failed' && <ErrorMessage message="Failed to load game details" />}
    </div>
  );
}
