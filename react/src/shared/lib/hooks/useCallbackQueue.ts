import type { Noop } from 'lkree-common-utils/ts';

import { Queue } from '~/shared/lib/hooks/useQueue';

import { useTimeoutQueue } from './useTimeoutQueue';

export const useCallbackQueue = <T extends Noop = Noop>(updateTime: number) => {
  const queue: Queue<T> = useTimeoutQueue<T>(updateTime, () => queue.get()?.());

  return queue;
};
