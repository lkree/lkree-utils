import { alphabeticSortHelper, removeWhiteSpaces } from './common';
import { isArray, isDate, isNumber, isObject, isPrimitive, isString } from './typeGuards';

const forEachTypeGuards = { isArray, isObject, isPrimitive };

export const excludeDataFromObject = <T extends Record<string, any>, K extends Array<keyof T>>(
  data: T,
  fieldsToExclude: K
): Omit<T, K[number]> =>
  Object.fromEntries(Object.entries(data).filter(([fieldName]) => !fieldsToExclude.includes(fieldName))) as Omit<
    T,
    K[number]
  >;

export const getDataFromObject = <T extends Record<string, any>, K extends Array<keyof T>>(
  data: T,
  fieldsToExclude: K
): Pick<T, K[number]> =>
  Object.fromEntries(Object.entries(data).filter(([fieldName]) => fieldsToExclude.includes(fieldName))) as Pick<
    T,
    K[number]
  >;

type Value<T> = T extends Array<unknown> | Record<string, any> ? T[keyof T] : T;

type ReturnValue<T, K> = T extends Array<unknown> | Record<string, any> ? { [Key in keyof T]: ReturnValue<T, K> } : K;

export const forEachObjectValueType = <T, K extends (value: Value<T>) => any>(
  data: T,
  callback: K,
  type: 'Object' | 'Array' | 'Primitive'
): ReturnValue<T, ReturnType<K>> => {
  const isSearchingValue = forEachTypeGuards[`is${type}`];

  if (isSearchingValue(data)) callback(data as Value<T>);

  return data && typeof data === 'object' && !isDate(data)
    ? Object.entries(data as object).reduce(
        (r, { 0: name, 1: value }) => {
          if (isSearchingValue(value)) value = callback(value as Value<T>);

          r[name as keyof typeof r] = isObject(value)
            ? forEachObjectValueType(value, callback, type)
            : isArray(value)
              ? value.map(c => forEachObjectValueType(c, callback as (d: unknown) => unknown, type))
              : value;

          return r;
        },
        data as ReturnValue<T, ReturnType<K>>
      )
    : (data as ReturnValue<T, ReturnType<K>>);
};

export const forEachValue = <T, K extends (value: Value<T>) => any>(
  data: T,
  callback: K
): ReturnValue<T, ReturnType<K>> =>
  isPrimitive(data)
    ? (callback(data as Value<T>) as ReturnValue<T, ReturnType<K>>)
    : Object.entries(data as object).reduce(
        (r, { 0: name, 1: value }) => {
          r[name as keyof typeof r] = isObject(value)
            ? forEachValue(value, callback)
            : isArray(value)
              ? value.map(c => forEachValue(c, callback as (d: unknown) => unknown))
              : callback(value as Value<T>);

          return r;
        },
        data as ReturnValue<T, ReturnType<K>>
      );

export const forEachKey = <T extends Record<string, any>>(
  data: T,
  callback: (key: string) => string
): Record<ReturnType<typeof callback>, T[keyof T]> =>
  Object.entries(data).reduce(
    (r, { 0: name, 1: value }) => {
      r[callback(name)] = isObject(value) || isArray(value) ? forEachKey(value, callback) : value;

      return r;
    },
    (isObject(data) ? {} : []) as Record<ReturnType<typeof callback>, T[keyof T]>
  );

export const computeIntegerFromString = (s: unknown, numberSeparator: string) => {
  if (isNumber(s)) return s;
  if (!isString(s)) return null;

  const [firstString, secondString] = s.split(numberSeparator);

  if (!firstString || !secondString) return null;

  const firstPart = +removeWhiteSpaces(firstString);
  const secondPart = +removeWhiteSpaces(secondString);

  if (isFinite(firstPart) && isFinite(secondPart)) return firstPart + secondPart / +`1e${secondString.length}`;

  return null;
};

export const transformObjectWithStringsToNumbers = (d: Record<string, any>, numberSeparator: string) =>
  forEachValue(d, value => (isString(value) ? computeIntegerFromString(value, numberSeparator) : value));

export const sortObject = <T extends Record<string, any>>(o: T) =>
  Object.keys(o)
    .sort(alphabeticSortHelper)
    .reduce((r, key) => {
      r[key as keyof T] = o[key];

      return r;
    }, {} as T);

export const getNonFalsyObject = <T extends Record<string, any>>(d: T) =>
  Object.entries(d).reduce((r, [key, value]) => {
    if (value) r[key as keyof T] = value;

    return r;
  }, {} as T);
