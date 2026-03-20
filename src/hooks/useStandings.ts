import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadStandings } from '../store/slices/standingsSlice'

export function useStandings() {
  const dispatch = useAppDispatch()
  const standings = useAppSelector(s => s.standings.standings)
  const status = useAppSelector(s => s.standings.status)
  const error = useAppSelector(s => s.standings.error)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadStandings())
    }
  }, [status, dispatch])

  return { standings, status, error }
}
