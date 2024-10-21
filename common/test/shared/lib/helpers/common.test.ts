import { randomId, chainInstanceWrapper } from '~/shared/lib/helpers/common';

describe('random id', () => {
  it('randoms string', () => {
    expect(typeof randomId()).toBe('string');
  });
});

describe('chainInstanceWrapper', () => {
  const errorMessage = 'error';
  const testObject = {
    fn: () => 123,
    fnN: () => 523,
    fnPromise: () => Promise.resolve(),
    fnRejectedPromise: () => Promise.reject(Error(errorMessage)),
  };

  it('simple use case', () => {
    expect(chainInstanceWrapper(testObject).fnN()).toHaveProperty('fn');
  });

  it('use case with promise', async () => {
    const promiseResult = chainInstanceWrapper(testObject).fnPromise();

    expect(promiseResult).toHaveProperty('then');

    await promiseResult.then(t => expect(t).toHaveProperty('fnN'));
  });

  it('use case with promise reject', () => {
    void expect(chainInstanceWrapper(testObject).fnRejectedPromise).rejects.toThrowError(errorMessage);
  });

  it('hard use case with promise reject at end', async () => {
    const instance = chainInstanceWrapper(testObject).fn();

    expect(instance).toHaveProperty('fn');
    expect(instance.fnPromise()).toHaveProperty('then');
    void expect(await instance.fnPromise().then(t => t.fnN().fnRejectedPromise)).rejects.toThrowError(errorMessage);
  });
});
