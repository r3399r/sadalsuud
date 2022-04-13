import { LambdaContext } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { auth } from './auth';
import { AuthEvent } from './AuthEvent';

/**
 * Tests of auth lambda function
 */
describe('auth', () => {
  let event: AuthEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockAuthService: any;
  let dummyResult: any;

  beforeAll(() => {
    dummyResult = { a: '1' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockAuthService = {};
    bindings.rebind<AuthService>(AuthService).toConstantValue(mockAuthService);

    mockAuthService.validate = jest.fn(() => true);
    mockAuthService.authResponse = jest.fn(() => dummyResult);
  });

  it('should work', async () => {
    event = {
      type: 'TOKEN',
      methodArn: 'methodArn',
      authorizationToken: 'abcd',
    };
    await expect(auth(event, lambdaContext)).resolves.toStrictEqual(
      dummyResult
    );
    expect(mockAuthService.validate).toBeCalledTimes(1);
    expect(mockAuthService.authResponse).toBeCalledTimes(1);
  });

  it('should fail', async () => {
    mockAuthService.validate = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    event = {
      type: 'TOKEN',
      methodArn: 'methodArn',
      authorizationToken: 'abcd',
    };
    await expect(auth(event, lambdaContext)).rejects.toBe('Unauthorized');
  });
});
