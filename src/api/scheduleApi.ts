import nhlClient from './nhlClient'
import type { NHLScoreResponse } from '../types/nhl'

export async function fetchScore(date: string): Promise<NHLScoreResponse> {
  const { data } = await nhlClient.get<NHLScoreResponse>(`/score/${date}`)
  return data
}

export async function fetchScoreNow(): Promise<NHLScoreResponse> {
  const { data } = await nhlClient.get<NHLScoreResponse>('/score/now')
  return data
}
