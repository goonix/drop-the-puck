import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '../api/standingsApi';
import type { TeamStanding } from '../types/standings';

function normalizeStandings(data: Awaited<ReturnType<typeof fetchStandings>>): TeamStanding[] {
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
}

export function useStandingsQuery() {
  const { data, isLoading, isError, error } = useQuery<TeamStanding[]>({
    queryKey: ['standings'],
    queryFn: async () => {
      const raw = await fetchStandings();
      return normalizeStandings(raw);
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    standings: data ?? [],
    isLoading,
    isError,
    error,
  };
}
