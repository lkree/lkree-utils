import { useLayoutEffect, useRef } from 'react';

import type { Noop, Nullable } from 'lkree-common-utils/ts';

import { useTimeoutQueue } from './useTimeoutQueue';

export const useCallbackQueue = <T extends Noop = Noop>(updateTime: number) => {
  const invokingCallback = useRef<Nullable<T>>(null);
  const queue = useTimeoutQueue<T>(updateTime);

  useLayoutEffect(() => {
    const currentCallback = queue.get();

    if (currentCallback && currentCallback !== invokingCallback.current) {
      invokingCallback.current = currentCallback;
      invokingCallback.current();
    }
  }, [queue]);

  return queue;
};
