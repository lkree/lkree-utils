import { randomId } from '~/shared/lib/helpers/common';

describe('random id', () => {
  it('randoms string', () => {
    expect(typeof randomId()).toBe('string');
  });
});
