import axios from 'axios';
import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';

jest.mock('axios');

/**
 * Tests of the AuthService class.
 */
describe('AuthService', () => {
  let authService: AuthService;
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    authService = bindings.get<AuthService>(AuthService);
    mockAxios = axios as jest.Mocked<typeof axios>;
  });

  it('validate should work', async () => {
    await authService.validate('test-token');
    expect(mockAxios.get).toBeCalledTimes(1);
  });

  it('authResponse should work', async () => {
    expect(authService.authResponse(true, 'test-arn')).toStrictEqual({
      principalId: 'celestial-sadalsuud-auth-principal',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'test-arn',
          },
        ],
      },
    });
    expect(authService.authResponse(false, 'test-arn')).toStrictEqual({
      principalId: 'celestial-sadalsuud-auth-principal',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'test-arn',
          },
        ],
      },
    });
  });
});
