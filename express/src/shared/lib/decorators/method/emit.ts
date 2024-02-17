import type { RequestParamHandler } from 'express';
import { makeMethodDecorator } from 'lkree-node-utils/lib/decorators';

export const emit = (callback: RequestParamHandler) =>
  makeMethodDecorator<RequestParamHandler>(async function (originalFn, ...rest) {
    await originalFn.apply(this, rest);
    callback(...rest);
  });
