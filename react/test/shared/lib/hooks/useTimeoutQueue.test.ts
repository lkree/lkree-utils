import { act, renderHook } from '@testing-library/react-hooks';

import { useTimeoutQueue } from '~/shared/lib/hooks';

describe('useTimeoutQueue', () => {
  it('easy truthy case', async () => {
    const testTime = 10;
    const fn = jest.fn();

    const { result: queue, waitForNextUpdate } = renderHook(() => useTimeoutQueue(testTime, fn));

    act(() => queue.current.push(fn));

    await waitForNextUpdate();

    expect(fn).toBeCalledTimes(1);

    act(() => queue.current.push(fn));

    await waitForNextUpdate();

    expect(fn).toBeCalledTimes(2);
  });
});
