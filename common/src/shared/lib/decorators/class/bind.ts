import { makeClassDecorator } from '../makeDecorator';

export const bind = makeClassDecorator(ClassObject => {
  return function (...constructorArgs: ConstructorParameters<typeof ClassObject>) {
    const classInstance = <FunctionConstructor>new ClassObject(...constructorArgs);

    return new Proxy(classInstance, {
      get:
        (target, prop: keyof FunctionConstructor) =>
        (...rest: Array<unknown>) =>
          target[prop].apply(classInstance, rest),
    });
  };
});
