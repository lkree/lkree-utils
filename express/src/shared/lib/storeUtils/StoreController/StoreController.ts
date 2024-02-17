import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import { getStore } from '../storeUtils';
import type { DefaultRootState } from '../types';

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
  { equal, options = defaultSubscribeOptions },
  equalityMethod: keyof EqualityMethods
): SubscribeMethods => ({
  [SubscribeMethod.call]: callback => {
    const parameters = { ...defaultSubscribeOptions, ...options };
    const onStoreFire = storeCacher(equalityMethods[equalityMethod](equal, callback));

    const unsubscribe = storeController.getStore().subscribe(() => onStoreFire() && parameters.once && unsubscribe());

    return unsubscribe;
  },
});

const thunkDispatch: ThunkDispatch<DefaultRootState, any, AnyAction> = (
  ...props: Parameters<ThunkDispatch<DefaultRootState, any, AnyAction>>
) => (getStore().dispatch as ThunkDispatch<DefaultRootState, any, AnyAction>)(...props);

export const storeController: StoreController = {
  getStore,
  thunkDispatch,
  whenStateChange: (equal, options) => getSubscribeMethods({ equal, options }, EqualityMethod.change),
  whenStateEqual: (equal, options) => getSubscribeMethods({ equal, options }, EqualityMethod.equal),
};
