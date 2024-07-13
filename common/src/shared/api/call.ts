import { isArray, isObject, isString } from '~/shared/lib/helpers';
import type { ToCamelCase } from '~/shared/lib/ts';

import { computeHeaders, getJSONHeaders, toCamelCase } from './utils';

const NO_CONTENT_CODE = 204;

export enum BuiltInHeaders {
  JSON = 'json',
}

interface Headers {
  builtIn?: Array<BuiltInHeaders>;
  own?: Record<string, string>;
}

export enum ResultTypes {
  Text = 'text',
  JSON = 'json',
}

export interface Props {
  options?: {
    headers?: Headers;
    body?: any;
    stringifyBody?: boolean;
  } & Omit<RequestInit, 'body' | 'headers'>;
  resultType?: ResultTypes;
  url: string;
}

const computeHeadersObject = (headers: Headers) =>
  !headers
    ? headers
    : computeHeaders({
        ...(headers.builtIn?.includes(BuiltInHeaders.JSON) && getJSONHeaders()),
        ...(headers.own && headers.own),
      });

const computeOptions = (options?: Props['options']) =>
  !options
    ? options
    : {
        ...options,
        ...(options.body && {
          body:
            options.stringifyBody ?? true
              ? isString(options.body)
                ? options.body
                : JSON.stringify(options.body)
              : options.body,
        }),
        ...(options.headers && { headers: computeHeadersObject(options.headers) }),
      };

export const createCall =
  ({
    fetchInstance = fetch,
    reqInterceptor,
    resInterceptor,
  }: {
    fetchInstance?: typeof fetch;
    reqInterceptor?: <T extends Props>(props: T) => T;
    resInterceptor?: <T>(d: T) => T;
  }) =>
  <T>(props: Props): Promise<ToCamelCase<T>> => {
    const { options, resultType = ResultTypes.JSON, url } = reqInterceptor?.(props) ?? props;

    return fetchInstance(url, computeOptions(options))
      .then(d => (d.status === NO_CONTENT_CODE ? Promise.resolve() : d[resultType]()))
      .then(r => (isObject(r) || isArray(r) ? toCamelCase(r) : r))
      .then(r => resInterceptor?.(r) ?? r);
  };

export const call = createCall({ fetchInstance: fetch });
