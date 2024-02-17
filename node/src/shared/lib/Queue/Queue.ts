import type { Voidable } from 'lkree-common-utils/ts';

export interface IQueue<T> {
  get: () => Voidable<T>;
  isEmpty: boolean;
  length: number;
  push: (item: T) => void;
  shift: () => void;
}

export class Queue<T> implements IQueue<T> {
  private _queue = [] as Array<T>;

  get() {
    return this._queue[0];
  }

  get isEmpty() {
    return !this._queue.length;
  }

  get length() {
    return this._queue.length;
  }

  push(item: T) {
    this._queue.push(item);
  }

  shift() {
    return this._queue.shift();
  }
}
