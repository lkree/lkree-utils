import { useLayoutEffect } from 'react';

import { useIsMounted } from './useIsMounted';
import { useShow } from './useShow';

export const useTimeoutedShow = (showTime: number, ...dependencies: Array<unknown>) => {
  const { hide, isShow, show } = useShow();

  const isMounted = useIsMounted();

  useLayoutEffect(() => {
    if (!isMounted) return;

    show();

    const id = setTimeout(hide, showTime);

    return () => id && clearTimeout(id);
  }, dependencies);

  return isShow;
};
