import type { RequestParamHandler } from 'express';
import { makeMethodDecorator } from 'lkree-node-utils/lib/decorators';

export const positiveResponse = makeMethodDecorator<RequestParamHandler>(async function (originalFn, ...rest) {
  await originalFn.apply(this, rest);
  rest[1].send(true);
});
