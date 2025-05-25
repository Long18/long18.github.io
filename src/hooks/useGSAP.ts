import { useEffect, useLayoutEffect } from 'react';

/**
 * useIsomorphicLayoutEffect hook
 * Prevents SSR hydration mismatches by using useEffect on server and useLayoutEffect on client
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * GSAP-safe effect hook that only runs on client-side
 * @param effect - Effect function that contains GSAP animations
 * @param deps - Dependencies array
 */
export const useGSAP = (effect: () => void | (() => void), deps?: React.DependencyList) => {
  useIsomorphicLayoutEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const cleanup = effect();
    
    // Return cleanup function if provided
    return cleanup;
  }, deps);
};
