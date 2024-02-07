// // import { ResultTypes } from '~/shared/api/call';
// import { BuiltInHeaders, ResultTypes } from '~/shared/api/call';
// import { createClient, createClientSettings } from '~/shared/api/createClient';
// import { Methods } from '~/shared/api/methods';
// // import type { Methods } from '~/shared/api/methods';
// import type { CreateClientSettings } from '~/shared/api/types';
// import { AnyFunction } from '~/shared/lib/ts';
//
// // import type { Nullable } from '~/shared/lib/ts';
// //
// // //
export {};
//
// //
// type TT = CreateClientSettings<{
//   getDates: {
//     url: '546';
//     response: { dates: Array<string> };
//     requestOptions: {
//       method: Methods.Post;
//       headers: { builtIn: [BuiltInHeaders.JSON] };
//       transformOut: AnyFunction;
//     };
//     responseOptions: {
//       resultType: ResultTypes.Text;
//     };
//   };
// }>;
//
// const test = createClient(
//   createClientSettings<TT>({
//     getDates: {
//       requestOptions: {
//         headers: { builtIn: [BuiltInHeaders.JSON] },
//         method: Methods.Post,
//         transformOut: (a: any) => 123,
//       },
//       responseOptions: {
//         resultType: ResultTypes.Text,
//       },
//       url: '546',
//     },
//   })
// );
//
// void test.getDates().then(d => {
//   console.log(d);
// });
//
// export type HistoryClient = CreateClientSettings<{
//   getGroups: {
//     url: 'asd';
//     response: { groups: Array<string> };
//   };
//   getTests: {
//     url: 'asd';
//     response: { tests: Array<string> };
//     payload: string;
//     requestOptions: {
//       method: Methods.Post;
//       headers: { builtIn: [BuiltInHeaders.JSON] };
//       transformOut: (group: string) => any;
//     };
//     responseOptions: {
//       stringifyBody: false;
//     };
//   };
//   getDates: {
//     url: '546';
//     payload: string;
//     response: { dates: Array<string> };
//     requestOptions: {
//       method: Methods.Post;
//       headers: { builtIn: [BuiltInHeaders.JSON] };
//       transformOut: AnyFunction;
//     };
//     responseOptions: {
//       stringifyBody: false;
//     };
//   };
// }>;
