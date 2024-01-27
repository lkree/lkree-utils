import { BuiltInHeaders, ResultTypes } from '~/shared/api/call';
import { createClient, createClientSettings } from '~/shared/api/createClient';
import { Methods } from '~/shared/api/methods';
import type { CreateClientSettings } from '~/shared/api/types';

export {};

type TT = CreateClientSettings<{
  a: {
    method: Methods.Get;
    url: (a: { a: 1 }) => 'asd';
    payload: { a: 5 };
    response: 555;
    urlParams: { a: 10 };
    headers: { builtIn: [BuiltInHeaders.JSON] };
    stringifyBody: true;
    resultType: ResultTypes.JSON;
    transformIn: (a: { a: 5 }) => 123;
    transformOut: (a: { a: 5 }) => 123;
  };
}>;

const test = createClient<TT>(
  createClientSettings<TT>({
    a: {
      headers: { builtIn: [BuiltInHeaders.JSON] },
      method: Methods.Get,
      resultType: ResultTypes.JSON,
      stringifyBody: true,
      transformIn: a => 123,
      transformOut: a => 123,
      url: ({ a }) => 'asd',
    },
  })
);

void test.a({ payload: { a: 5 }, urlParams: { a: 10 }, urlProps: { a: 1 } }).then(d => {
  console.log(d);
});
