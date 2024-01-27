import { isString } from '~/shared/lib/helpers';
import { AnyFunction } from '~/shared/lib/ts';

import { BuiltInHeaders, ResultTypes } from './call';
import { Methods, method } from './methods';

export type CreateRequestResponseData<Request = any, Response = any> = { request: Request; response: Response };

export type ApiFunction<T extends CreateRequestResponseData> = (data: T['request']) => Promise<T['response']>;

type DynamicUrlProps<Path> = Path extends (query: infer Q) => string
  ? Q extends Record<any, any>
    ? { urlProps: Q }
    : { urlProps?: never }
  : { urlProps?: never };

type TUrlParams<T> = T extends Record<string, any> ? { urlParams: T } : { urlParams?: never };

type Headers<T> = T extends Record<string, any> ? { headers: T } : { headers?: never };

type StringifyBody<T> = T extends boolean ? { stringifyBody: T } : { stringifyBody?: never };

type ResultType<T> = T extends ResultTypes ? { resultType: T } : { resultType?: never };

export type Cfg<M, Path, H, S, R> = {
  method: M;
  url: Path;
} & Headers<H> &
  StringifyBody<S> &
  ResultType<R>;

type TCfg<M, Path, Headers, Stringify, ResultType, UrlParams, Payload, Response> = Cfg<
  M,
  Path,
  Headers,
  Stringify,
  ResultType
> & {
  payload: Payload;
  response: Response;
} & TUrlParams<UrlParams>;

type Client<M> = {
  [K in keyof M]: M[K] extends TCfg<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer Method,
    infer Path,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer Headers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer StringifyBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer ResultType,
    infer UrlParams,
    infer Payload,
    infer Response
  >
    ? (args: { payload: Payload } & TUrlParams<UrlParams> & DynamicUrlProps<Path>) => Promise<Response>
    : never;
};

const createMethod =
  <M, Path, Headers, StringifyBody, ResultType, UrlParams, Payload, Response>(
    cfg: TCfg<M, Path, Headers, StringifyBody, ResultType, UrlParams, Payload, Response>
  ): ((args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path>) => Promise<Response>) =>
  (args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path>) =>
    method({
      options: {
        body: args.payload,
        headers: cfg.headers,
        method: cfg.method as Methods,
        stringifyBody: cfg.stringifyBody,
      },
      resultType: cfg.resultType,
      url: isString(cfg.url) ? cfg.url : (cfg.url as AnyFunction)(args.urlProps),
    });

type ClientSettings<M> = {
  [K in keyof M]: M[K] extends Cfg<infer Method, infer UrlParams, infer Headers, infer StringifyBody, infer ResultType>
    ? Cfg<Method, UrlParams, Headers, StringifyBody, ResultType>
    : never;
};

type CreateClientSettings<
  T extends Record<string, TCfg<Methods, string | AnyFunction, any, any, ResultTypes, any, any, any>>
> = T;

type ExecuteClientSettings<T> = T extends CreateClientSettings<infer R> ? R : never;

const createClient = <A, B = ExecuteClientSettings<A>>(clients: ClientSettings<B>): Client<B> => {
  const result = {} as Client<B>;

  Object.keys(clients).forEach(key => {
    // @ts-expect-error
    result[key as keyof A] = createMethod(clients[key as keyof A]);
  });

  return result;
};

type TT = CreateClientSettings<{
  a: {
    method: Methods.Get;
    url: (a: { a: 5 }) => 'asd';
    payload: { a: 5 };
    response: 123;
    urlParams: { a: 10 };
    headers: { builtIn: [BuiltInHeaders.JSON] };
    stringifyBody: true;
    resultType: ResultTypes.JSON;
  };
}>;

const test = createClient<TT>({
  a: {
    headers: { builtIn: [BuiltInHeaders.JSON] },
    method: Methods.Get,
    resultType: ResultTypes.JSON,
    stringifyBody: true,
    url: ({ a }) => 'asd',
  },
});

void test.a({ payload: { a: 5 }, urlParams: { a: 10 }, urlProps: { a: 5 } }).then(d => {
  console.log(d);
});
