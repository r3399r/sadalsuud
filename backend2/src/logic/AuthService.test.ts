import { UnauthorizedError } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { AuthService } from './AuthService';

/**
 * Tests of the AuthService class.
 */
describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(() => {
    process.env.adminAccount = 'aaa';
    process.env.adminPassword = 'bbb';
  });

  beforeEach(() => {
    authService = bindings.get<AuthService>(AuthService);
  });

  it('login should work', async () => {
    expect(
      authService.login({ account: 'aaa', password: 'bbb' })
    ).toHaveProperty('secret');
  });

  it('login should fail', async () => {
    expect(() =>
      authService.login({ account: 'xxx', password: 'xxx' })
    ).toThrow(UnauthorizedError);
  });
});
