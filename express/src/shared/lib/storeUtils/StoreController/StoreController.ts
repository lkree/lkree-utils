import type { UnknownAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { DefaultRootState, Store } from '../types';

import { defaultSubscribeOptions, EqualityMethod, SubscribeMethod } from './const';
import { storeCacher } from './storeCacher';
import type { Cache, EqualityMethods, StoreController, SubscribeMethods, GetSubscribeMethods } from './types';

const equalityMethods: EqualityMethods = {
  [EqualityMethod.change]: (stateChecker, callback) => (cache: Cache<boolean>) => {
    const state = storeController.getStore().getState();
    const stateCheckerResult = stateChecker(state);
    const stateCheckerPrevResult = cache.callResult ?? stateChecker(state);

    cache.callResult = stateCheckerResult;

    if (stateCheckerPrevResult !== stateCheckerResult) {
      callback(state);

      return true;
    }
  },
  [EqualityMethod.equal]: (stateChecker, callback) => () => {
    const state = storeController.getStore().getState();

    if (stateChecker(state)) {
      callback(state);

      return true;
    }
  },
};

const getSubscribeMethods: GetSubscribeMethods = (
  equalityMethod: keyof EqualityMethods,
  equal,
  options = defaultSubscribeOptions
): SubscribeMethods => ({
  [SubscribeMethod.call]: callback => {
    const parameters = options === defaultSubscribeOptions ? options : { ...defaultSubscribeOptions, ...options };
    const onStoreFire = storeCacher(equalityMethods[equalityMethod](equal, callback));

    const unsubscribe = storeController.getStore().subscribe(() => onStoreFire() && parameters.once && unsubscribe());

    return unsubscribe;
  },
});

const thunkDispatch: ThunkDispatch<DefaultRootState, any, UnknownAction> = (
  ...props: Parameters<ThunkDispatch<DefaultRootState, any, UnknownAction>>
) => (storeController.getStore().dispatch as ThunkDispatch<DefaultRootState, any, UnknownAction>)(...props);

export const storeController: StoreController = {
  getStore: (): Store => globalThis.store,
  setStore: store => (globalThis.store = store),
  thunkDispatch,
  whenStateChange: (equal, options) => getSubscribeMethods(EqualityMethod.change, equal, options),
  whenStateEqual: (equal, options) => getSubscribeMethods(EqualityMethod.equal, equal, options),
};
