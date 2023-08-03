import { useLayoutEffect, useRef } from 'react';

export const useLatest = <T>(v: T) => {
  const valueRef = useRef(v);

  useLayoutEffect(() => {
    valueRef.current = v;
  });

  return valueRef;
};
