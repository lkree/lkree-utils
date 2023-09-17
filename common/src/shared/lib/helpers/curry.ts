import type { AnyFunction } from '~/shared/lib/ts';

// Add element E to array A (i.e Prepend<0, [1, 2]> = [0, 1, 2])
type Prepend<E, A extends Array<any>> = [E, ...A];

// Get the tail of the array, i.e Tail<[0, 1, 2]> = [1, 2]
type Tail<A extends Array<any>> = A extends [any] ? [] : A extends [any, ...infer T] ? T : never;

// Get the head of the array, i.e Head<[0, 1, 2]> = 0
type Head<A extends Array<any>> = A extends [infer H] ? H : A extends [infer H, ...any] ? H : never;

// Get the length of an array
type Length<T extends Array<any>> = T['length'];

// Drop N entries from array T
type Drop<N extends number, T extends Array<any>, I extends Array<any> = []> = Length<I> extends N
  ? T
  : Drop<N, Tail<T>, Prepend<Head<T>, I>>;

// Use type X if X is assignable to Y, otherwise Y
type Cast<X, Y> = X extends Y ? X : Y;

// Curry a function
type Curry<P extends Array<any>, R> = <T extends Array<any>>(
  ...args: Cast<T, Partial<P>>
) => Drop<Length<T>, P> extends [any, ...Array<any>] ? Curry<Cast<Drop<Length<T>, P>, Array<any>>, R> : R;

export function curry<P extends Array<any>, R>(fn: (...args: P) => R) {
  return ((...args: Array<any>) => {
    if (args.length >= fn.length) return (fn as AnyFunction)(...args) as R;

    return (...more: Array<any>) => (curry(fn) as AnyFunction)(...args, ...more);
  }) as unknown as Curry<P, R>;
}
