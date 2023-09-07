import { useMemo, useState } from 'react';

import type { Voidable } from 'lkree-common-utils/ts';

export interface Queue<T> {
  get: () => Voidable<T>;
  isEmpty: () => boolean;
  length: () => number;
  push: (item: T) => void;
  shift: () => void;
}

export const useQueue = <T>(): Queue<T> => {
  const [queue, setQueue] = useState<Array<T>>([]);

  return useMemo(
    () => ({
      get: () => queue[0],
      isEmpty: () => !queue.length,
      length: () => queue.length,
      push: (item: T) => setQueue(queue => [...queue, item]),
      shift: () =>
        setQueue(queue => {
          queue.shift();

          return [...queue];
        }),
    }),
    [queue]
  );
};