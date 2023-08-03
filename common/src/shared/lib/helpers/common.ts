import { SECONDS_IN_MINUTE } from '~/shared/const';
import type { AnyFunction, Noop } from '~/shared/lib/ts';

import { EMAIL_REGEX } from './const';

export const randomId = () => Math.floor(Math.random() * Date.now()).toString(16);

export const noop: Noop = () => void 0;

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

export const formatDate = (value: number) => {
  const mathFn = value >= 0 ? 'floor' : 'ceil';
  const seconds = Math[mathFn](value % SECONDS_IN_MINUTE);
  const minutes = Math[mathFn]((value / SECONDS_IN_MINUTE) % SECONDS_IN_MINUTE);
  // const hours = Math[mathFn](value / SECONDS_IN_HOUR);
  // const sign = minutes < 0 || hours < 0 ? '- ' : '';
  const stringSeconds = `${Math.abs(seconds)}`;
  const stringMinutes = `${Math.abs(minutes)}`;
  // const stringHours = `${Math.abs(hours)}`;
  // ${sign}${stringHours.length === 1 ? '0' + stringHours : stringHours} :

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
