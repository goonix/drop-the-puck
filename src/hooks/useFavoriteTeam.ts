import { useAtom } from 'jotai';
import { favoriteTeamAbbrevsAtom } from '../store/atoms';

export function useFavoriteTeams() {
  const [favoriteTeamAbbrevs, setFavoriteTeamAbbrevs] = useAtom(favoriteTeamAbbrevsAtom);

  const isFavorite = (abbrev: string) => favoriteTeamAbbrevs.includes(abbrev);

  const toggle = (abbrev: string) => {
    setFavoriteTeamAbbrevs((prev) => {
      const idx = prev.indexOf(abbrev);
      if (idx >= 0) {
        return prev.filter((_, i) => i !== idx);
      } else {
        return [...prev, abbrev];
      }
    });
  };

  const setAll = (abbrevs: string[]) => setFavoriteTeamAbbrevs(abbrevs);

  return { favoriteTeamAbbrevs, isFavorite, toggle, setAll };
}
