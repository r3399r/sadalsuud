import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { GroupEntity, PostGroupRequest } from 'src/model/Group';
import { StarEntity } from 'src/model/Star';
import { UserEntity } from 'src/model/User';
import { v4 as uuidv4 } from 'uuid';
import { StarService } from './StarService';
import { UserService } from './UserService';

/**
 * Service class for CRUD groups
 */
@injectable()
export class GroupService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  @inject(StarService)
  private readonly starService!: StarService;

  public async createGroup(body: PostGroupRequest) {
    const user = await this.userService.getUserById(body.userId);
    const star =
      body.starId === undefined
        ? undefined
        : await this.starService.getStar(body.starId);

    const group = new GroupEntity({
      id: uuidv4(),
      user: [new UserEntity(user)],
      star: star === undefined ? undefined : new StarEntity(star),
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(ALIAS, group);

    return group;
  }
}
