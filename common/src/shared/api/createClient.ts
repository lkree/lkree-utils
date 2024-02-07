import { createCall, ResultTypes } from '~/shared/api/call';
import { EMPTY_OBJECT } from '~/shared/const';
import { isString, noopData } from '~/shared/lib/helpers';
import { AnyFunction, NonVoidable, Voidable } from '~/shared/lib/ts';

import { createMethod, Methods } from './methods';
import type {
  AnyTCfg,
  Client,
  ClientSettings,
  DynamicUrlProps,
  ExecuteClientSettings,
  GetValueFromPayloadOrTransformIn,
  RequestOptions,
  ResponseOptions,
  TCfg,
} from './types';

const computeDefaultRequestOptions = (
  requestOptions: Voidable<Partial<RequestOptions>> = EMPTY_OBJECT
): NonVoidable<Pick<RequestOptions, 'method' | 'transformOut' | 'headers'>> & RequestOptions => ({
  headers: EMPTY_OBJECT,
  method: Methods.Get,
  transformOut: noopData,
  ...requestOptions,
});

const computeDefaultResponseOptions = (
  requestOptions: Voidable<Partial<ResponseOptions>> = EMPTY_OBJECT
): NonVoidable<Pick<ResponseOptions, 'resultType' | 'stringifyBody' | 'transformIn'>> => ({
  resultType: ResultTypes.JSON,
  stringifyBody: true,
  transformIn: noopData,
  ...requestOptions,
});

const createClientWithFetchInstance = (...createCallParams: Parameters<typeof createCall>) => {
  const method = createMethod(...createCallParams);

  return <M, Path, Headers, StringifyBody, ResultType, TransformIn, TransformOut, UrlParams, Payload, Response>(
      cfg: TCfg<M, Path, Headers, StringifyBody, ResultType, UrlParams, Payload, Response, TransformIn, TransformOut>
    ): ((
      args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path>
    ) => Promise<GetValueFromPayloadOrTransformIn<Response, TransformOut>>) =>
    (
      args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path> = {} as {
        payload: Payload;
        urlParams: UrlParams;
      } & DynamicUrlProps<Path>
    ) => {
      const requestOptions = computeDefaultRequestOptions(cfg.requestOptions);
      const responseOptions = computeDefaultResponseOptions(cfg.responseOptions as ResponseOptions);

      return method({
        options: {
          ...requestOptions,
          body: requestOptions.transformOut(args.payload),
          headers: requestOptions.headers,
          method: requestOptions.method,
          stringifyBody: responseOptions.stringifyBody,
        },
        resultType: responseOptions.resultType,
        url: isString(cfg.url) ? cfg.url : (cfg.url as AnyFunction)(args.urlProps),
      }).then(responseOptions.transformIn);
    };
};

export const createClientWithOwnFetch = (...createCallParams: Parameters<typeof createCall>) => {
  const _createClient = createClientWithFetchInstance(...createCallParams);

  return <A, B = ExecuteClientSettings<A>>(clients: ClientSettings<B>): Client<B> => {
    return Object.keys(clients).reduce((result, key) => {
      // @ts-expect-error
      result[key as keyof A] = _createClient(clients[key as keyof A]);

      return result;
    }, {} as Client<B>);
  };
};

export const createClient = createClientWithOwnFetch({ fetchInstance: fetch });

export const createClientSettings = <T extends Record<string, AnyTCfg>>(
  settings: ClientSettings<T>
): ClientSettings<T> => settings;
