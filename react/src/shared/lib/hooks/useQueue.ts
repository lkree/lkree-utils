import { useMemo, useState } from 'react';

import type { Voidable } from 'lkree-common-utils/lib/ts';

export interface Queue<T> {
  get: () => Voidable<T>;
  isEmpty: () => boolean;
  length: () => number;
  push: (item: T) => void;
  shift: () => void;
}

export const useQueue = <T>(): Queue<T> => {
  const { 0: queue, 1: setQueue } = useState<Array<T>>([]);

  return useMemo(
    () => ({
      get: () => queue[0],
      isEmpty: () => !queue.length,
      length: () => queue.length,
      push: (item: T) => setQueue(queue => [...queue, item]),
      shift: () =>
        setQueue(queue => {
          if (!queue.length) return queue;

          queue.shift();

          return [...queue];
        }),
    }),
    [queue]
  );
};
