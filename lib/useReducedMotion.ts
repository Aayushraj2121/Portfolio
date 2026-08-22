'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`, including later changes to the OS setting.
 *
 * Starts `false` so the server-rendered markup matches the first client render;
 * the effect corrects it before paint for users who do prefer reduced motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
