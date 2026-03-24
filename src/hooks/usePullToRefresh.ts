import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(
  scrollRef: React.RefObject<HTMLElement | null>,
  onRefresh: () => void,
  enabled = true,
) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const threshold = 60;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0) {
        startYRef.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        setPullDistance(Math.min(delta, threshold * 1.5));
      }
    };

    const onTouchEnd = () => {
      if (pullDistance >= threshold) {
        onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [scrollRef, isPulling, pullDistance, onRefresh, enabled, threshold]);

  return { isPulling, pullDistance, threshold };
}
