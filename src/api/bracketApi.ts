import nhlClient from './nhlClient'

interface RawBracketTeam {
  id?: number
  abbrev?: string
  name?: { default: string }
  commonName?: { default: string }
  logo?: string
}

interface RawSeries {
  seriesLetter: string
  seriesTitle: string
  seriesAbbrev: string
  playoffRound: number
  topSeedRank: number
  topSeedRankAbbrev: string
  topSeedWins: number
  bottomSeedRank: number
  bottomSeedRankAbbrev: string
  bottomSeedWins: number
  topSeedTeam?: RawBracketTeam
  bottomSeedTeam?: RawBracketTeam
}

interface RawBracketResponse {
  series: RawSeries[]
}

import type { BracketData, BracketTeam, PlayoffSeries } from '../types/bracket'

function normalizeTeam(raw?: RawBracketTeam): BracketTeam | null {
  if (!raw?.abbrev) return null
  return {
    id: raw.id ?? 0,
    abbrev: raw.abbrev,
    name: raw.name?.default ?? raw.commonName?.default ?? raw.abbrev,
    logo: raw.logo ?? '',
  }
}

export async function fetchBracket(year: number): Promise<BracketData> {
  const { data } = await nhlClient.get<RawBracketResponse>(`/playoff-bracket/${year}`)
  return {
    series: data.series.map((s): PlayoffSeries => ({
      seriesLetter: s.seriesLetter,
      seriesTitle: s.seriesTitle,
      seriesAbbrev: s.seriesAbbrev,
      playoffRound: s.playoffRound,
      topSeedRank: s.topSeedRank,
      topSeedRankAbbrev: s.topSeedRankAbbrev,
      topSeedWins: s.topSeedWins,
      bottomSeedRank: s.bottomSeedRank,
      bottomSeedRankAbbrev: s.bottomSeedRankAbbrev,
      bottomSeedWins: s.bottomSeedWins,
      topSeedTeam: normalizeTeam(s.topSeedTeam),
      bottomSeedTeam: normalizeTeam(s.bottomSeedTeam),
    })),
  }
}
