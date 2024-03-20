import { Queue } from '~/shared/lib/Queue';
import type { AnyFunction } from '~/shared/lib/ts';

export class TimeoutQueue extends Queue<AnyFunction> {
  private _isExecution = false;

  constructor(private _timeout: number) {
    super();
  }

  override push(item: AnyFunction) {
    super.push(item);

    this._callNext();
  }

  private _callNext() {
    const next = super.get();

    if (!next) {
      this._isExecution = false;
      return;
    }

    if (!this._isExecution) {
      this._isExecution = true;
      next();

      setTimeout(() => {
        super.shift();
        this._isExecution = false;
        this._callNext();
      }, this._timeout);
    }
  }
}
