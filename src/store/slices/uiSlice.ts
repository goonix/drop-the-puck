import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { todayString } from '../../utils/dateUtils'

type ActiveView = 'schedule' | 'standings' | 'gameDetail' | 'bracket'
type Theme = 'dark' | 'light'
type StandingsGrouping = 'conference' | 'division' | 'wildcard'

interface UIState {
  activeView: ActiveView
  theme: Theme
  favoriteTeamAbbrevs: string[]
  selectedDate: string
  standingsGrouping: StandingsGrouping
  hornMuted: boolean
}

function getInitialTheme(): Theme {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialFavorites(): string[] {
  try {
    const saved = localStorage.getItem('favoriteTeams')
    if (saved) return JSON.parse(saved) as string[]
  } catch { /* ignore parse errors */ }
  return []
}

function getInitialHornMuted(): boolean {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('hornMuted')
    if (saved !== null) return saved === 'true'
  }
  return true // muted by default
}

const initialState: UIState = {
  activeView: 'schedule',
  theme: getInitialTheme(),
  favoriteTeamAbbrevs: getInitialFavorites(),
  selectedDate: todayString(),
  standingsGrouping: 'conference',
  hornMuted: getInitialHornMuted(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView(state, action: PayloadAction<ActiveView>) {
      state.activeView = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('theme', state.theme)
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload
    },
    setStandingsGrouping(state, action: PayloadAction<'conference' | 'division' | 'wildcard'>) {
      state.standingsGrouping = action.payload
    },
    toggleFavoriteTeam(state, action: PayloadAction<string>) {
      const abbrev = action.payload
      const idx = state.favoriteTeamAbbrevs.indexOf(abbrev)
      if (idx >= 0) {
        state.favoriteTeamAbbrevs.splice(idx, 1)
      } else {
        state.favoriteTeamAbbrevs.push(abbrev)
      }
      localStorage.setItem('favoriteTeams', JSON.stringify(state.favoriteTeamAbbrevs))
    },
    setFavoriteTeams(state, action: PayloadAction<string[]>) {
      state.favoriteTeamAbbrevs = action.payload
      localStorage.setItem('favoriteTeams', JSON.stringify(state.favoriteTeamAbbrevs))
    },
    toggleHornMuted(state) {
      state.hornMuted = !state.hornMuted
      localStorage.setItem('hornMuted', String(state.hornMuted))
    },
  },
})

export const {
  setActiveView,
  toggleTheme,
  setTheme,
  setSelectedDate,
  setStandingsGrouping,
  toggleFavoriteTeam,
  setFavoriteTeams,
  toggleHornMuted,
} = uiSlice.actions
export default uiSlice.reducer
