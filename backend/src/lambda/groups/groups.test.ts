import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { GroupService } from 'src/logic/GroupService';
import { groups } from './groups';

/**
 * Tests of groups lambda function
 */
describe('groups', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockGroupService: any;
  let dummyGroup: any;

  beforeAll(() => {
    dummyGroup = { id: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockGroupService = {};
    bindings
      .rebind<GroupService>(GroupService)
      .toConstantValue(mockGroupService);

    mockGroupService.validateRole = jest.fn();
    mockGroupService.createGroup = jest.fn(() => dummyGroup);
    mockGroupService.getGroups = jest.fn(() => [dummyGroup]);
    mockGroupService.updateGroupMembers = jest.fn();
  });

  describe('/api/groups', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/groups',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummyGroup])
      );
      expect(mockGroupService.getGroups).toBeCalledTimes(1);
    });

    it('POST should work', async () => {
      event = {
        resource: '/api/groups',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyGroup)
      );
      expect(mockGroupService.createGroup).toBeCalledTimes(1);
    });

    it('POST should fail if null body', async () => {
      event = {
        resource: '/api/groups',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
      expect(mockGroupService.createGroup).toBeCalledTimes(0);
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/groups',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/groups/{id}', () => {
    it('PATCH should work', async () => {
      event = {
        resource: '/api/groups/{id}',
        httpMethod: 'PATCH',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'test-id' },
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockGroupService.updateGroupMembers).toBeCalledTimes(1);
    });

    it('PATCH should fail if null body', async () => {
      event = {
        resource: '/api/groups/{id}',
        httpMethod: 'PATCH',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'test-id' },
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
      expect(mockGroupService.updateGroupMembers).toBeCalledTimes(0);
    });

    it('PATCH should fail if null pathparameter', async () => {
      event = {
        resource: '/api/groups/{id}',
        httpMethod: 'PATCH',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        queryStringParameters: null,
        pathParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('group id is required'))
      );
      expect(mockGroupService.updateGroupMembers).toBeCalledTimes(0);
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/groups/{id}',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
