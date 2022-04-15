import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { login } from './login';

/**
 * Tests of login lambda function
 */
describe('login', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockAuthService: any;
  let dummyResult: any;

  beforeAll(() => {
    dummyResult = { secert: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockAuthService = {};
    bindings.rebind<AuthService>(AuthService).toConstantValue(mockAuthService);

    mockAuthService.login = jest.fn(() => dummyResult);
  });

  describe('/api/login', () => {
    it('POST should work', async () => {
      event = {
        resource: '/api/login',
        httpMethod: 'POST',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(login(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyResult)
      );
      expect(mockAuthService.login).toBeCalledTimes(1);
    });

    it('POST should fail without body', async () => {
      event = {
        resource: '/api/login',
        httpMethod: 'POST',
        headers: null,
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(login(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/login',
        httpMethod: 'XXX',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(login(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(login(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
