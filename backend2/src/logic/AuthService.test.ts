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

  describe('login', () => {
    it('should work', async () => {
      expect(
        authService.login({ account: 'aaa', password: 'bbb' })
      ).toHaveProperty('secret');
    });

    it('should fail', async () => {
      expect(() =>
        authService.login({ account: 'xxx', password: 'xxx' })
      ).toThrow(UnauthorizedError);
    });
  });

  describe('validate', () => {
    it('should work', () => {
      expect(authService.validate('jwOZs+PMI+liPxB6gz4amQ==')).toBe(false);
    });
  });

  describe('authResponse', () => {
    it('should work', () => {
      expect(authService.authResponse(true, 'resource')).toHaveProperty(
        'principalId'
      );
      expect(authService.authResponse(false, 'resource')).toHaveProperty(
        'principalId'
      );
    });
  });
});
