import { useLayoutEffect, RefObject } from 'react';

export const useFieldFocus = (elementRef: RefObject<HTMLInputElement>, show: boolean) => {
  useLayoutEffect(() => {
    if (show) elementRef.current?.focus();
  }, [show]);
};
