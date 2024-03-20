import { Router } from 'express';
import { defaultDecorator, makeClassDecorator, makeMethodDecorator } from 'lkree-common-utils/lib/decorators';
import { computePathWithDomain } from 'lkree-node-utils/api';

export const API_DOMAIN = 'api';

enum Methods {
  Get = 'get',
  Put = 'put',
  Post = 'post',
  Delete = 'delete',
}

type MethodSettings = { methodName: string; method: Methods };

const createRouters = () => {
  const routers = Router();

  return () => routers;
};

export const getRouters = createRouters();

const applyMethodToRouter = (
  router: Router,
  // eslint-disable-next-line @typescript-eslint/ban-types
  classInstance: Function,
  methodSettings: MethodSettings,
  domainName: string
) => {
  router[methodSettings.method](
    computePathWithDomain(domainName)(methodSettings.methodName),
    classInstance[methodSettings.methodName as keyof typeof classInstance]
  );
};

const names = [] as Array<MethodSettings>;

export const get = makeMethodDecorator(defaultDecorator, methodName => names.push({ method: Methods.Get, methodName }));

export const post = makeMethodDecorator(defaultDecorator, methodName =>
  names.push({ method: Methods.Post, methodName })
);

export const put = makeMethodDecorator(defaultDecorator, methodName => names.push({ method: Methods.Put, methodName }));

export const del = makeMethodDecorator(defaultDecorator, methodName =>
  names.push({ method: Methods.Delete, methodName })
);

export const withRouter = ({ domainName = API_DOMAIN, routerPath }: { domainName?: string; routerPath: string }) => {
  const router = Router();

  return makeClassDecorator(ClassObject => {
    return function (this: typeof ClassObject, ...constructorArgs: ConstructorParameters<typeof ClassObject>) {
      const classInstance = new ClassObject(...constructorArgs);

      names.forEach(methodSettings => applyMethodToRouter(router, classInstance, methodSettings, routerPath));

      names.length = 0;

      getRouters().use(`/${domainName}`, router);

      return classInstance;
    };
  });
};
