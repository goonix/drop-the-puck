import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadSchedule } from '../store/slices/scheduleSlice'
import { usePolling } from './usePolling'

export function useSchedule(date: string) {
  const dispatch = useAppDispatch()
  const games = useAppSelector(s => s.schedule.gamesByDate[date] ?? [])
  const status = useAppSelector(s => s.schedule.loadingDates[date] ?? 'idle')
  const error = useAppSelector(s => s.schedule.errorDates[date])
  const hasLiveGames = useAppSelector(s => s.schedule.hasLiveGames)

  useEffect(() => {
    dispatch(loadSchedule(date))
  }, [date, dispatch])

  usePolling(
    () => { dispatch(loadSchedule(date)) },
    30000,
    hasLiveGames,
  )

  return { games, status, error, hasLiveGames }
}
