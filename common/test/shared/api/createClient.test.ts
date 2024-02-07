import { getClientHelpers } from 'test/_settings/helpers';

import { computeHeaders, Methods } from '~/shared/api';
import { EMPTY_OBJECT } from '~/shared/const';
import { excludeDataFromObject, noopData } from '~/shared/lib/helpers';

const clientHelpers = getClientHelpers();

describe('createClient', () => {
  beforeAll(clientHelpers.beforeAll);
  beforeEach(clientHelpers.beforeEach);

  it('simple request', async () => {
    clientHelpers.atTestBeginning({ response: 123 });

    expect(await clientHelpers.getClient().test()).toEqual(clientHelpers.getFetchResult());
  });

  it('fetch calls', () => {
    const { fetchInstance, jestFn } = clientHelpers.getJestFetch();
    clientHelpers.atTestBeginning({ fetchSettings: { fetchInstance }, response: 123 });

    void clientHelpers.getClient().test();

    expect(jestFn).toBeCalled();
  });

  it('test params', () => {
    const { fetchInstance, jestFn } = clientHelpers.getJestFetch();
    const testData = {
      body: '10',
      headers: computeHeaders(EMPTY_OBJECT),
      method: Methods.Get,
      stringifyBody: true,
      testProps: 123,
      transformOut: noopData,
      url: 'test',
    };
    clientHelpers.atTestBeginning({
      clientOptions: {
        test: {
          requestOptions: {
            headers: testData.headers,
            method: testData.method,
            testProps: testData.testProps,
          },
          responseOptions: {
            stringifyBody: testData.stringifyBody,
            transformOut: testData.transformOut,
          },
          url: testData.url,
        },
      },
      fetchSettings: { fetchInstance },
      response: null,
    });

    void clientHelpers.getClient().test({ payload: testData.body } as any);

    expect(jestFn).toBeCalledWith(testData.url, excludeDataFromObject(testData, ['url']));
  });
});
