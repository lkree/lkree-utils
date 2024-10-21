import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE } from '~/shared/const';
import type { AnyFunction, Noop } from '~/shared/lib/ts';

import { EMAIL_REGEX } from './const';
import { isFunction, isPromise } from './typeGuards';

export const randomId = () => Math.floor(Math.random() * Date.now()).toString(16);

export const noop: Noop = () => void 0;

export const noopData = <T>(d: T) => d;

export const anyFunction: AnyFunction = () => void 0;

export const exhaustiveCheck = (_: never): never => _;

export const createPromise = <T = void>() => {
  let resolve = noop;
  let reject = noop;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, reject, resolve };
};

export const deepClone = <T>(d: T): T => JSON.parse(JSON.stringify(d));

const getValuesFormFormatTime = (value: number) => {
  const mathFn = value >= 0 ? 'floor' : 'ceil';
  const hours = Math[mathFn](value / SECONDS_IN_HOUR);
  const minutes = Math[mathFn]((value / SECONDS_IN_MINUTE) % SECONDS_IN_MINUTE);
  const seconds = Math[mathFn](value % SECONDS_IN_MINUTE);

  return {
    hours,
    mathFn,
    minutes,
    seconds,
    sign: minutes < 0 || hours < 0 ? '- ' : '',
  };
};

export const formatTimeWithHours = (value: number) => {
  const { hours, sign } = getValuesFormFormatTime(value);
  const stringHours = `${Math.abs(hours)}`;

  return `${sign}${stringHours.length === 1 ? '0' + stringHours : stringHours}:${formatDate(value)}`;
};

export const formatDate = (value: number) => {
  const { minutes, seconds } = getValuesFormFormatTime(value);
  const stringSeconds = `${Math.abs(seconds)}`;
  const stringMinutes = `${Math.abs(minutes)}`;

  return `${stringMinutes.length === 1 ? '0' + stringMinutes : stringMinutes}:${
    stringSeconds.length === 1 ? '0' + stringSeconds : stringSeconds
  }`;
};

export const equal = <T, K>(a: T, b: K) => JSON.stringify(a) === JSON.stringify(b);

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const compose =
  <T extends (...args: Array<any>) => any>(...fns: Array<T>) =>
  <K extends (...args: Array<any>) => any>(fn: K): K =>
    fns.reduce((result, current) => current(result), fn);

export const checkEmailValidity = (email: string) => EMAIL_REGEX.test(email);

export const alphabeticSortHelper = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

export const removeWhiteSpaces = (s: string) => [...s].filter(c => c.trim()).join('');

// min and max included
export const randomFromTo = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const insertIntoString = (str: string, insertions: Array<string | number>) =>
  insertions.reduce<string>((result, insert, index) => result.replaceAll(`{${index}}`, insert.toString()), str);

export const capitalize = <T extends string>(str: T): Capitalize<T> =>
  `${str[0].toUpperCase()}${str.slice(1, str.length)}` as Capitalize<T>;

export const callIndependentlyAfter = <T extends any | PromiseLike<any>>(fnResult: T, callback: AnyFunction): T => {
  if (isPromise(fnResult)) return fnResult.then(callback).then(() => fnResult) as T;

  callback();

  return fnResult;
};

export const handleError = <T extends AnyFunction>(
  fn: T,
  onError: <T extends Error>(e: T) => any | Promise<any>
): ReturnType<T> => {
  let fnResult: ReturnType<T>[number];

  try {
    fnResult = fn();

    if (isPromise(fnResult)) return (fnResult as Promise<ReturnType<T>>).catch(onError) as ReturnType<T>;
  } catch (e) {
    onError(e as Error);
  }

  // @ts-expect-error
  return fnResult;
};

export const debounce = <T extends AnyFunction>(cb: T, timeout: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => cb(...args), timeout);
  };
};

type ChainInstanceWrappable = Record<string | symbol, any>;

type ChainInstanceWrapped<out T extends ChainInstanceWrappable> = {
  [Key in keyof T]: T[Key] extends AnyFunction
    ? (
        ...args: Parameters<T[Key]>
      ) => [ReturnType<T[Key]>] extends [Promise<any>] ? Promise<ChainInstanceWrapped<T>> : ChainInstanceWrapped<T>
    : T[Key];
};

type ChainInstanceWrapper = <T extends ChainInstanceWrappable>(wrapped: T) => ChainInstanceWrapped<T>;

export const chainInstanceWrapper: ChainInstanceWrapper = s => {
  return new Proxy(s, {
    get: (initialInstance: typeof s, p: string | symbol, self: ChainInstanceWrapped<typeof s>) => {
      if (!(p in initialInstance)) return;

      const objectValue = initialInstance[p];

      if (isFunction(objectValue)) {
        return (...args: Parameters<typeof objectValue>) => {
          const fnResult = objectValue(...args);

          if (isPromise(fnResult)) return fnResult.then(() => self);

          return self;
        };
      }

      return objectValue;
    },
  });
};
