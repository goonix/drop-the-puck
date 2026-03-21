import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBracket } from '../../api/bracketApi'
import type { BracketData } from '../../types/bracket'

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface BracketState {
  data: BracketData | null
  status: LoadingStatus
  error: string | null
  year: number
}

const currentYear = new Date().getFullYear()

const initialState: BracketState = {
  data: null,
  status: 'idle',
  error: null,
  year: currentYear,
}

export const loadBracket = createAsyncThunk('bracket/load', async (year: number) => {
  return await fetchBracket(year)
})

const bracketSlice = createSlice({
  name: 'bracket',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadBracket.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadBracket.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(loadBracket.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load bracket'
      })
  },
})

export default bracketSlice.reducer
