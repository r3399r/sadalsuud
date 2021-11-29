import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { users } from './users';
import { UsersEvent } from './UsersEvent';

/**
 * Tests of the users lambda function.
 */
describe('users', () => {
  let event: UsersEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      a: '123',
      b: 'abc',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: {
        name: 'name',
        phone: 'phone',
        birthday: 'birthday',
      },
    };

    // prepare mockUserService
    mockUserService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockUserService.addUser = jest.fn(() => dummyResult);
  });

  it('POST should work', async () => {
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
