import { useEffect, useLayoutEffect, useRef } from 'react'

export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled: boolean,
) {
  const savedCallback = useRef(callback)
  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (!enabled) return

    const tick = () => savedCallback.current()

    const id = setInterval(tick, intervalMs)

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(id)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [enabled, intervalMs])
}
