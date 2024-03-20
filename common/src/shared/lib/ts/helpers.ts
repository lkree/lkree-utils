export type Nullable<T> = T | null;

export type Voidable<T> = T | undefined;

export type AnyFunction = (...args: Array<any>) => any | PromiseLike<any>;

export type NonVoidable<T extends Record<string, any>> = {
  [Key in keyof T]-?: T[Key];
};

export type NullableObj<T extends Record<string, any>> = {
  [Key in keyof T]: Nullable<T[Key]>;
};

export type NonNullableKeys<T> = {
  [K in keyof T]-?: object extends { [P in K]: T[K] }
    ? never
    : null extends T[K]
      ? never
      : undefined extends T[K]
        ? never
        : K;
}[keyof T];

export type PickNonNullable<T extends Record<string | number | symbol, any>> = Pick<T, NonNullableKeys<T>>;

export type Noop = (...args: Array<any>) => void;

export type SnakeCase<T extends string> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
    ? `${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}${SnakeCase<R>}`
    : '';

export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

export type ToCamelCase<T> =
  T extends Record<string, unknown>
    ? {
        [Key in keyof T as CamelCase<Key & string>]: T[Key] extends Record<string, unknown>
          ? ToCamelCase<T[Key]>
          : T[Key];
      }
    : T;

export type ToSnakeCase<T> =
  T extends Record<string, unknown>
    ? {
        [Key in keyof T as SnakeCase<Key & string>]: T[Key] extends Record<string, unknown>
          ? ToSnakeCase<T[Key]>
          : T[Key];
      }
    : T;

export type Entries<T> = Array<
  {
    [Key in keyof T]: [Key, T[Key]];
  }[keyof T]
>;

export type InitLoaderSetter<T extends () => Promise<any>> = {
  loader: T;
  setter: (d: Awaited<ReturnType<T>>) => any;
};
