import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { fetchScore } from '../../api/scheduleApi'
import { normalizeGame } from '../../utils/gameUtils'
import type { NormalizedGame } from '../../types/schedule'

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface ScheduleState {
  gamesByDate: Record<string, NormalizedGame[]>
  selectedGameId: number | null
  loadingDates: Record<string, LoadingStatus>
  errorDates: Record<string, string>
  hasLiveGames: boolean
  prevDate: string | null
  nextDate: string | null
}

const initialState: ScheduleState = {
  gamesByDate: {},
  selectedGameId: null,
  loadingDates: {},
  errorDates: {},
  hasLiveGames: false,
  prevDate: null,
  nextDate: null,
}

export const loadSchedule = createAsyncThunk(
  'schedule/loadSchedule',
  async (date: string) => {
    const data = await fetchScore(date)
    return {
      date,
      games: data.games.map(normalizeGame),
      prevDate: data.prevDate,
      nextDate: data.nextDate,
    }
  },
)

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedGame(state, action: PayloadAction<number | null>) {
      state.selectedGameId = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadSchedule.pending, (state, action) => {
        state.loadingDates[action.meta.arg] = 'loading'
        delete state.errorDates[action.meta.arg]
      })
      .addCase(loadSchedule.fulfilled, (state, action) => {
        const { date, games, prevDate, nextDate } = action.payload
        state.gamesByDate[date] = games
        state.loadingDates[date] = 'succeeded'
        state.prevDate = prevDate
        state.nextDate = nextDate
        state.hasLiveGames = games.some(
          g => g.gameState === 'LIVE' || g.gameState === 'CRIT',
        )
      })
      .addCase(loadSchedule.rejected, (state, action) => {
        const date = action.meta.arg
        state.loadingDates[date] = 'failed'
        state.errorDates[date] = action.error.message ?? 'Failed to load'
      })
  },
})

export const { setSelectedGame } = scheduleSlice.actions
export default scheduleSlice.reducer
