import type { AnyFunction } from '~/shared/lib/ts';

export const isArray = <T>(d: unknown): d is Array<T> => Boolean(d && Array.isArray(d));

const PRIMITIVE_TYPES = ['string', 'number', 'boolean', 'bigint', 'symbol'];

export const isNullUndefined = (d: unknown): d is null | undefined => d === null || d === undefined;

export const isPrimitive = (d: unknown): d is string | number | boolean | bigint | symbol =>
  Boolean(d && PRIMITIVE_TYPES.includes(typeof d));

export const isDate = (d: unknown): d is Date => Boolean(isAnyObject(d) && d instanceof Date);

export const isAnyObject = (d: unknown): d is object => Boolean(d && typeof d === 'object');

export const isObject = (d: unknown): d is Record<string, any> => Boolean(isAnyObject(d) && !isArray(d) && !isDate(d));

export const isFunction = (candidate: unknown): candidate is AnyFunction =>
  Boolean(candidate && typeof candidate === 'function');

export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);

export const isString = (d: unknown): d is string => typeof d === 'string';

export const isPromiseLike = <T>(d: unknown): d is PromiseLike<T> =>
  (isAnyObject(d) || isFunction(d)) && checkField(d, 'then') && isFunction(d.then);

export const checkField = <T, K extends string>(d: T, field: K): d is T & Record<K, any> =>
  (isAnyObject(d) || isFunction(d)) && field in d;

export const isPromise = <T>(d: unknown): d is Promise<T> =>
  isPromiseLike(d) &&
  checkField(d, 'catch') &&
  isFunction(d.catch) &&
  checkField(d, 'finally') &&
  isFunction(d.finally);
