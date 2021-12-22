import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { ERROR_CODE } from 'src/constant/error';
import { Group, GroupEntity, PostGroupRequest } from 'src/model/Group';
import { StarEntity } from 'src/model/Star';
import { User, UserEntity } from 'src/model/User';
import { v4 as uuidv4 } from 'uuid';
import { StarService } from './StarService';
import { UserService } from './UserService';

/**
 * Service class for CRUD groups
 */
@injectable()
export class GroupService {
  private groups: Group[] | undefined;
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  @inject(StarService)
  private readonly starService!: StarService;

  public async createGroup(body: PostGroupRequest) {
    if (
      body.starId !== undefined &&
      (await this.starExistsInSomeGroup(body.starId))
    )
      throw new Error(ERROR_CODE.DUPLICATED_GROUP_OF_STAR);
    if (
      body.starId === undefined &&
      (await this.userHasIndividualGroup(body.userId))
    )
      throw new Error(ERROR_CODE.DUPLICATED_GROUP_OF_USER);
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
    this.groups = undefined;

    return group;
  }

  public async getGroups() {
    try {
      if (this.groups === undefined)
        this.groups = await this.dbService.getItems<Group>(ALIAS, 'group');
    } catch (e) {
      this.groups = [];
    }

    return this.groups;
  }

  private async userHasIndividualGroup(userId: string) {
    const groups = await this.getGroups();
    let res: boolean = false;
    groups.forEach((o: Group) => {
      const user = o.user.find((v: User) => v.id === userId);
      if (user !== undefined && o.star === undefined) res = true;
    });

    return res;
  }

  private async starExistsInSomeGroup(starId: string) {
    const groups = await this.getGroups();
    let res: boolean = false;
    groups.find((o: Group) => {
      if (o.star !== undefined && o.star.id === starId) res = true;
    });

    return res;
  }
}
