import { useEffect, useState } from 'react';

import { useIsMounted } from './useIsMounted';

export const useShow = (showTime: number, ...dependencies: Array<unknown>) => {
  const [show, setShow] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    setShow(true);

    const id = setTimeout(() => {
      setShow(false);
    }, showTime);

    return () => id && clearTimeout(id);
  }, dependencies);

  return show;
};
