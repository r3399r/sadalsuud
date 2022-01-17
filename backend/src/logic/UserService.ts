import { DbService, UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ROLE } from 'src/constant/role';
import {
  PostUserRequest,
  PostUserResponse,
  PutUserRequest,
  PutUserResponse,
  PutUserRoleRequest,
  User,
  UserEntity,
} from 'src/model/User';
import { LineService } from './LineService';

/**
 * Service class for CRUD users
 */
@injectable()
export class UserService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(LineService)
  private readonly lineService!: LineService;

  public async addUser(
    token: string,
    body: PostUserRequest
  ): Promise<PostUserResponse> {
    const lineUser = await this.lineService.getProfile(token);

    const user = new UserEntity({
      id: lineUser.userId,
      name: body.name,
      phone: body.phone,
      birthday: body.birthday,
      verified: false,
      role: ROLE.PASSERBY,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(user);

    return user;
  }

  public async updateUser(
    token: string,
    body: PutUserRequest
  ): Promise<PutUserResponse> {
    const oldUser = await this.getUserByToken(token);

    const newUser = new UserEntity({
      id: oldUser.id,
      name: body.name,
      phone: body.phone,
      birthday: body.birthday,
      verified: oldUser.phone === body.phone ? oldUser.verified : false,
      role: oldUser.role,
      dateCreated: oldUser.dateCreated,
      dateUpdated: Date.now(),
    });

    await this.dbService.putItem(newUser);

    return newUser;
  }

  public async getUsers() {
    return await this.dbService.getItems<User>('user');
  }

  public async getUserById(id: string) {
    return await this.dbService.getItem<User>('user', id);
  }

  public async getUserByToken(token: string) {
    const lineUser = await this.lineService.getProfile(token);

    return await this.dbService.getItem<User>('user', lineUser.userId);
  }

  public async validateRole(token: string, specificRole: ROLE[]) {
    const user = await this.getUserByToken(token);
    if (specificRole.includes(user.role)) return user;
    throw new UnauthorizedError('permission denied');
  }

  public async updateRole(id: string, body: PutUserRoleRequest) {
    const oldUser = await this.getUserById(id);

    const newUser = new UserEntity({
      id: oldUser.id,
      name: oldUser.name,
      phone: oldUser.phone,
      birthday: oldUser.birthday,
      verified: body.role === ROLE.PASSERBY ? false : true,
      role: body.role,
      dateCreated: oldUser.dateCreated,
      dateUpdated: Date.now(),
    });

    await this.dbService.putItem(newUser);

    return newUser;
  }
}
