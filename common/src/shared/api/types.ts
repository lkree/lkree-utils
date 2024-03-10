import type { AnyFunction, Voidable } from '~/shared/lib/ts';

import type { ResultTypes } from './call';
import type { Methods, CallParamsWithoutMethod } from './methods';

export type CreateRequestResponseData<Request = any, Response = any> = { request: Request; response: Response };

export type ApiFunction<T extends CreateRequestResponseData> = (data: T['request']) => Promise<T['response']>;

type ExtractNonNullableValue<Value, DataToCompare = unknown, Fallback = never, Result = Value> =
  Value extends NonNullable<DataToCompare> ? Result : Fallback;

export type DynamicUrlProps<Path> = Path extends (query: infer Q) => string
  ? Q extends Record<any, any>
    ? { urlProps: Q }
    : { urlProps?: never }
  : { urlProps?: never };

export type ExtractPathPropsNeed<T> =
  DynamicUrlProps<T> extends { urlProps: infer S } ? ExtractNonNullableValue<S> : void;

type TUrlParams<T> = ExtractNonNullableValue<T, unknown, { urlParams?: never }, { urlParams: T }>;

type CustomHeaders<T> = T extends Record<string, any> | (() => Record<string, string>)
  ? { headers: T }
  : { headers?: never };

type StringifyBody<T> = ExtractNonNullableValue<T, boolean, { stringifyBody?: never }, { stringifyBody: T }>;

type ResultType<T> = T extends NonNullable<ResultTypes> ? { resultType: T } : { resultType?: never };

type TransformIn<T> = T extends NonNullable<AnyFunction> ? { transformIn: T } : { transformIn?: never };

type TransformOut<T> = T extends NonNullable<AnyFunction> ? { transformOut: T } : { transformOut?: never };

type RequestMethod<T> = T extends Methods ? { method: T } : { method?: never };

export type GetValueFromPayloadOrTransformIn<Response, TransformIn> = TransformIn extends (
  ...props: Array<any>
) => infer S
  ? S
  : ExtractNonNullableValue<Response>;

export type RequestOptions = {
  method?: Methods;
  headers?: Record<string, string> | (() => Record<string, string>);
  transformOut?: AnyFunction;
} & Omit<CallParamsWithoutMethod<Methods>['options'], 'method' | 'headers' | 'body' | 'stringifyBody'>;

export type ResponseOptions = {
  resultType?: ResultTypes;
  stringifyBody?: boolean;
  transformIn?: AnyFunction;
};

export type Cfg<M, Path, H, S, R, TI, TO> = {
  url: Path;
} & ExtractNonNullableValue<
  S,
  boolean,
  ExtractNonNullableValue<
    R & TI,
    unknown,
    { responseOptions?: never },
    { responseOptions: ResultType<R> & StringifyBody<S> & TransformIn<TI> }
  >,
  { responseOptions: ResultType<R> & StringifyBody<S> & TransformIn<TI> }
> &
  ExtractNonNullableValue<
    M & H & TO,
    unknown,
    {
      requestOptions?: Omit<
        CallParamsWithoutMethod<Methods>['options'],
        'method' | 'headers' | 'body' | 'stringifyBody'
      >;
    },
    {
      requestOptions: Omit<
        CallParamsWithoutMethod<Methods>['options'],
        'method' | 'headers' | 'body' | 'stringifyBody'
      > &
        RequestMethod<M> &
        CustomHeaders<H> &
        TransformOut<TO>;
    }
  >;

export type TCfg<
  M,
  Path,
  Headers,
  Stringify,
  ResultType,
  TransformIn,
  TransformOut,
  UrlParams,
  Payload = void,
  Response = void,
> = Cfg<M, Path, Headers, Stringify, ResultType, TransformIn, TransformOut> & {
  payload?: Payload;
  response?: Response;
} & TUrlParams<UrlParams>;

type ArgsChecker<Payload, UrlParams, Path> =
  Payload extends NonNullable<unknown>
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TransformOut,
    infer UrlParams,
    infer Payload,
    infer Response
  >
    ? ArgsChecker<Payload, UrlParams, ExtractPathPropsNeed<Path>> extends true
      ? (
          args: ExtractNonNullableValue<Payload, unknown, { payload?: never }, { payload: Payload }> &
            TUrlParams<UrlParams> &
            DynamicUrlProps<Path>
        ) => Promise<GetValueFromPayloadOrTransformIn<Response, TransformIn>>
      : (args?: never) => Promise<GetValueFromPayloadOrTransformIn<Response, TransformIn>>
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
    infer TransformOut
  >
    ? Cfg<Method, Path, Headers, StringifyBody, ResultType, TransformIn, TransformOut>
    : never;
};

export type AnyTCfg = TCfg<
  Voidable<Methods>,
  string | AnyFunction,
  Voidable<Record<string, any> | (() => Record<string, string>)>,
  Voidable<boolean>,
  Voidable<ResultTypes>,
  Voidable<AnyFunction>,
  Voidable<AnyFunction>,
  Voidable<Record<string, any>>,
  Voidable<any>,
  Voidable<any>
>;

export type CreateClientSettings<T extends Record<string, AnyTCfg>> = T;

export type ExecuteClientSettings<T> = T extends CreateClientSettings<infer R> ? R : never;
