import { fromGetParams, toGetParams } from '~/shared/api';

describe('fromGetParams', () => {
  it('string without get params', () => {
    expect(fromGetParams('https://example.com')).toEqual({});
  });

  it('string with get params', () => {
    expect(fromGetParams('https://example.com?a=1&b=2')).toEqual({ a: '1', b: '2' });
  });
});

describe('toGetParams', () => {
  it('empty object', () => {
    expect(toGetParams({})).toEqual(new URLSearchParams());
  });

  it('object with simple params', () => {
    expect(toGetParams({ a: '1', b: '2' }).toString()).toEqual(new URLSearchParams('a=1&b=2').toString());
  });

  it('object with difficult params', () => {
    expect(toGetParams({ a: ['5', '6'], b: [['6', '8']] }).toString()).toEqual(
      new URLSearchParams('a=5&a=6&b=6,8').toString()
    );
  });
});
