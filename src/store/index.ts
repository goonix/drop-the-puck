import { configureStore } from '@reduxjs/toolkit';
import { reducer as uiReducer } from './slices/uiSlice';
import { reducer as scheduleReducer } from './slices/scheduleSlice';
import { reducer as standingsReducer } from './slices/standingsSlice';
import { reducer as gameDetailReducer } from './slices/gameDetailSlice';
import { reducer as bracketReducer } from './slices/bracketSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    schedule: scheduleReducer,
    standings: standingsReducer,
    gameDetail: gameDetailReducer,
    bracket: bracketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
