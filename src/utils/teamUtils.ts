export function getTeamLogoUrl(abbrev: string, dark = false): string {
  const variant = dark ? 'dark' : 'light'
  return `https://assets.nhle.com/logos/nhl/svg/${abbrev}_${variant}.svg`
}

// Primary team colors keyed by abbreviation
export const TEAM_COLORS: Record<string, string> = {
  ANA: '#F47A38',
  BOS: '#FFB81C',
  BUF: '#003087',
  CAR: '#CC0000',
  CBJ: '#002654',
  CGY: '#C8102E',
  CHI: '#CF0A2C',
  COL: '#6F263D',
  DAL: '#006847',
  DET: '#CE1126',
  EDM: '#FF4C00',
  FLA: '#041E42',
  LAK: '#111111',
  MIN: '#154734',
  MTL: '#AF1E2D',
  NJD: '#CE1126',
  NSH: '#FFB81C',
  NYI: '#00539B',
  NYR: '#0038A8',
  OTT: '#E31837',
  PHI: '#F74902',
  PIT: '#FCB514',
  SEA: '#001628',
  SJS: '#006D75',
  STL: '#002F87',
  TBL: '#002868',
  TOR: '#003E7E',
  UTA: '#69B3E7',
  VAN: '#00843D',
  VGK: '#B4975A',
  WPG: '#041E42',
  WSH: '#041E42',
}

export function getTeamColor(abbrev: string): string {
  return TEAM_COLORS[abbrev] ?? '#6B7280'
}

export const TEAM_NAMES: Record<string, string> = {
  ANA: 'Anaheim Ducks',
  BOS: 'Boston Bruins',
  BUF: 'Buffalo Sabres',
  CAR: 'Carolina Hurricanes',
  CBJ: 'Columbus Blue Jackets',
  CGY: 'Calgary Flames',
  CHI: 'Chicago Blackhawks',
  COL: 'Colorado Avalanche',
  DAL: 'Dallas Stars',
  DET: 'Detroit Red Wings',
  EDM: 'Edmonton Oilers',
  FLA: 'Florida Panthers',
  LAK: 'Los Angeles Kings',
  MIN: 'Minnesota Wild',
  MTL: 'Montreal Canadiens',
  NJD: 'New Jersey Devils',
  NSH: 'Nashville Predators',
  NYI: 'New York Islanders',
  NYR: 'New York Rangers',
  OTT: 'Ottawa Senators',
  PHI: 'Philadelphia Flyers',
  PIT: 'Pittsburgh Penguins',
  SEA: 'Seattle Kraken',
  SJS: 'San Jose Sharks',
  STL: 'St. Louis Blues',
  TBL: 'Tampa Bay Lightning',
  TOR: 'Toronto Maple Leafs',
  UTA: 'Utah Hockey Club',
  VAN: 'Vancouver Canucks',
  VGK: 'Vegas Golden Knights',
  WPG: 'Winnipeg Jets',
  WSH: 'Washington Capitals',
}

export function getTeamFullName(abbrev: string): string {
  return TEAM_NAMES[abbrev] ?? abbrev
}

export const ALL_TEAMS = Object.keys(TEAM_NAMES).sort()
