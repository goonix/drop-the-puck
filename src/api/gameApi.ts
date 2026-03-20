import nhlClient from './nhlClient'
import type { NHLBoxScoreResponse, NHLPlayByPlayResponse } from '../types/nhl'

export async function fetchBoxScore(gameId: number): Promise<NHLBoxScoreResponse> {
  const { data } = await nhlClient.get<NHLBoxScoreResponse>(`/gamecenter/${gameId}/boxscore`)
  return data
}

export async function fetchPlayByPlay(gameId: number): Promise<NHLPlayByPlayResponse> {
  const { data } = await nhlClient.get<NHLPlayByPlayResponse>(`/gamecenter/${gameId}/play-by-play`)
  return data
}
