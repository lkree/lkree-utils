import { EMPTY_OBJECT } from '~/shared/const';
import { isString, noopData } from '~/shared/lib/helpers';
import type { AnyFunction } from '~/shared/lib/ts';

import { method, Methods } from './methods';
import type {
  AnyTCfg,
  Client,
  ClientSettings,
  DynamicUrlProps,
  ExecuteClientSettings,
  GetValueFromPayloadOrTransformOut,
  TCfg,
} from './types';

const createMethod =
  <M, Path, Headers, StringifyBody, ResultType, TransformIn, TransformOut, RestOptions, UrlParams, Payload, Response>(
    cfg: TCfg<
      M,
      Path,
      Headers,
      StringifyBody,
      ResultType,
      UrlParams,
      Payload,
      Response,
      TransformIn,
      TransformOut,
      RestOptions
    >
  ): ((
    args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path>
  ) => Promise<GetValueFromPayloadOrTransformOut<Response, TransformOut>>) =>
  (
    args: { payload: Payload; urlParams: UrlParams } & DynamicUrlProps<Path> = {} as {
      payload: Payload;
      urlParams: UrlParams;
    } & DynamicUrlProps<Path>
  ) =>
    method({
      options: {
        body: cfg.transformOut?.(args.payload) ?? args.payload,
        headers: cfg.headers,
        method: cfg.method as Methods,
        stringifyBody: cfg.stringifyBody as boolean,
        ...(cfg.options ?? EMPTY_OBJECT),
      },
      resultType: cfg.resultType,
      url: isString(cfg.url) ? cfg.url : (cfg.url as AnyFunction)(args.urlProps),
    }).then(cfg.transformOut ?? noopData);

export const createClient = <A, B = ExecuteClientSettings<A>>(clients: ClientSettings<B>): Client<B> => {
  return Object.keys(clients).reduce((result, key) => {
    // @ts-expect-error
    result[key as keyof A] = createMethod(clients[key as keyof A]);

    return result;
  }, {} as Client<B>);
};

export const createClientSettings = <T extends Record<string, AnyTCfg>>(
  settings: ClientSettings<T>
): ClientSettings<T> => settings;
