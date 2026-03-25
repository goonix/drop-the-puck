import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { activeViewAtom, selectedGameIdAtom, themeAtom, selectedDateAtom } from '../../store/atoms';

import { Header } from './Header';
import { NavBar } from './NavBar';
import { MobileNav } from './MobileNav';
import { ScheduleView } from '../schedule/ScheduleView';
import { StandingsView } from '../standings/StandingsView';
import { GameDetailView } from '../gameDetail/GameDetailView';
import { BracketView } from '../bracket/BracketView';

export function AppShell() {
  const [activeView, setActiveView] = useAtom(activeViewAtom);
  const selectedGameId = useAtomValue(selectedGameIdAtom);
  const theme = useAtomValue(themeAtom);
  const setSelectedDate = useSetAtom(selectedDateAtom);

  // Sync theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Sync date from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setSelectedDate(date);
    }
  }, [setSelectedDate]);

  const showGameDetail =
    activeView === 'gameDetail' || (activeView === 'schedule' && selectedGameId !== null);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <NavBar />

      {/* Desktop: two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          className={`flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700/50 overflow-hidden
            ${activeView === 'gameDetail' ? 'hidden md:flex' : 'flex'}`}
        >
          {activeView === 'standings' ? (
            <StandingsView />
          ) : activeView === 'bracket' ? (
            <BracketView />
          ) : (
            <ScheduleView />
          )}
        </div>

        {/* Right panel: game detail (desktop always, mobile when selected) */}
        <div
          className={`flex-col flex-1 overflow-hidden
            ${showGameDetail && selectedGameId !== null ? 'flex' : 'hidden md:flex'}`}
        >
          <GameDetailView
            onClose={
              activeView === 'gameDetail'
                ? () => {
                    setActiveView('schedule');
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Mobile overlay for game detail */}
      {activeView === 'gameDetail' && selectedGameId !== null && (
        <div className="md:hidden fixed inset-0 z-30 bg-gray-950 flex flex-col pt-14">
          <GameDetailView
            onClose={() => {
              setActiveView('schedule');
            }}
          />
        </div>
      )}

      <MobileNav />
    </div>
  );
}
