// DEV ONLY — mock playoff bracket for previewing the tree overlay
// Remove or ignore in production; only imported behind import.meta.env.DEV guard
import type { PlayoffSeries } from '../../types/bracket'

function series(
  letter: string,
  title: string,
  abbrev: string,
  topAbbrev: string, topName: string, topSeed: number, topSeedAbbrev: string, topWins: number,
  botAbbrev: string, botName: string, botSeed: number, botSeedAbbrev: string, botWins: number,
): PlayoffSeries {
  return {
    seriesLetter: letter,
    seriesTitle: title,
    seriesAbbrev: abbrev,
    playoffRound: abbrev === 'R1' ? 1 : abbrev === 'R2' ? 2 : abbrev === 'CF' ? 3 : 4,
    topSeedRank: topSeed,
    topSeedRankAbbrev: topSeedAbbrev,
    topSeedWins: topWins,
    bottomSeedRank: botSeed,
    bottomSeedRankAbbrev: botSeedAbbrev,
    bottomSeedWins: botWins,
    topSeedTeam: { id: 0, abbrev: topAbbrev, name: topName, logo: '' },
    bottomSeedTeam: { id: 0, abbrev: botAbbrev, name: botName, logo: '' },
  }
}

export const MOCK_BRACKET: PlayoffSeries[] = [
  // ── Western R1 ──────────────────────────────────────────────────────────
  series('E', 'Western First Round',    'R1', 'VAN', 'Vancouver Canucks',    1, 'P1',  4, 'NSH', 'Nashville Predators',  8, 'WC2', 2),
  series('F', 'Western First Round',    'R1', 'EDM', 'Edmonton Oilers',      2, 'P2',  4, 'LAK', 'LA Kings',             3, 'P3',  1),
  series('G', 'Western First Round',    'R1', 'DAL', 'Dallas Stars',         1, 'C1',  4, 'VGK', 'Vegas Golden Knights',  6, 'WC1', 3),
  series('H', 'Western First Round',    'R1', 'COL', 'Colorado Avalanche',   2, 'C2',  4, 'STL', 'St. Louis Blues',       3, 'C3',  1),

  // ── Western R2 ──────────────────────────────────────────────────────────
  series('K', 'Western Second Round',   'R2', 'EDM', 'Edmonton Oilers',      2, 'P2',  4, 'VAN', 'Vancouver Canucks',    1, 'P1',  3),
  series('L', 'Western Second Round',   'R2', 'DAL', 'Dallas Stars',         1, 'C1',  4, 'COL', 'Colorado Avalanche',   2, 'C2',  2),

  // ── Western CF ──────────────────────────────────────────────────────────
  series('N', 'Western Conference Final','CF', 'EDM', 'Edmonton Oilers',     2, 'P2',  4, 'DAL', 'Dallas Stars',         1, 'C1',  2),

  // ── Stanley Cup Final ────────────────────────────────────────────────────
  series('O', 'Stanley Cup Final',      'SCF', 'EDM', 'Edmonton Oilers',     2, 'W2',  2, 'FLA', 'Florida Panthers',     2, 'E2',  3),

  // ── Eastern R1 ──────────────────────────────────────────────────────────
  series('A', 'Eastern First Round',    'R1', 'BOS', 'Boston Bruins',        1, 'A1',  3, 'TOR', 'Toronto Maple Leafs',  4, 'WC2', 4),
  series('B', 'Eastern First Round',    'R1', 'FLA', 'Florida Panthers',     2, 'A2',  4, 'TBL', 'Tampa Bay Lightning',   3, 'A3',  2),
  series('C', 'Eastern First Round',    'R1', 'NYR', 'NY Rangers',           1, 'M1',  4, 'WSH', 'Washington Capitals',   6, 'WC1', 0),
  series('D', 'Eastern First Round',    'R1', 'CAR', 'Carolina Hurricanes',  2, 'M2',  4, 'NYI', 'NY Islanders',          3, 'M3',  2),

  // ── Eastern R2 ──────────────────────────────────────────────────────────
  series('I', 'Eastern Second Round',   'R2', 'FLA', 'Florida Panthers',     2, 'A2',  4, 'TOR', 'Toronto Maple Leafs',  4, 'WC2', 2),
  series('J', 'Eastern Second Round',   'R2', 'NYR', 'NY Rangers',           1, 'M1',  4, 'CAR', 'Carolina Hurricanes',  2, 'M2',  2),

  // ── Eastern CF ──────────────────────────────────────────────────────────
  series('M', 'Eastern Conference Final','CF', 'FLA', 'Florida Panthers',    2, 'A2',  4, 'NYR', 'NY Rangers',           1, 'M1',  2),
]
