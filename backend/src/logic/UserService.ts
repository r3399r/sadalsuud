import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { ROLE } from 'src/constant/User';
import { PostUserRequest, PostUserResponse, User } from 'src/model/User';
import { UserEntity } from 'src/model/UserEntity';
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

    await this.dbService.createItem(ALIAS, user);

    return user;
  }

  public async getUsers() {
    return await this.dbService.getItems<User>(ALIAS, 'user');
  }

  public async getUserById(id: string) {
    return await this.dbService.getItem<User>(ALIAS, 'user', id);
  }

  public async getUserRoleByToken(token: string) {
    const lineUser = await this.lineService.getProfile(token);
    const user = await this.dbService.getItem<User>(
      ALIAS,
      'user',
      lineUser.userId
    );

    return user.role;
  }
}
