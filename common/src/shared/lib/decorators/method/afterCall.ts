import { makeMethodDecorator } from 'lkree-node-utils/lib/decorators';

import { callIndependentlyAfter } from '~/shared/lib/helpers';
import type { AnyFunction } from '~/shared/lib/ts';

export const afterCall = <T extends AnyFunction>(callback: T) =>
  makeMethodDecorator<T>(function (originalFn, ...rest) {
    const result = originalFn.apply(this, rest);

    return callIndependentlyAfter(
      result,
      callIndependentlyAfter(callback(...rest), () => result)
    );
  });
