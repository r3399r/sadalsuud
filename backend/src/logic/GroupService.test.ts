import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ACTION } from 'src/constant/group';
import { ROLE } from 'src/constant/role';
import { Group } from 'src/model/Group';
import { Star } from 'src/model/Star';
import { User } from 'src/model/User';
import { GroupService } from './GroupService';
import { StarService } from './StarService';
import { UserService } from './UserService';

/**
 * Tests of the GroupService class.
 */
describe('GroupService', () => {
  let groupService: GroupService;
  let mockDbService: any;
  let mockUserService: any;
  let mockStarService: any;
  let dummyUser: User;
  let dummyUser2: User;
  let dummyStar: Star;
  let dummyGroup: Group;

  beforeAll(() => {
    dummyUser = {
      id: 'user-id',
      name: 'name',
      phone: 'phone',
      birthday: '1111/11/11',
      verified: false,
      role: ROLE.ADMIN,
      dateCreated: 123,
      dateUpdated: 123,
    };
    dummyUser2 = { ...dummyUser, id: 'user-id2' };
    dummyStar = {
      id: 'star-id',
      name: 'star',
      nickname: 'ss',
      birthday: '2222/11/11',
      dateCreated: 321,
      dateUpdated: 321,
    };
    dummyGroup = {
      id: 'group-id',
      user: [dummyUser],
      star: dummyStar,
      dateCreated: 111,
      dateUpdated: 222,
    };
  });

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    mockStarService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);

    mockDbService.createItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummyGroup);
    mockDbService.getItems = jest.fn(() => [dummyGroup]);
    mockDbService.putItem = jest.fn();
    mockDbService.deleteItem = jest.fn();
    mockUserService.validateRole = jest.fn();
    mockUserService.getUserById = jest.fn(() => dummyUser);
    mockStarService.getStar = jest.fn(() => dummyStar);

    groupService = bindings.get<GroupService>(GroupService);
  });

  it('validateRole should wrok', async () => {
    await groupService.validateRole('token', [ROLE.ADMIN]);
    expect(mockUserService.validateRole).toBeCalledTimes(1);
  });

  it('createGroup should work', async () => {
    await groupService.createGroup({
      userId: 'test-user-id',
      starId: 'test-star-id',
    });
    expect(mockDbService.createItem).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockStarService.getStar).toBeCalledTimes(1);
  });

  it('createGroup should work without star', async () => {
    await groupService.createGroup({
      userId: 'test-user-id',
    });
    expect(mockDbService.createItem).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockStarService.getStar).toBeCalledTimes(0);
  });

  it('createGroup should throw error if user exists', async () => {
    mockDbService.getItems = jest.fn(() => [
      { ...dummyGroup, star: undefined },
    ]);
    await expect(() =>
      groupService.createGroup({
        userId: 'user-id',
      })
    ).rejects.toThrowError('volunteer user already exists');
  });

  it('createGroup should throw error if star exists', async () => {
    await expect(() =>
      groupService.createGroup({
        userId: 'test-id',
        starId: 'star-id',
      })
    ).rejects.toThrowError('star already in one of existing group');
  });

  it('getGroups should work', async () => {
    await groupService.getGroups();
    expect(mockDbService.getItems).toBeCalledTimes(1);
  });

  it('getGroups should return [] when error', async () => {
    mockDbService.getItems = jest.fn(() => []);
    expect(await groupService.getGroups()).toStrictEqual([]);
  });

  it('updateGroupMembers should work with ADD', async () => {
    await groupService.updateGroupMembers('group-id', {
      action: ACTION.ADD,
      userId: 'user-id-2',
    });
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
    expect(mockDbService.deleteItem).toBeCalledTimes(0);
  });

  it('updateGroupMembers should fail with ADD if user already exist', async () => {
    await expect(() =>
      groupService.updateGroupMembers('group-id', {
        action: ACTION.ADD,
        userId: 'user-id',
      })
    ).rejects.toThrowError('user already exists');
  });

  it('updateGroupMembers should work with REMOVE and delete group', async () => {
    await groupService.updateGroupMembers('group-id', {
      action: ACTION.REMOVE,
      userId: 'user-id',
    });
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(0);
    expect(mockDbService.deleteItem).toBeCalledTimes(1);
  });

  it('updateGroupMembers should work with REMOVE and update group', async () => {
    mockDbService.getItem = jest.fn(() => ({
      id: 'group-id',
      user: [dummyUser, dummyUser2],
      star: dummyStar,
      dateCreated: 111,
      dateUpdated: 222,
    }));
    await groupService.updateGroupMembers('group-id', {
      action: ACTION.REMOVE,
      userId: 'user-id',
    });
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
    expect(mockDbService.deleteItem).toBeCalledTimes(0);
  });

  it('updateGroupMembers should fail with REMOVE if user not exist', async () => {
    await expect(() =>
      groupService.updateGroupMembers('group-id', {
        action: ACTION.REMOVE,
        userId: 'user-id-2',
      })
    ).rejects.toThrowError('user does not exist in this group');
  });

  it('updateGroupMembers should fail if no star', async () => {
    mockDbService.getItem = jest.fn(() => ({
      id: 'group-id',
      user: [dummyUser, dummyUser2],
      dateCreated: 111,
      dateUpdated: 222,
    }));
    await expect(() =>
      groupService.updateGroupMembers('group-id', {
        action: ACTION.REMOVE,
        userId: 'user-id-2',
      })
    ).rejects.toThrowError('input group should be a star-group');
  });

  it('updateGroupMembers should fail if action does not support', async () => {
    await expect(() =>
      groupService.updateGroupMembers('group-id', {
        action: 'not-support' as ACTION,
        userId: 'user-id-2',
      })
    ).rejects.toThrowError('Internal Server Error');
  });
});
