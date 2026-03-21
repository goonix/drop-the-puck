import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadBracket } from '../store/slices/bracketSlice'

export function useBracket() {
  const dispatch = useAppDispatch()
  const data = useAppSelector(s => s.bracket.data)
  const status = useAppSelector(s => s.bracket.status)
  const error = useAppSelector(s => s.bracket.error)

  useEffect(() => {
    if (status === 'idle') {
      const year = new Date().getFullYear()
      dispatch(loadBracket(year))
    }
  }, [status, dispatch])

  return { data, status, error }
}
