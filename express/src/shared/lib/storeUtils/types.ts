import type { Action as ReduxAction, AnyAction, Reducer as ReduxReducer, Store as BaseStore } from 'redux';
import type { ThunkAction as ReduxThunkAction } from 'redux-thunk';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DefaultRootState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store extends BaseStore<DefaultRootState> {}

declare global {
  // eslint-disable-next-line no-var
  var store: Store;
}

export type Action<T extends string = string, K = any> = {
  payload: K;
} & ReduxAction<T>;

type CheckNonReducerAction<T extends string | number | symbol> = T extends `_${infer P}`
  ? P extends string
    ? never
    : T
  : T;

export type GetActions<T extends Record<string, (...args: Array<any>) => Action>> = {
  [ActionName in keyof T]: ReturnType<T[ActionName]>;
}[CheckNonReducerAction<keyof T>];

export type ActionCreator<T extends string, K> = {
  (payload: K): Action<T, K>;
  type: T;
};

export type ReducerFunction<State, Actions extends AnyAction, Key extends Actions['type']> = (
  state: State,
  action: Extract<Actions, { type: Key }>
) => State | void;

export type ReducerMap<State, Actions extends AnyAction = AnyAction> = {
  [key in Actions['type']]: ReducerFunction<State, Actions, key>;
};

export type Reducer = <State, Actions extends AnyAction = AnyAction>(
  initialState: State,
  reducerMap: ReducerMap<State, Actions>
) => ReduxReducer<State, Actions>;

export type CustomThunkAction<output> = ReduxThunkAction<output, DefaultRootState, void, AnyAction>;
