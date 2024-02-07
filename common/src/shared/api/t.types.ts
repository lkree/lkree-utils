// import type { ResultTypes } from '~/shared/api/call';
// import { CallParamsWithoutMethod, Methods } from '~/shared/api/methods';
// import type { AnyFunction } from '~/shared/lib/ts';
//
// type Props = {
//   headers?: Record<string, string | number | boolean>;
//   method?: Methods;
//   options?: Omit<CallParamsWithoutMethod<Methods>['options'], 'method' | 'headers' | 'body' | 'stringifyBody'>;
//   resultType?: ResultTypes;
//   stringifyBody?: boolean;
//   transformIn?: AnyFunction;
//   transformOut?: AnyFunction;
//   url: string | ((...props: Array<any>) => string);
// };
//
// type PropsRecord = Record<string, Props>;
//
// type TProps<Payload, Response, UrlParams extends Record<string, string | number | boolean>> = {
//   payload?: Payload;
//   response?: Response;
//   urlParams?: UrlParams;
// };
//
// type AnyTProps = TProps<any, any, any>;
//
// type AnyTPropsRecord = Record<string, AnyTProps>;
//
// type Client<Payload, Response, UrlParams, P extends Props> = (props: {
//   urlParams: UrlParams;
//   payload: Payload;
// }) => P['transformIn'] extends (...args: Array<any>) => infer R ? R : Response;
//
// type ClientMap<T, K> = {
//   [Key in keyof T]: T[Key] extends TProps<infer Payload, infer Response, infer UrlParams>
//     ? K[Key] extends Props
//       ? Client<Payload, Response, UrlParams, K[Key]>
//       : T[Key]
//     : never;
// };
//
// const createMethod = <T extends AnyTPropsRecord, K extends PropsRecord = PropsRecord>(props: K): ClientMap<T, K> =>
//   props as never as ClientMap<T & K>;
//
// type TestProps = {
//   b: {
//     payload: 10;
//     response: 111;
//     urlParams: { a: 5 };
//   };
// };
//
// const { b } = createMethod<TestProps>({
//   b: {
//     method: Methods.Put,
//     transformIn: () => 123,
//     url: 'asd',
//   },
// } as const);
//
// b({ payload: 10, urlParams: { a: 5 } });
