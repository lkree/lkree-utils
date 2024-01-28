import type { AnyFunction, Voidable } from '~/shared/lib/ts';

import type { ResultTypes } from './call';
import type { Methods, CallParamsWithoutMethod } from './methods';

export type CreateRequestResponseData<Request = any, Response = any> = { request: Request; response: Response };

export type ApiFunction<T extends CreateRequestResponseData> = (data: T['request']) => Promise<T['response']>;

type ExtractNonNullableValue<Value, Fallback = never, Result = Value> = Value extends NonNullable<unknown>
  ? Result
  : Fallback;

export type DynamicUrlProps<Path> = Path extends (query: infer Q) => string
  ? Q extends Record<any, any>
    ? { urlProps: Q }
    : { urlProps?: never }
  : { urlProps?: never };

export type ExtractPathPropsNeed<T> = DynamicUrlProps<T> extends { urlProps: infer S }
  ? ExtractNonNullableValue<S>
  : void;

type TUrlParams<T> = ExtractNonNullableValue<T, { urlParams?: never }, { urlParams: T }>;

type CustomHeaders<T> = T extends Record<string, any> ? { headers: T } : { headers?: never };

type StringifyBody<T> = ExtractNonNullableValue<T, { stringifyBody?: never }, { stringifyBody: T }>;

type ResultType<T> = T extends ResultTypes ? { resultType: T } : { resultType?: never };

type TransformIn<T> = T extends AnyFunction ? { transformIn: T } : { transformIn?: never };

type TransformOut<T> = T extends AnyFunction ? { transformOut: T } : { transformOut?: never };

type RestOptions<T> = T extends NonNullable<unknown> ? { options: T } : { options?: never };

export type GetValueFromPayloadOrTransformOut<Response, TransformOut> = TransformOut extends (
  ...props: Array<any>
) => infer S
  ? S
  : ExtractNonNullableValue<Response, undefined>;

export type Cfg<M, Path, H, S, R, TI, TO, RO> = {
  method: M;
  url: Path;
} & CustomHeaders<H> &
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
  TransformIn,
  TransformOut,
  RestOptions,
  UrlParams,
  Payload = void,
  Response = void
> = Cfg<M, Path, Headers, Stringify, ResultType, TransformIn, TransformOut, RestOptions> & {
  payload?: Payload;
  response?: Response;
} & TUrlParams<UrlParams>;

type ArgsChecker<Payload, UrlParams, Path> = Payload extends NonNullable<unknown>
  ? true
  : UrlParams extends NonNullable<unknown>
  ? true
  : Path extends NonNullable<unknown>
  ? true
  : false;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TransformIn,
    infer TransformOut,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer RestOptions,
    infer UrlParams,
    infer Payload,
    infer Response
  >
    ? ArgsChecker<Payload, UrlParams, ExtractPathPropsNeed<Path>> extends true
      ? (
          args: ExtractNonNullableValue<Payload, { payload?: never }, { payload: Payload }> &
            TUrlParams<UrlParams> &
            DynamicUrlProps<Path>
        ) => Promise<GetValueFromPayloadOrTransformOut<Response, TransformOut>>
      : (args?: never) => Promise<GetValueFromPayloadOrTransformOut<Response, TransformOut>>
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
    infer TransformOut,
    infer RestOptions
  >
    ? Cfg<Method, Path, Headers, StringifyBody, ResultType, TransformIn, TransformOut, RestOptions>
    : never;
};

export type AnyTCfg = TCfg<
  Methods,
  string | AnyFunction,
  Voidable<Record<string, any>>,
  Voidable<boolean>,
  Voidable<ResultTypes>,
  Voidable<AnyFunction>,
  Voidable<AnyFunction>,
  Voidable<Omit<CallParamsWithoutMethod<Methods>['options'], 'method' | 'headers' | 'body' | 'stringifyBody'>>,
  Voidable<Record<string, any>>,
  Voidable<any>,
  Voidable<any>
>;

export type CreateClientSettings<T extends Record<string, AnyTCfg>> = T;

export type ExecuteClientSettings<T> = T extends CreateClientSettings<infer R> ? R : never;
