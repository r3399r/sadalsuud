import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ERROR_CODE } from 'src/constant/error';
import { UserService } from 'src/logic/UserService';
import { me } from './me';
import { MeEvent } from './MeEvent';

/**
 * Tests of the me lambda function.
 */
describe('me', () => {
  let event: MeEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      b: 'abc',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mockUserService
    mockUserService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockUserService.getUserByToken = jest.fn(() => dummyResult);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
    };
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
    expect(mockUserService.getUserByToken).toBeCalledTimes(1);
    expect(mockUserService.getUserByToken).toBeCalledWith('test-token');
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error(ERROR_CODE.UNKNOWN_HTTP_METHOD))
    );
  });
});
