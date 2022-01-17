import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ERROR_CODE } from 'src/constant/error';
import { ACTION } from 'src/constant/group';
import { ROLE } from 'src/constant/User';
import {
  Group,
  GroupEntity,
  PatchGroupRequest,
  PostGroupRequest,
} from 'src/model/Group';
import { User } from 'src/model/User';
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

  public async validateRole(token: string, specificRole: ROLE[]) {
    await this.userService.validateRole(token, specificRole);
  }

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
      user: [user],
      star,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(group);
    this.groups = undefined;

    return group;
  }

  public async getGroups() {
    try {
      if (this.groups === undefined)
        this.groups = await this.dbService.getItems<Group>('group');
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

  public async updateGroupMembers(id: string, body: PatchGroupRequest) {
    const group = await this.dbService.getItem<Group>('group', id);
    if (group.star === undefined)
      throw new Error(ERROR_CODE.GROUP_SHOULD_HAVE_STAR);

    switch (body.action) {
      case ACTION.ADD:
        if (group.user.findIndex((v: User) => v.id === body.userId) >= 0)
          throw new Error(ERROR_CODE.USER_EXISTS);
        const user = await this.userService.getUserById(body.userId);

        const newGroup = new GroupEntity({
          id: group.id,
          user: [...group.user, user],
          star: group.star,
          dateCreated: group.dateCreated,
          dateUpdated: Date.now(),
        });
        await this.dbService.putItem(newGroup);
        break;
      case ACTION.REMOVE:
        if (group.user.findIndex((v: User) => v.id === body.userId) < 0)
          throw new Error(ERROR_CODE.USER_NOT_EXIST);
        if (group.user.length > 1) {
          const updatedGroup = new GroupEntity({
            id: group.id,
            user: group.user.filter((v: User) => v.id !== body.userId),
            star: group.star,
            dateCreated: group.dateCreated,
            dateUpdated: Date.now(),
          });
          await this.dbService.putItem(updatedGroup);
        } else await this.dbService.deleteItem('group', group.id);
        break;
      default:
        throw new Error(ERROR_CODE.UNEXPECTED_ACTION);
    }

    this.groups = undefined;
  }
}
