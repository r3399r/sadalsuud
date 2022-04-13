import { randomInt } from 'crypto';

export const gen6DigitCode = () => {
  let result = '';
  for (let i = 0; i < 6; i++) result += String(randomInt(10));

  return result;
};
