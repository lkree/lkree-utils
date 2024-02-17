import type { ActionCreator, Reducer, Store } from './types';

export function createAction<T extends string = string, K = void>(type: T, callback?: never): ActionCreator<T, K>;
export function createAction<T extends string = string, K = void, S = void>(
  type: T,
  callback: (payload: K) => S
): ActionCreator<T, S>;
export function createAction<T extends string = string, K = void, S = void>(
  type: T,
  callback?: (payload: K) => S
): ActionCreator<T, K | S> {
  const fn = ((payload: K) => ({ payload: callback?.(payload) ?? payload, type })) as ActionCreator<T, K | S>;

  Object.assign(fn, { type });

  return fn;
}

export const computeActionName =
  <T extends string>(domain: T) =>
  <K extends string>(actionName: K): `${T}/${K}` =>
    `${domain}/${actionName}`;

export const createReducer: Reducer = (initialState, reducerMap) => (state, action) => {
  const currentState = state ?? initialState;
  const actionType = action.type as keyof typeof reducerMap;

  if (!actionType) return currentState;
  if (reducerMap && reducerMap[actionType]) {
    return reducerMap[actionType](currentState, action as never) ?? currentState;
  }

  return currentState;
};

export const getStore = (): Store => globalThis.store;
export const setStore = (store: Store) => (globalThis.store = store);
