import type { SyntheticEvent } from 'react';

export const defaultPrevented = <T extends (...args: [SyntheticEvent<any>, ...any]) => any>(callback: T) =>
  ((e, ...args: Parameters<T>) => {
    e?.preventDefault();
    callback(e, ...args);
  }) as T;

export const stoppedPropagation = <T extends (...args: [SyntheticEvent<any>, ...any]) => any>(callback: T) =>
  ((e, ...args: Parameters<T>) => {
    e?.stopPropagation();
    callback(e, ...args);
  }) as T;
