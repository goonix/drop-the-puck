import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { todayString } from '../utils/dateUtils';

// UI navigation
export const activeViewAtom = atom<'schedule' | 'standings' | 'gameDetail' | 'bracket'>('schedule');
export const selectedGameIdAtom = atom<number | null>(null);

// Date
export const selectedDateAtom = atom<string>(todayString());

// Theme — persisted to localStorage
export const themeAtom = atomWithStorage<'dark' | 'light'>(
  'theme',
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light',
);

// Favorites — persisted to localStorage
export const favoriteTeamAbbrevsAtom = atomWithStorage<string[]>('favoriteTeams', []);

// Standings grouping — persisted to localStorage
export const standingsGroupingAtom = atomWithStorage<'conference' | 'division' | 'wildcard'>(
  'standingsGrouping',
  'conference',
);

// Horn muted — persisted, default true
export const hornMutedAtom = atomWithStorage<boolean>('hornMuted', true);
