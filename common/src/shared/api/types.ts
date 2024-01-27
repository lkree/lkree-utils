import type { AnyFunction, Voidable } from '~/shared/lib/ts';

import type { ResultTypes } from './call';
import type { Methods, CallParamsWithoutMethod } from './methods';

export type CreateRequestResponseData<Request = any, Response = any> = { request: Request; response: Response };

export type ApiFunction<T extends CreateRequestResponseData> = (data: T['request']) => Promise<T['response']>;

export type DynamicUrlProps<Path> = Path extends (query: infer Q) => string
  ? Q extends Record<any, any>
    ? { urlProps: Q }
    : { urlProps?: never }
  : { urlProps?: never };

type TUrlParams<T> = T extends Record<string, any> ? { urlParams: T } : { urlParams?: never };

type Headers<T> = T extends Record<string, any> ? { headers: T } : { headers?: never };

type StringifyBody<T> = T extends boolean ? { stringifyBody: T } : { stringifyBody?: never };

type ResultType<T> = T extends ResultTypes ? { resultType: T } : { resultType?: never };

type TransformIn<T> = T extends AnyFunction ? { transformIn: T } : { transformIn?: never };

type TransformOut<T> = T extends AnyFunction ? { transformOut: T } : { transformOut?: never };

type RestOptions<T> = T extends Record<string, unknown> ? { options: T } : { options?: never };

export type GetValueFromPayloadOrTransformOut<Response, TransformOut> = TransformOut extends (
  ...props: Array<any>
) => infer S
  ? S
  : Response;

export type Cfg<M, Path, H, S, R, TI, TO, RO> = {
  method: M;
  url: Path;
} & Headers<H> &
  StringifyBody<S> &
  ResultType<R> &
  TransformIn<TI> &
  TransformOut<TO> &
  RestOptions<RO>;

export type TCfg<
  M,
  Path,
  Headers,
  Stringify,
  ResultType,
  UrlParams,
  Payload,
  Response,
  TransformIn,
  TransformOut,
  RestOptions
> = Cfg<M, Path, Headers, Stringify, ResultType, TransformIn, TransformOut, RestOptions> & {
  payload: Payload;
  response: Response;
} & TUrlParams<UrlParams>;

export type Client<M> = {
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
    infer Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TransformIn,
    infer TransformOut,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer RestOptions
  >
    ? (
        args: { payload: Payload } & TUrlParams<UrlParams> & DynamicUrlProps<Path>
      ) => Promise<GetValueFromPayloadOrTransformOut<Response, TransformOut>>
    : never;
};

export type ClientSettings<M> = {
  [K in keyof M]: M[K] extends Cfg<
    infer Method,
    infer Path,
    infer Headers,
    infer StringifyBody,
    infer ResultType,
    infer TransformIn,
    infer Payload,
    infer RestOptions
  >
    ? Cfg<Method, Path, Headers, StringifyBody, ResultType, TransformIn, Payload, RestOptions>
    : never;
};

export type AnyTCfg = TCfg<
  Methods,
  string | AnyFunction,
  Record<string, any>,
  boolean,
  Voidable<ResultTypes>,
  any,
  any,
  any,
  Voidable<AnyFunction>,
  Voidable<AnyFunction>,
  Voidable<Omit<CallParamsWithoutMethod<Methods>['options'], 'method' | 'headers' | 'body' | 'stringifyBody'>>
>;

export type CreateClientSettings<T extends Record<string, AnyTCfg>> = T;

export type ExecuteClientSettings<T> = T extends CreateClientSettings<infer R> ? R : never;
