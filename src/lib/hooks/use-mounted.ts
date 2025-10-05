'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if the component has mounted.
 * This is useful for preventing hydration mismatches by ensuring
 * that client-side only logic runs after the component has mounted.
 *
 * @returns {boolean} - True if the component has mounted, false otherwise.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
