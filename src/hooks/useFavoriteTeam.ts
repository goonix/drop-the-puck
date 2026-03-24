import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavoriteTeam, setFavoriteTeams } from '../store/slices/uiSlice';

export function useFavoriteTeams() {
  const dispatch = useAppDispatch();
  const favoriteTeamAbbrevs = useAppSelector((s) => s.ui.favoriteTeamAbbrevs);

  const isFavorite = (abbrev: string) => favoriteTeamAbbrevs.includes(abbrev);
  const toggle = (abbrev: string) => dispatch(toggleFavoriteTeam(abbrev));
  const setAll = (abbrevs: string[]) => dispatch(setFavoriteTeams(abbrevs));

  return { favoriteTeamAbbrevs, isFavorite, toggle, setAll };
}
