import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { LineService } from './LineService';

/**
 * Tests of the AuthService class.
 */
describe('AuthService', () => {
  let authService: AuthService;
  let mockLineService: any;

  beforeEach(() => {
    // prepare mockLineService
    mockLineService = {};
    bindings.rebind<LineService>(LineService).toConstantValue(mockLineService);

    mockLineService.verifyToken = jest.fn();

    authService = bindings.get<AuthService>(AuthService);
  });

  it('validate should work', async () => {
    await authService.validate('test-token');
    expect(mockLineService.verifyToken).toBeCalledTimes(1);
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
