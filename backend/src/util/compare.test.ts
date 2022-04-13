import { compareKey } from './compare';

describe('compare', () => {
  it('sorting string', () => {
    const arr = [
      { key: 'c', key2: 'a' },
      { key: 'a', key2: 'a' },
      { key: 'b', key2: 'qq' },
      { key: 'd', key2: 'a' },
    ];
    expect(arr.sort(compareKey('key'))).toStrictEqual([
      { key: 'a', key2: 'a' },
      { key: 'b', key2: 'qq' },
      { key: 'c', key2: 'a' },
      { key: 'd', key2: 'a' },
    ]);
  });
  it('sorting number', () => {
    const arr = [
      { key: 3, key2: 'a' },
      { key: 1, key2: 'a' },
      { key: 2, key2: 'qq' },
      { key: 4, key2: 'a' },
    ];
    expect(arr.sort(compareKey('key'))).toStrictEqual([
      { key: 1, key2: 'a' },
      { key: 2, key2: 'qq' },
      { key: 3, key2: 'a' },
      { key: 4, key2: 'a' },
    ]);
  });
  it('sorting number reverse', () => {
    const arr = [
      { key: 3, key2: 'a' },
      { key: 1, key2: 'a' },
      { key: 2, key2: 'qq' },
      { key: 4, key2: 'a' },
    ];
    expect(arr.sort(compareKey('key', true))).toStrictEqual([
      { key: 4, key2: 'a' },
      { key: 3, key2: 'a' },
      { key: 2, key2: 'qq' },
      { key: 1, key2: 'a' },
    ]);
  });
});
