import { assignObject } from '~/shared/lib/helpers/objectHelpers';

describe('assignObject', () => {
  it('equal objects', () => {
    const a = { a: 5, b: 6 };
    const b = { ...a };

    expect(assignObject(a, b)).toEqual(a);
  });

  it('simple objects', () => {
    const a = { a: 5, b: 6 };
    const b = { ...a, b: 5 };

    expect(assignObject(a, b)).toEqual(b);
  });

  it('b with additional field', () => {
    const a = { a: 5, b: 6 };
    const b = { ...a, b: 5, c: 1 };

    expect(assignObject(a, b)).toEqual(b);
  });

  it('with objects inside', () => {
    const a = { a: 5, b: 6, z: { a: 5 } };
    const b = { ...a, b: 5, c: 1, z: { a: 4 } };

    expect(assignObject(a, b)).toEqual(b);
  });

  it('with arrays inside', () => {
    const a = { a: 5, b: 6, z: [1, 2] };
    const b = { ...a, b: 5, c: 1, z: [3, 4, 5] };

    expect(assignObject(a, b)).toEqual(b);
  });

  it('partial b', () => {
    const a = { a: 5, b: 6 };
    const b = { b: 10 };

    expect(assignObject(a, b)).toEqual({ ...a, ...b });
  });
});
