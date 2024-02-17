import type { FULL_VALUE, RequestDataFields } from './const';

type GetDataToHandle<T, K extends keyof T> = K extends typeof FULL_VALUE ? T : T[K];

export type OnNoDataPassedCallback = <T extends Record<any, any>>(data: unknown) => asserts data is T;

export type OnInvalidData = <T extends Record<string, any>, K extends string>(
  property: K,
  data: GetDataToHandle<T, K>
) => void;

export type Cookies = Record<string, string>;

export type AssertObject<T> = {
  [Key in keyof T]: (d: GetDataToHandle<T, Key>) => void;
};

export type ValidationObject<T> = {
  [Key in keyof T]: (d: GetDataToHandle<T, Key>) => boolean;
};

type GetAssertValidateObject<T, K extends RequestDataFields, C> = [K] extends [RequestDataFields.Body] ? T : C;

export interface Settings<T, K extends RequestDataFields, C = Cookies> {
  assert?: Array<{
    assertObject: AssertObject<GetAssertValidateObject<T, K, C>>;
    fieldToExecuteData?: K;
  }>;
  transform?: {
    in?: (d: T) => any;
    out?: (d: any) => any;
  };
  validate?: Array<{
    validationObject: ValidationObject<GetAssertValidateObject<T, K, C>>;
    fieldToExecuteData?: K;
  }>;
}
