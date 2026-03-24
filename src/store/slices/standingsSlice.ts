import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStandings } from '../../api/standingsApi';
import type { TeamStanding } from '../../types/standings';

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface StandingsState {
  standings: TeamStanding[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: StandingsState = {
  standings: [],
  status: 'idle',
  error: null,
};

export const loadStandings = createAsyncThunk('standings/load', async () => {
  const data = await fetchStandings();
  return data.standings.map((s) => ({
    teamAbbrev: s.teamAbbrev.default,
    teamName: s.teamName.default,
    teamLogo: s.teamLogo,
    conference: s.conferenceName,
    division: s.divisionName,
    gamesPlayed: s.gamesPlayed,
    wins: s.wins,
    losses: s.losses,
    otLosses: s.otLosses,
    points: s.points,
    pointPctg: s.pointPctg,
    goalFor: s.goalFor,
    goalAgainst: s.goalAgainst,
    goalDifferential: s.goalDifferential,
    streakCode: s.streakCode,
    streakCount: s.streakCount,
    clinchIndicator: s.clinchIndicator,
    leagueSequence: s.leagueSequence,
    conferenceSequence: s.conferenceSequence,
    divisionSequence: s.divisionSequence,
    wildcardSequence: s.wildcardSequence,
  })) as TeamStanding[];
});

const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStandings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadStandings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.standings = action.payload;
      })
      .addCase(loadStandings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load standings';
      });
  },
});

export const reducer = standingsSlice.reducer;
