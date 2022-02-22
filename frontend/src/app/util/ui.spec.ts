import { ROLE, STATUS } from '@y-celestial/sadalsuud-service';
import { getRole, getUserStatus } from './ui';
import { ROLE as ROLE_LOCALE, STATUS as STATUS_LOCALE } from 'src/app/locales/user';

describe('ui', () => {
  it('getRole', () => {
    expect(getRole(ROLE.PASSERBY)).toBe(ROLE_LOCALE.PASSERBY);
    expect(getRole(ROLE.ROOKIE)).toBe(ROLE_LOCALE.ROOKIE);
    expect(getRole(ROLE.GOOD_PARTNER)).toBe(ROLE_LOCALE.GOOD_PARTNER);
    expect(getRole(ROLE.GOOD_PLANNER)).toBe(ROLE_LOCALE.GOOD_PLANNER);
    expect(getRole(ROLE.SOFT_PARTNER)).toBe(ROLE_LOCALE.SOFT_PARTNER);
    expect(getRole(ROLE.SOFT_PLANNER)).toBe(ROLE_LOCALE.SOFT_PLANNER);
    expect(getRole(ROLE.ADMIN)).toBe(ROLE_LOCALE.ADMIN);
    expect(getRole('xxx' as ROLE)).toBe(ROLE_LOCALE.PASSERBY);
  });

  it('getUserStatus', () => {
    expect(getUserStatus(STATUS.VERIFIED)).toBe(STATUS_LOCALE.VERIFIED);
    expect(getUserStatus(STATUS.UNVERIFIED)).toBe(STATUS_LOCALE.UNVERIFIED);
    expect(getUserStatus(STATUS.PHONE_UPDATED)).toBe(STATUS_LOCALE.PHONE_UPDATED);
    expect(getUserStatus(STATUS.WRONG_PHONE)).toBe(STATUS_LOCALE.WRONG_PHONE);
  });
});
