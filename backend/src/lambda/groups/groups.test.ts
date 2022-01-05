import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { GroupService } from 'src/logic/GroupService';
import { UserService } from 'src/logic/UserService';
import { groups } from './groups';
import { GroupsEvent } from './GroupsEvent';

/**
 * Tests of groups lambda function
 */
describe('groups', () => {
  let event: GroupsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;
  let mockGroupService: any;
  let dummyGroup: any;

  beforeAll(() => {
    dummyGroup = { id: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockUserService = {};
    mockGroupService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings
      .rebind<GroupService>(GroupService)
      .toConstantValue(mockGroupService);

    mockUserService.validateRole = jest.fn();
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
      errorOutput(new Error('null body error'))
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
      errorOutput(new Error('null body error'))
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
      errorOutput(new Error('group id is required'))
    );
    expect(mockGroupService.updateGroupMembers).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});