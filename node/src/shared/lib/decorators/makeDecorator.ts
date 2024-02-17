import type { AnyFunction } from 'lkree-common-utils/ts';

type DecoratorMethodCallback<T extends AnyFunction> = (
  this: any,
  originalFn: T,
  ...rest: Parameters<T>
) => Promise<unknown>;

type DecoratorClassCallback<T extends FunctionConstructor> = (constructor: T) => any;

export const defaultDecorator = function (this: any, originalFn: AnyFunction, ...props: Parameters<AnyFunction>) {
  return originalFn.apply(this, props);
};

export const makeMethodDecorator = <T extends AnyFunction>(
  decoratorCallback: DecoratorMethodCallback<T>,
  beforeDecoratorCreate?: (methodName: string) => any
) => {
  return (_: any, _methodName: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) return;

    beforeDecoratorCreate?.(_methodName);

    const originalFunction: T = descriptor.value;

    descriptor.value = async function (this: any, ...reqProps: Parameters<T>) {
      return await decoratorCallback.call(this, originalFunction, ...reqProps);
    };
  };
};

export const makeClassDecorator = <T extends FunctionConstructor>(
  decoratorCallback: DecoratorClassCallback<T>
): any => {
  return (classConstructor: T) => {
    if (!classConstructor) return;

    return decoratorCallback(classConstructor);
  };
};
