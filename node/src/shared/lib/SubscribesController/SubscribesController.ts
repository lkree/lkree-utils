import type { EventEmitter } from 'events';

type SubscribeEvent = string;
type SubscribeFunction = (e: any) => void;
export type SubscribeList = Array<{
  event: SubscribeEvent;
  listener: SubscribeFunction;
  subscriptionType?: 'on' | 'once';
  emitter: EventEmitter;
}>;

export class SubscribesController {
  private _subscribeMap: Map<{ emitter: EventEmitter; event: string }, SubscribeFunction> = new Map();

  doSubscribes(...subscribeList: SubscribeList): this {
    this.unSubscribe();

    subscribeList.forEach(({ emitter, event, listener, subscriptionType = 'on' }) => {
      this._subscribeMap.set({ emitter, event }, listener);
      emitter[subscriptionType](event, listener);
    });

    return this;
  }

  unSubscribe(): this {
    this._subscribeMap.forEach((eventCallback, { emitter, event }) => emitter.off(event, eventCallback));
    this._subscribeMap.clear();

    return this;
  }
}
