import type { AnyFunction } from 'lkree-common-utils/lib/ts';

import type { Cache } from './types';

export const storeCacher = <K, T extends AnyFunction>(fn: T): (() => T) => {
  const cache: Cache<K> = { callResult: null };

  return () => fn(cache);
};
