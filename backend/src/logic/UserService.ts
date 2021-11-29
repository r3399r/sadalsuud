import { DbService, generateData } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { ROLE } from 'src/constant/User';
import { PostUserRequest, PostUserResponse } from 'src/model/User';
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

    const userRecord = generateData(user, ALIAS);
    await this.dbService.createItem(userRecord);

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      birthday: user.birthday,
      verified: user.verified,
      role: user.role,
    };
  }
}
