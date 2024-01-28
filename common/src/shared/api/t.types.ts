import { createClient, createClientSettings } from '~/shared/api/createClient';
import { Methods } from '~/shared/api/methods';
import type { CreateClientSettings } from '~/shared/api/types';

export {};

type TT = CreateClientSettings<{
  a: {
    method: Methods.Get;
    url: () => 'asd';
    response: 5;
  };
}>;

const test = createClient<TT>(
  createClientSettings<TT>({
    a: {
      method: Methods.Get,
      url: () => 'asd',
    },
  })
);

void test.a().then(d => {
  console.log(d);
});
