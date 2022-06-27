import { useEffect } from 'react';

export function useDebouncedEffect(fn: { (): void; (...args: any[]): void; }, deps: any[], time: number) {
  const dependencies = [...deps, fn, time];
  useEffect(() => {
    const timeout = setTimeout(fn, time);
    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);
}
