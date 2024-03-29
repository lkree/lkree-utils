import { useLayoutEffect, useRef } from 'react';

import { noop } from 'lkree-common-utils/lib/helpers';
import type { AnyFunction } from 'lkree-common-utils/lib/ts';

import { useLatest } from './useLatest';
import { Queue, useQueue } from './useQueue';

export const useTimeoutQueue = <T>(
  updateTime: number,
  onEffect: AnyFunction = noop,
  onTimeout: AnyFunction = noop
): Queue<T> => {
  const onEffectRef = useLatest(onEffect);
  const onTimeoutRef = useLatest(onTimeout);
  const isShowing = useRef(false);
  const queue = useQueue<T>();

  useLayoutEffect(() => {
    if (isShowing.current || queue.isEmpty()) return;

    isShowing.current = true;

    onEffectRef.current();

    setTimeout(() => {
      onTimeoutRef.current();
      queue.shift();

      isShowing.current = false;
    }, updateTime);
  }, [queue]);

  return queue;
};
