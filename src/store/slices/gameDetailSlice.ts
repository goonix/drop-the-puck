import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { fetchBoxScore, fetchPlayByPlay } from '../../api/gameApi'
import type { BoxScore, ScoringPlay, Play, PlayerInfo, SkaterStat, GoalieStat, TeamPlayerStats, PlayerGameStats } from '../../types/gameDetail'

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface GameDetailState {
  gameId: number | null
  boxScore: BoxScore | null
  plays: Play[]
  scoringPlays: ScoringPlay[]
  players: Record<number, PlayerInfo>
  playerStats: PlayerGameStats | null
  boxScoreStatus: LoadingStatus
  playsStatus: LoadingStatus
  boxScoreError: string | null
  playsError: string | null
}

const initialState: GameDetailState = {
  gameId: null,
  boxScore: null,
  plays: [],
  scoringPlays: [],
  players: {},
  playerStats: null,
  boxScoreStatus: 'idle',
  playsStatus: 'idle',
  boxScoreError: null,
  playsError: null,
}

function parseTeamStats(raw: any): TeamPlayerStats {
  if (!raw) return { forwards: [], defense: [], goalies: [] }
  const parseSkater = (p: any): SkaterStat => ({
    playerId: p.playerId,
    sweaterNumber: p.sweaterNumber,
    name: p.name?.default ?? '',
    position: p.position,
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    points: p.points ?? 0,
    plusMinus: p.plusMinus ?? 0,
    pim: p.pim ?? 0,
    hits: p.hits ?? 0,
    sog: p.sog ?? 0,
    blockedShots: p.blockedShots ?? 0,
    toi: p.toi ?? '0:00',
    faceoffWinningPctg: p.faceoffWinningPctg ?? 0,
    giveaways: p.giveaways ?? 0,
    takeaways: p.takeaways ?? 0,
  })
  return {
    forwards: (raw.forwards ?? []).map(parseSkater),
    defense: (raw.defense ?? []).map(parseSkater),
    goalies: (raw.goalies ?? []).map((p: any): GoalieStat => ({
      playerId: p.playerId,
      sweaterNumber: p.sweaterNumber,
      name: p.name?.default ?? '',
      position: p.position,
      shotsAgainst: p.shotsAgainst ?? 0,
      saves: p.saves ?? 0,
      goalsAgainst: p.goalsAgainst ?? 0,
      toi: p.toi ?? '0:00',
      starter: p.starter ?? false,
    })),
  }
}

export const loadBoxScore = createAsyncThunk('gameDetail/loadBoxScore', async (gameId: number) => {
  const data = await fetchBoxScore(gameId)
  const awayName = data.awayTeam.commonName?.default ?? data.awayTeam.name?.default ?? data.awayTeam.abbrev
  const homeName = data.homeTeam.commonName?.default ?? data.homeTeam.name?.default ?? data.homeTeam.abbrev
  const boxScore: BoxScore = {
    gameId: data.id,
    gameState: data.gameState,
    period: data.periodDescriptor?.number ?? 0,
    periodType: data.periodDescriptor?.periodType ?? 'REG',
    clockTimeRemaining: data.clock?.timeRemaining ?? '',
    awayTeamAbbrev: data.awayTeam.abbrev,
    awayTeamName: awayName,
    awayScore: data.awayTeam.score,
    awaySog: data.awayTeam.sog,
    homeTeamAbbrev: data.homeTeam.abbrev,
    homeTeamName: homeName,
    homeScore: data.homeTeam.score,
    homeSog: data.homeTeam.sog,
    byPeriod: data.linescore?.byPeriod.map(p => ({
      period: p.period,
      periodType: p.periodDescriptor.periodType,
      awayGoals: p.away,
      homeGoals: p.home,
    })) ?? [],
    teamStats: data.teamGameStats ?? [],
    gameOutcome: data.gameOutcome?.lastPeriodType ?? null,
  }
  const rawPgs = (data as any).playerByGameStats ?? {}
  const playerStats: PlayerGameStats = {
    awayTeam: parseTeamStats(rawPgs.awayTeam),
    homeTeam: parseTeamStats(rawPgs.homeTeam),
  }
  return { boxScore, playerStats }
})

export const loadPlayByPlay = createAsyncThunk('gameDetail/loadPlayByPlay', async (gameId: number) => {
  const data = await fetchPlayByPlay(gameId)

  const players: Record<number, PlayerInfo> = {}
  for (const r of data.rosterSpots ?? []) {
    players[r.playerId] = {
      playerId: r.playerId,
      name: `${r.firstName.default} ${r.lastName.default}`,
      sweaterNumber: r.sweaterNumber,
      positionCode: r.positionCode,
      headshot: r.headshot,
    }
  }

  const awayId = data.awayTeam.id
  const homeId = data.homeTeam.id

  const plays: Play[] = (data.plays ?? []).map(p => {
    const d = (p.details ?? {}) as Record<string, unknown>
    const ownerTeamId = d.eventOwnerTeamId as number | undefined
    const teamAbbrev = ownerTeamId === awayId
      ? data.awayTeam.abbrev
      : ownerTeamId === homeId
        ? data.homeTeam.abbrev
        : undefined
    return {
      eventId: p.eventId,
      period: p.periodDescriptor.number,
      periodType: p.periodDescriptor.periodType,
      timeInPeriod: p.timeInPeriod,
      timeRemaining: p.timeRemaining,
      typeCode: p.typeCode,
      typeDescKey: p.typeDescKey,
      sortOrder: p.sortOrder,
      details: d,
      teamAbbrev,
    }
  })

  const scoringPlays: ScoringPlay[] = plays
    .filter(p => p.typeCode === 505)
    .map(p => {
      const d = p.details as {
        scoringPlayerId?: number
        scoringPlayerTotal?: number
        assist1PlayerId?: number
        assist1PlayerTotal?: number
        assist2PlayerId?: number
        assist2PlayerTotal?: number
        eventOwnerTeamId?: number
        awayScore?: number
        homeScore?: number
        goalModifier?: string
      }
      const scorer = d.scoringPlayerId ? players[d.scoringPlayerId] : null
      const assist1 = d.assist1PlayerId ? players[d.assist1PlayerId] : null
      const assist2 = d.assist2PlayerId ? players[d.assist2PlayerId] : null

      // Determine team abbrev from owner team id
      const teamAbbrev = d.eventOwnerTeamId === awayId ? data.awayTeam.abbrev : data.homeTeam.abbrev

      return {
        eventId: p.eventId,
        period: p.period,
        periodType: p.periodType,
        timeInPeriod: p.timeInPeriod,
        scorerName: scorer?.name ?? 'Unknown',
        scorerTotal: d.scoringPlayerTotal ?? 0,
        scorerHeadshot: scorer?.headshot ?? null,
        assist1Name: assist1?.name ?? null,
        assist1Total: d.assist1PlayerTotal ?? null,
        assist2Name: assist2?.name ?? null,
        assist2Total: d.assist2PlayerTotal ?? null,
        teamAbbrev,
        awayScore: d.awayScore ?? 0,
        homeScore: d.homeScore ?? 0,
      }
    })

  // Reconstruct by-period linescore from goal plays (API no longer returns linescore directly)
  type PeriodAcc = { periodType: string; away: number; home: number }
  const periodMap: Record<number, PeriodAcc> = {}
  for (const p of plays) {
    if (p.typeCode === 505) {
      const d = p.details as { awayScore?: number; homeScore?: number }
      periodMap[p.period] = {
        periodType: p.periodType,
        away: d.awayScore ?? 0,
        home: d.homeScore ?? 0,
      }
    }
  }
  const sortedPeriodNums = Object.keys(periodMap).map(Number).sort((a, b) => a - b)
  let prevAway = 0
  let prevHome = 0
  const byPeriod = sortedPeriodNums.map(pnum => {
    const p = periodMap[pnum]
    const result = {
      period: pnum,
      periodType: p.periodType,
      awayGoals: p.away - prevAway,
      homeGoals: p.home - prevHome,
    }
    prevAway = p.away
    prevHome = p.home
    return result
  })

  return { plays, scoringPlays, players, byPeriod }
})

const gameDetailSlice = createSlice({
  name: 'gameDetail',
  initialState,
  reducers: {
    setGameId(state, action: PayloadAction<number | null>) {
      if (state.gameId !== action.payload) {
        state.gameId = action.payload
        state.boxScore = null
        state.plays = []
        state.scoringPlays = []
        state.players = {}
        state.playerStats = null
        state.boxScoreStatus = 'idle'
        state.playsStatus = 'idle'
        state.boxScoreError = null
        state.playsError = null
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadBoxScore.pending, state => {
        state.boxScoreStatus = 'loading'
        state.boxScoreError = null
      })
      .addCase(loadBoxScore.fulfilled, (state, action) => {
        state.boxScoreStatus = 'succeeded'
        state.boxScore = action.payload.boxScore
        state.playerStats = action.payload.playerStats
      })
      .addCase(loadBoxScore.rejected, (state, action) => {
        state.boxScoreStatus = 'failed'
        state.boxScoreError = action.error.message ?? 'Failed to load box score'
      })
      .addCase(loadPlayByPlay.pending, state => {
        state.playsStatus = 'loading'
        state.playsError = null
      })
      .addCase(loadPlayByPlay.fulfilled, (state, action) => {
        state.playsStatus = 'succeeded'
        state.plays = action.payload.plays
        state.scoringPlays = action.payload.scoringPlays
        state.players = action.payload.players
        // Merge reconstructed linescore into boxScore if it's empty
        if (state.boxScore && state.boxScore.byPeriod.length === 0) {
          state.boxScore.byPeriod = action.payload.byPeriod
        }
      })
      .addCase(loadPlayByPlay.rejected, (state, action) => {
        state.playsStatus = 'failed'
        state.playsError = action.error.message ?? 'Failed to load play-by-play'
      })
  },
})

export const { setGameId } = gameDetailSlice.actions
export default gameDetailSlice.reducer
