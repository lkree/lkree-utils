import { isObject } from 'lkree-common-utils/lib/helpers';

import { FULL_VALUE } from './const';
import { AssertObject, OnNoDataPassedCallback } from './types';

export function assert(
  onNoDataPassed: OnNoDataPassedCallback,
  assertObject: AssertObject<any>,
  data: unknown
): asserts data is { [key in keyof typeof assertObject]: unknown } {
  if (!isObject(data)) onNoDataPassed(data);

  Object.entries(assertObject).forEach(([property, typeGuard]) =>
    typeGuard(property === FULL_VALUE ? data : data[property])
  );
}
