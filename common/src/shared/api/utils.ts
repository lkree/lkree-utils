import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';

import { forEachKey, isArray, isNullUndefined, isPrimitive } from '~/shared/lib/helpers';
import { ToCamelCase, ToSnakeCase } from '~/shared/lib/ts';

export const computeHeaders = (headers: Record<string, string>) =>
  Object.entries(headers).reduce((result, [key, value]) => {
    result.append(key, value);

    return result;
  }, new Headers());

type TypeWithToString = {
  toString: () => string;
};

export const toGetParams = (params: Record<string, TypeWithToString | Array<TypeWithToString>>) =>
  Object.entries(params).reduce((result, [key, value]) => {
    if (!isNullUndefined(value)) {
      if (isPrimitive(value)) result.append(key, value.toString());
      else if (isArray<TypeWithToString>(value)) value.forEach(v => result.append(key, v.toString()));
    }

    return result;
  }, new URLSearchParams());

export const fromGetParams = (url: string) => {
  const paramsStartsAt = url.indexOf('?');

  return (
    paramsStartsAt < 0 ? {} : Object.fromEntries(new URLSearchParams(url.slice(paramsStartsAt, url.length)).entries())
  ) as Record<string, string>;
};

export const computeGetParams = (params: Record<string, string>) =>
  Object.entries(params).reduce((result, [key, value]) => {
    result.append(key, value);

    return result;
  }, new URLSearchParams());

type ToSnakeCaseResult<T> = T extends Array<any> ? { [Key in keyof T]: ToSnakeCaseResult<T[Key]> } : ToSnakeCase<T>;
type ToCamelCaseResult<T> = T extends Array<any> ? { [Key in keyof T]: ToCamelCaseResult<T[Key]> } : ToCamelCase<T>;

export const toSnakeCase = <T extends Record<string, unknown> | Array<any>>(data: T): ToSnakeCaseResult<T> =>
  forEachKey(data, snakeCase) as ToSnakeCaseResult<T>;

export const toCamelCase = <T extends Record<string, any> | Array<any>>(data: T): ToCamelCaseResult<T> =>
  forEachKey(data, camelCase) as ToCamelCaseResult<T>;

export const getJSONHeaders = () => ({ 'Content-Type': 'application/json' });
