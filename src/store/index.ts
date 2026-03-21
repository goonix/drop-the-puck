import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import scheduleReducer from './slices/scheduleSlice'
import standingsReducer from './slices/standingsSlice'
import gameDetailReducer from './slices/gameDetailSlice'
import bracketReducer from './slices/bracketSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    schedule: scheduleReducer,
    standings: standingsReducer,
    gameDetail: gameDetailReducer,
    bracket: bracketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
