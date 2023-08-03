import { useCallback, useLayoutEffect, useRef } from 'react';

export const useEvent = <T extends (...props: Array<any>) => any>(fn: T) => {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback((...args: Array<any>) => fnRef.current.apply(null, args), [fnRef]) as T;
};
