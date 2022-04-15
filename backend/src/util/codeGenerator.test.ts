import { gen6DigitCode } from './codeGenerator';

describe('codeGenerator', () => {
  it('gen6DigitCode', () => {
    expect(gen6DigitCode().length).toBe(6);
  });
});
