import { ROLE, STATUS } from '@y-celestial/sadalsuud-service';
import { ROLE as ROLE_LOCALE, STATUS as STATUS_LOCALE } from 'src/app/locales/user';

export function getRole(role: ROLE) {
  if (role === ROLE.ROOKIE) return ROLE_LOCALE.ROOKIE;
  if (role === ROLE.GOOD_PARTNER) return ROLE_LOCALE.GOOD_PARTNER;
  if (role === ROLE.GOOD_PLANNER) return ROLE_LOCALE.GOOD_PLANNER;
  if (role === ROLE.SOFT_PARTNER) return ROLE_LOCALE.SOFT_PARTNER;
  if (role === ROLE.SOFT_PLANNER) return ROLE_LOCALE.SOFT_PLANNER;
  if (role === ROLE.ADMIN) return ROLE_LOCALE.ADMIN;
  return ROLE_LOCALE.PASSERBY;
}

export function getUserStatus(status: STATUS) {
  if (status === STATUS.VERIFIED) return STATUS_LOCALE.VERIFIED;
  if (status === STATUS.PHONE_UPDATED) return STATUS_LOCALE.PHONE_UPDATED;
  if (status === STATUS.WRONG_PHONE) return STATUS_LOCALE.WRONG_PHONE;
  return STATUS_LOCALE.UNVERIFIED;
}
