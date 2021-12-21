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
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
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
    };
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockGroupService.createGroup).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(groups(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
