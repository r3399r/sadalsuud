import { LambdaContext } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { auth } from './auth';
import { AuthEvent } from './AuthEvent';

/**
 * Tests of the auth lambda function.
 */
describe('variables', () => {
  let event: AuthEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockAuthService: any;

  beforeAll(() => {
    event = {
      type: 'TOKEN',
      methodArn: 'test-arn',
      authorizationToken: 'test-token',
    };
    process.env.sourceArn = 'test-source';
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockUserService
    mockAuthService = {};
    bindings.rebind<AuthService>(AuthService).toConstantValue(mockAuthService);
    mockAuthService.authResponse = jest.fn();
  });

  it('auth should work', async () => {
    mockAuthService.validate = jest.fn();
    await auth(event, lambdaContext);
    expect(mockAuthService.validate).toBeCalledTimes(1);
    expect(mockAuthService.authResponse).toBeCalledWith(true, 'test-source');
  });

  it('auth should fail', async () => {
    mockAuthService.validate = jest.fn(() => Promise.reject('error'));
    await auth(event, lambdaContext);
    expect(mockAuthService.validate).toBeCalledTimes(1);
    expect(mockAuthService.authResponse).toBeCalledWith(false, 'test-source');
  });
});
