import { noop } from '~/shared/lib/helpers';
import { isArray, isObject, isDate, isPrimitive, isNullUndefined, isString } from '~/shared/lib/helpers/typeGuards';

describe('isArray', () => {
  it('is empty array', () => {
    expect(isArray([])).toBeTruthy();
  });

  it('is not empty array', () => {
    expect(isArray([1, 2])).toBeTruthy();
  });

  it('empty object is not array', () => {
    expect(isArray({})).toBeFalsy();
  });

  it('map is not array', () => {
    expect(isArray(new Map())).toBeFalsy();
  });

  it('set is not array', () => {
    expect(isArray(new Set())).toBeFalsy();
  });

  it('primitive is not array', () => {
    expect(isArray('')).toBeFalsy();
  });

  it('arguments is not array', () => {
    (function () {
      // eslint-disable-next-line prefer-rest-params
      expect(isArray(arguments)).toBeFalsy();
    })();
  });
});

describe('isObject', () => {
  it('is empty object', () => {
    expect(isObject({})).toBeTruthy();
  });

  it('is not empty object', () => {
    expect(isObject({ a: 1, b: 2 })).toBeTruthy();
  });

  it('array is not object', () => {
    expect(isObject([])).toBeFalsy();
  });

  it('Date is not object', () => {
    expect(isObject(new Date())).toBeFalsy();
  });

  it('function is not object', () => {
    expect(isObject(noop)).toBeFalsy();
  });
});

describe('isDate', () => {
  it('is Date', () => {
    expect(isDate(new Date())).toBeTruthy();
  });

  it('is string Date', () => {
    expect(isDate('test')).toBeFalsy();
  });

  it('is array date', () => {
    expect(isDate([])).toBeFalsy();
  });
});

describe('isPrimitive', () => {
  it('is string primitive', () => {
    expect(isPrimitive('asd')).toBeTruthy();
  });

  it('is empty string primitive', () => {
    expect(isPrimitive('')).toBeTruthy();
  });

  it('is number primitive', () => {
    expect(isPrimitive(123)).toBeTruthy();
  });

  it('is zero number primitive', () => {
    expect(isPrimitive(0)).toBeTruthy();
  });

  it('is infinite primitive', () => {
    expect(isPrimitive(Infinity)).toBeTruthy();
  });

  it('is true primitive', () => {
    expect(isPrimitive(true)).toBeTruthy();
  });

  it('is false primitive', () => {
    expect(isPrimitive(false)).toBeTruthy();
  });

  it('is bigint primitive', () => {
    expect(isPrimitive(1n)).toBeTruthy();
  });

  it('is array primitive', () => {
    expect(isPrimitive([])).toBeFalsy();
  });

  it('is object primitive', () => {
    expect(isPrimitive({})).toBeFalsy();
  });

  it('is object primitive', () => {
    expect(isPrimitive({})).toBeFalsy();
  });

  it('is function primitive', () => {
    expect(isPrimitive(noop)).toBeFalsy();
  });
});

describe('isNullUndefined', () => {
  it('is null', () => {
    expect(isNullUndefined(null)).toBeTruthy();
  });

  it('is undefined', () => {
    expect(isNullUndefined(undefined)).toBeTruthy();
  });

  it('is string null or undefined', () => {
    expect(isNullUndefined('')).toBeFalsy();
  });

  it('is number null or undefined', () => {
    expect(isNullUndefined(0)).toBeFalsy();
  });
});

describe('isString', () => {
  it('empty string', () => {
    expect(isString('')).toBeTruthy();
  });

  it('non empty string', () => {
    expect(isString('test')).toBeTruthy();
  });

  it('number', () => {
    expect(isString(123)).toBeFalsy();
  });

  it('boolean', () => {
    expect(isString(true)).toBeFalsy();
  });

  it('string array', () => {
    expect(isString(['a', 'b', 'c'])).toBeFalsy();
  });

  it('object', () => {
    expect(isString({ a: 1, b: 2, c: 3 })).toBeFalsy();
  });
});
