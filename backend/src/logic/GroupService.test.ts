import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
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
  let dummyStar: Star;

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
    dummyStar = {
      id: 'star-id',
      name: 'star',
      nickname: 'ss',
      birthday: '2222/11/11',
      dateCreated: 321,
      dateUpdated: 321,
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
    mockDbService.getItems = jest.fn();
    mockUserService.getUserById = jest.fn(() => dummyUser);
    mockStarService.getStar = jest.fn(() => dummyStar);

    groupService = bindings.get<GroupService>(GroupService);
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

  it('getGroups should work', async () => {
    await groupService.getGroups();
    expect(mockDbService.getItems).toBeCalledTimes(1);
  });
});
