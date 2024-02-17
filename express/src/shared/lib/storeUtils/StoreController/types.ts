import type { Nullable } from 'lkree-common-utils/ts';
import type { AnyAction, Unsubscribe } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { DefaultRootState, Store } from '../types';

import type { StoreControllerMethod, SubscribeMethod, EqualityMethod } from './const';

export interface Cache<T = any> {
  callResult: Nullable<T>;
}

export interface StateChecker {
  (state: DefaultRootState): any;
}

export interface OnSubscribe {
  (state: DefaultRootState): any;
}

export interface StoreControllerOptions {
  once?: boolean;
}

export type SubscribeMethods = Record<SubscribeMethod, (callback: OnSubscribe) => Unsubscribe>;

export type EqualityMethods = Record<
  EqualityMethod,
  (
    stateChecker: (state: DefaultRootState) => boolean,
    callback: (state: DefaultRootState) => any
  ) => (cache: Cache) => boolean | void
>;

export type GetSubscribeMethods = (
  props: { equal: (state: DefaultRootState) => boolean; options?: { once?: boolean } },
  equalityMethod: keyof EqualityMethods
) => SubscribeMethods;

export type StoreController = Record<
  StoreControllerMethod,
  (equal: StateChecker, options?: StoreControllerOptions) => SubscribeMethods
> & {
  thunkDispatch: ThunkDispatch<DefaultRootState, any, AnyAction>;
  getStore: () => Store;
};
