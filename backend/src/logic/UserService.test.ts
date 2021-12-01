import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { LineService } from './LineService';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', () => {
  let userService: UserService;
  let mockLineService: any;
  let mockDbService: any;
  let dummyUser: any;

  beforeAll(() => {
    dummyUser = { role: ROLE.PASSERBY };
  });

  beforeEach(() => {
    // prepare mockLineService
    mockLineService = {};
    bindings.rebind<LineService>(LineService).toConstantValue(mockLineService);

    mockLineService.getProfile = jest.fn(() => ({ userId: 'userId' }));

    // prepare mockDbService
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummyUser);
    mockDbService.getItems = jest.fn(() => [dummyUser]);

    userService = bindings.get<UserService>(UserService);
  });

  it('addUser should work', async () => {
    await userService.addUser('test-token', {
      name: 'name',
      phone: 'phone',
      birthday: 'birthday',
    });
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });

  it('getUsers should work', async () => {
    await userService.getUsers();
    expect(mockDbService.getItems).toBeCalledTimes(1);
  });

  it('getUsers should work', async () => {
    await userService.getUserById('id');
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });

  it('getUserRoleByToken should work', async () => {
    await userService.getUserRoleByToken('token');
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });
});
