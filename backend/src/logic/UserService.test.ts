import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE, STATUS } from 'src/constant/user';
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
    dummyUser = { role: ROLE.PASSERBY, phone: 'phone' };
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
    mockDbService.putItem = jest.fn();
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

  it('updateUser should work if phone updated', async () => {
    await userService.updateUser('test-token', {
      name: 'name',
      phone: 'new-phone',
      birthday: 'birthday',
    });
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('updateUser should work if phone not updated', async () => {
    await userService.updateUser('test-token', {
      name: 'name',
      phone: 'phone',
      birthday: 'birthday',
    });
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
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
    await userService.getUserByToken('token');
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });

  it('validateRole should work', async () => {
    await userService.validateRole('token', [ROLE.PASSERBY]);
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });

  it('validateRole should fail', async () => {
    await expect(
      userService.validateRole('token', [ROLE.ROOKIE])
    ).rejects.toThrowError('permission denied');
    expect(mockLineService.getProfile).toBeCalledTimes(1);
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });

  it('updateUserStatus should work', async () => {
    await userService.updateUserStatus('test-id', {
      status: STATUS.WRONG_PHONE,
    });
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('updateUserStatus should work if role is PASSERBY', async () => {
    await userService.updateUserStatus('test-id', { role: ROLE.PASSERBY });
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
