import { useMemo, useState } from 'react';

export const useGroupReady = (groupLength: number) => {
  const [readyCount, setReadyCount] = useState(0);

  return useMemo(
    () => ({
      isGroupReady: readyCount === groupLength,
      onReady: (payload: unknown) => {
        setReadyCount(state => (payload ? state + 1 : state));
      },
    }),
    [readyCount === groupLength]
  );
};
