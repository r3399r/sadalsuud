import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { GroupService } from 'src/logic/GroupService';
import { groups } from './groups';
import { GroupsEvent } from './GroupsEvent';

/**
 * Tests of groups lambda function
 */
describe('groups', () => {
  let event: GroupsEvent;
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

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyGroup)
    );
    expect(mockGroupService.createGroup).toBeCalledTimes(1);
  });

  it('POST should fail if null body', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('body should not be empty'))
    );
    expect(mockGroupService.createGroup).toBeCalledTimes(0);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyGroup])
    );
    expect(mockGroupService.getGroups).toBeCalledTimes(1);
  });

  it('PATCH should work', async () => {
    event = {
      httpMethod: 'PATCH',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'test-id' },
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(undefined)
    );
    expect(mockGroupService.updateGroupMembers).toBeCalledTimes(1);
  });

  it('PATCH should fail if null body', async () => {
    event = {
      httpMethod: 'PATCH',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'test-id' },
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('body should not be empty'))
    );
    expect(mockGroupService.updateGroupMembers).toBeCalledTimes(0);
  });

  it('PATCH should fail if null pathparameter', async () => {
    event = {
      httpMethod: 'PATCH',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('group id is required'))
    );
    expect(mockGroupService.updateGroupMembers).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown http method'))
    );
  });
});
