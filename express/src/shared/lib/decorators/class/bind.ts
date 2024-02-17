import type { RequestParamHandler } from 'express-serve-static-core';
import { makeClassDecorator } from 'lkree-node-utils/lib/decorators';

export const bind = makeClassDecorator(ClassObject => {
  return function (...constructorArgs: ConstructorParameters<typeof ClassObject>) {
    const classInstance = <FunctionConstructor>new ClassObject(...constructorArgs);

    return new Proxy(classInstance, {
      get:
        (target, prop: keyof FunctionConstructor): RequestParamHandler =>
        (req, res, next, ...rest) =>
          target[prop].call(classInstance, req, res, next, ...rest),
    });
  };
});
