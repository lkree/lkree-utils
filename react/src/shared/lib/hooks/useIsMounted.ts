import { useLayoutEffect, useState } from 'react';

export const useIsMounted = () => {
  const { 0: isMounted, 1: setIsMounted } = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  return isMounted;
};
