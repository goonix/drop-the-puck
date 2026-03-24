import { useEffect } from 'react';
import type { PlayoffSeries } from '../../types/bracket';
import { BracketTree } from './BracketTree';

interface Props {
  series: PlayoffSeries[];
  onClose: () => void;
}

export function BracketOverlay({ series, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full overflow-hidden"
        style={{ maxWidth: 1400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Stanley Cup Playoffs
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg leading-none"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Bracket — horizontally scrollable if viewport is narrow */}
        <div className="overflow-x-auto px-6 py-5">
          <BracketTree series={series} />
        </div>
      </div>
    </div>
  );
}
