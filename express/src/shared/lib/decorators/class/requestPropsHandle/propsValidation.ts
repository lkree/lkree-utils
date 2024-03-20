import { isObject } from 'lkree-common-utils/lib/helpers';

import { FULL_VALUE } from './const';
import type { OnNoDataPassedCallback, ValidationObject } from './types';

export function propsValidation(
  onNoDataPassed: OnNoDataPassedCallback,
  onInvalidData: (property: string, data: unknown) => void,
  assertObject: ValidationObject<any>,
  data: unknown
): asserts data is { [key in keyof typeof assertObject]: unknown } {
  if (!isObject(data)) onNoDataPassed(data);

  Object.entries(assertObject).forEach(({ 0: property, 1: typeGuard }) => {
    const dataToCheck = property === FULL_VALUE ? data : data[property];

    if (!typeGuard(dataToCheck)) onInvalidData(property, dataToCheck);
  });
}
