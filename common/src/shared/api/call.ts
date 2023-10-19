import { isArray, isObject } from '~/shared/lib/helpers';
import type { ToCamelCase } from '~/shared/lib/ts';

import { computeHeaders, getJSONHeaders, toCamelCase } from './utils';

export enum BuiltInHeaders {
  JSON = 'json',
}

interface Headers {
  builtIn?: Array<BuiltInHeaders>;
  own?: Record<string, string>;
}

interface Props {
  options?: {
    headers?: Headers;
    body?: any;
    stringifyBody?: boolean;
  } & Omit<RequestInit, 'body' | 'headers'>;
  resultType?: 'text' | 'json';
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
        ...(options.body && { body: options.stringifyBody ?? true ? JSON.stringify(options.body) : options.body }),
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
    const { options, resultType = 'json', url } = reqInterceptor?.(props) ?? props;

    return fetchInstance(url, computeOptions(options))
      .then(d => d[resultType]())
      .then(r => (isObject(r) || isArray(r) ? toCamelCase(r) : r))
      .then(r => resInterceptor?.(r) ?? r);
  };

export const call = createCall({ fetchInstance: fetch });
