import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/user';
import { UserService } from 'src/logic/UserService';
import { users } from './users';

/**
 * Tests of the users lambda function.
 */
describe('users', () => {
  let event: LambdaEvent;
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
    mockUserService.updateUserStatus = jest.fn(() => dummyUser);
    mockUserService.getUserById = jest.fn(() => dummyUser);
    mockUserService.getUsers = jest.fn(() => [dummyUser]);
    mockUserService.getUserByToken = jest.fn(() => dummyUser);
    mockUserService.validateRole = jest.fn();
  });

  describe('/api/users', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummyUser])
      );
      expect(mockUserService.getUsers).toBeCalledTimes(1);
    });

    it('POST should work', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyUser)
      );
      expect(mockUserService.addUser).toBeCalledTimes(1);
    });

    it('POST should fail if null body', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
      expect(mockUserService.addUser).toBeCalledTimes(0);
    });

    it('PUT should work', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyUser)
      );
      expect(mockUserService.updateUser).toBeCalledTimes(1);
    });

    it('PUT should fail if null body', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
      expect(mockUserService.updateUser).toBeCalledTimes(0);
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/users',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/users/{id}', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/users/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'test-id' },
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyUser)
      );
      expect(mockUserService.getUserById).toBeCalledTimes(1);
    });

    it('GET should fail if null pathparameter', async () => {
      event = {
        resource: '/api/users/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('user id is required'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/users/{id}',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'test-id' },
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/users/{id}/status', () => {
    it('PUT should work', async () => {
      event = {
        resource: '/api/users/{id}/status',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyUser)
      );
      expect(mockUserService.updateUserStatus).toBeCalledTimes(1);
    });

    it('PUT should fail if null body', async () => {
      event = {
        resource: '/api/users/{id}/status',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('PUT should fail if null pathparameter', async () => {
      event = {
        resource: '/api/users/{id}/status',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('user id is required'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/users/{id}/status',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(users(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(users(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
