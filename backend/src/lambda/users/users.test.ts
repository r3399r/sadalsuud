import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
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
  let dummyUser: any;

  beforeAll(() => {
    dummyUser = { role: ROLE.ADMIN };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mockUserService
    mockUserService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockUserService.addUser = jest.fn(() => dummyUser);
    mockUserService.updateUser = jest.fn(() => dummyUser);
    mockUserService.updateRole = jest.fn(() => dummyUser);
    mockUserService.getUserById = jest.fn(() => dummyUser);
    mockUserService.getUsers = jest.fn(() => [dummyUser]);
    mockUserService.getUserByToken = jest.fn(() => dummyUser);
    mockUserService.validateRole = jest.fn();
  });

  it('POST should work', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyUser)
    );
    expect(mockUserService.addUser).toBeCalledTimes(1);
  });

  it('POST should fail if null body', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockUserService.addUser).toBeCalledTimes(0);
  });

  it('PUT should work', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyUser)
    );
    expect(mockUserService.updateUser).toBeCalledTimes(1);
  });

  it('PUT should fail if null body', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockUserService.updateUser).toBeCalledTimes(0);
  });

  it('PUT /users/{id}/role should work', async () => {
    event = {
      resource: '/api/users/{id}/role',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyUser)
    );
    expect(mockUserService.updateRole).toBeCalledTimes(1);
  });

  it('PUT /users/{id}/role should fail if resource is wrong', async () => {
    event = {
      resource: '/api/users/{id}/xxx',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('non-support resource'))
    );
  });

  it('GET should work with all users', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyUser])
    );
    expect(mockUserService.getUsers).toBeCalledTimes(1);
  });

  it('GET should work with id', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'test-id' },
    };
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyUser)
    );
    expect(mockUserService.getUserById).toBeCalledTimes(1);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
