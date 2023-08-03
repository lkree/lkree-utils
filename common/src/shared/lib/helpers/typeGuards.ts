export const isArray = <T>(d: unknown): d is Array<T> => Boolean(d && Array.isArray(d));

const PRIMITIVE_TYPES = ['string', 'number', 'boolean', 'bigint', 'symbol'];

export const isNullUndefined = (d: unknown): d is null | undefined => d === null || d === undefined;

export const isPrimitive = (d: unknown): d is string | number | boolean | bigint | symbol =>
  PRIMITIVE_TYPES.includes(typeof d);

export const isDate = (d: unknown): d is Date => Boolean(d && typeof d === 'object' && d instanceof Date);

export const isObject = (d: unknown): d is Record<string, any> =>
  Boolean(d && typeof d === 'object' && !isArray(d) && !isDate(d));

export const isNumber = (value: unknown): value is number => typeof value === 'number';

export const isString = (d: unknown): d is string => typeof d === 'string';
