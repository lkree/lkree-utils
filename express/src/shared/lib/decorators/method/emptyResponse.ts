import type { RequestParamHandler } from 'express';
import { makeMethodDecorator } from 'lkree-common-utils/lib/decorators';
import { callIndependentlyAfter } from 'lkree-common-utils/lib/helpers';

export const emptyResponse = makeMethodDecorator<RequestParamHandler>(function (originalFn, ...rest) {
  return callIndependentlyAfter(originalFn.apply(this, rest), () => rest[1].status(204).send());
});
