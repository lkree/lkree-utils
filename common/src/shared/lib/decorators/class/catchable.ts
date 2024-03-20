import { handleError, noop } from '~/shared/lib/helpers';
import type { AnyFunction } from '~/shared/lib/ts';

import { makeClassDecorator } from '../makeDecorator';

export const catchable = (onNoMethodFound?: AnyFunction, onError: AnyFunction = noop) =>
  makeClassDecorator(ClassObject => {
    return function (...constructorArgs: ConstructorParameters<typeof ClassObject>) {
      const classInstance = <FunctionConstructor>new ClassObject(...constructorArgs);

      return new Proxy(classInstance, {
        get:
          (target, prop: keyof FunctionConstructor): AnyFunction =>
          (...rest) => {
            const fn = target[prop];

            if (fn !== undefined) return handleError(fn.bind(classInstance, ...rest), onError);

            onNoMethodFound?.();
          },
      });
    };
  });
