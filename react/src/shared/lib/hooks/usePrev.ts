import { useEffect, useRef } from 'react';

export const usePrev = <T>(value: T) => {
  const prevValue = useRef<T>();

  useEffect(() => {
    if (value !== prevValue.current) prevValue.current = value;
  }, [value]);

  return prevValue;
};
