import { decrypt, encrypt } from './crypto';

describe('crypto', () => {
  it('encrypt', () => {
    expect(encrypt('2022/03/24')).toBe('XMroqI0vjufObTyVc9MTQA==');
  });
  it('decrypt', () => {
    expect(decrypt('XMroqI0vjufObTyVc9MTQA==')).toBe('2022/03/24');
  });
});
