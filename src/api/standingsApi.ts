import nhlClient from './nhlClient'
import type { NHLStandingsResponse } from '../types/nhl'

export async function fetchStandings(): Promise<NHLStandingsResponse> {
  const { data } = await nhlClient.get<NHLStandingsResponse>('/standings/now')
  return data
}
