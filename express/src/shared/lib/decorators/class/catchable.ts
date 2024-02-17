import type { RequestParamHandler } from 'express-serve-static-core';
import { AnyFunction } from 'lkree-common-utils/ts';
import { makeClassDecorator } from 'lkree-node-utils/lib/decorators';

export const catchable = (onNoMethodFound?: AnyFunction) =>
  makeClassDecorator(ClassObject => {
    return function (...constructorArgs: ConstructorParameters<typeof ClassObject>) {
      const classInstance = <FunctionConstructor>new ClassObject(...constructorArgs);

      return new Proxy(classInstance, {
        get:
          (target, prop: keyof FunctionConstructor): RequestParamHandler =>
          async (req, res, next, ...rest) => {
            try {
              const fn = target[prop];

              if (fn !== undefined) return await fn.call(classInstance, req, res, next, ...rest);

              onNoMethodFound?.();
            } catch (e) {
              if (next && typeof next === 'function') next(e);
              // eslint-disable-next-line no-console
              else console.log(e);
            }
          },
      });
    };
  });
