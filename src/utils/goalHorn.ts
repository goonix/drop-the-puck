/**
 * Plays the goal horn for a given team abbreviation.
 * Looks for /sounds/horns/{ABBREV}.mp3, falls back to /sounds/horns/default.mp3.
 *
 * Drop audio files into /public/sounds/horns/ — e.g.:
 *   /public/sounds/horns/TOR.mp3
 *   /public/sounds/horns/DAL.mp3
 *   /public/sounds/horns/default.mp3  ← required fallback
 */
export function playGoalHorn(abbrev: string): void {
  const teamSrc = `/sounds/horns/${abbrev}.mp3`
  const defaultSrc = `/sounds/horns/default.mp3`

  const audio = new Audio(teamSrc)

  audio.onerror = () => {
    const fallback = new Audio(defaultSrc)
    fallback.play().catch(() => {
      // Browser blocked autoplay or default file missing — silently ignore
    })
  }

  audio.play().catch(() => {
    // Browser blocked autoplay — silently ignore
  })
}
