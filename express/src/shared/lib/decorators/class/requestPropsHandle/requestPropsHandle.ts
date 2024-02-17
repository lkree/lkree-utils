import type { RequestParamHandler } from 'express';
import { isObject } from 'lkree-common-utils/helpers';
import { makeMethodDecorator } from 'lkree-node-utils/lib/decorators';

import { assert } from './asserts';
import { RequestDataFields, DEFAULT_FIELD_TO_DATA_EXECUTE } from './const';
import { propsValidation } from './propsValidation';
import type { Cookies, OnInvalidData, OnNoDataPassedCallback, Settings } from './types';

export const requestPropsHandle =
  (onNoDataPassed: OnNoDataPassedCallback, onInvalidData: OnInvalidData) =>
  <T, K extends RequestDataFields = RequestDataFields.Body, C = Cookies>(settings: Settings<T, K, C>) =>
    makeMethodDecorator<RequestParamHandler>(async function (originalFn, req, res, next, ...rest) {
      if (settings.validate) {
        settings.validate.forEach(({ fieldToExecuteData = DEFAULT_FIELD_TO_DATA_EXECUTE, validationObject }) =>
          propsValidation(onNoDataPassed, onInvalidData, validationObject, req[fieldToExecuteData as never])
        );
      }

      if (settings.assert) {
        settings.assert.forEach(({ assertObject, fieldToExecuteData = DEFAULT_FIELD_TO_DATA_EXECUTE }) =>
          assert(onNoDataPassed, assertObject, req[fieldToExecuteData as never])
        );
      }

      if (settings.transform) {
        if (settings.transform.in) req.body = settings.transform.in(req.body);

        if (settings.transform.out) {
          const resJsonFn = res.json;

          res.json = function (data: unknown) {
            return resJsonFn.call(this, isObject(data) && data.errors ? data : settings.transform!.out!(data));
          };
        }
      }

      return await originalFn.call(this, req, res, next, ...rest);
    });
