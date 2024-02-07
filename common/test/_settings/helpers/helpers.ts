import { createClient, CreateClientSettings, ResultTypes } from '~/shared/api';
import { createClientWithOwnFetch } from '~/shared/api/createClient';
import type { Client } from '~/shared/api/types';
import { EMPTY_OBJECT } from '~/shared/const';
import { noop } from '~/shared/lib/helpers';
import { AnyFunction, Nullable } from '~/shared/lib/ts';

let response: any;

export type TestClient = CreateClientSettings<{
  test: {
    url: () => 'asd';
    response: typeof response;
    responseOptions: {
      resultType: ResultTypes.JSON;
    };
  };
}>;

export const getClientHelpers = <T = TestClient>() => ({
  _client: null as Nullable<Client<T>>,
  atTestBeginning: function ({
    clientOptions = EMPTY_OBJECT,
    fetchSettings = { fetchInstance: fetch },
    response,
  }: {
    response: any;
    clientOptions?: Parameters<typeof createClient>[number];
    fetchSettings?: Parameters<typeof createClientWithOwnFetch>[number];
  }) {
    this.response = response;
    this._client = createClientWithOwnFetch(fetchSettings)<T>({
      ...this.defaultClientOptions,
      ...clientOptions,
    } as any) as Client<T>;
    fetchMock.mockResponseOnce(this.response);
  },
  beforeAll: () => void 0,
  beforeEach: () => {
    fetchMock.resetMocks();
  },
  defaultClientOptions: {
    test: {
      responseOptions: {
        resultType: ResultTypes.JSON,
      },
      url: () => 'asd',
    },
  },
  getClient: function () {
    this._client ||= createClient<T>(this.defaultClientOptions as any) as Client<T>;

    return this._client;
  },
  getFetchResult: function () {
    return this.response;
  },
  getJestFetch: () => {
    const jestFn = jest.fn();

    return {
      fetchInstance: ((...args) => {
        jestFn(...args);
        return Promise.resolve({ json: noop });
      }) as AnyFunction,
      jestFn,
    };
  },
  response: null as any,
});
