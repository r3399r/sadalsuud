import {
  BadRequestError,
  ConflictError,
  DbService,
  InternalServerError,
} from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ACTION } from 'src/constant/group';
import { ROLE } from 'src/constant/role';
import {
  Group,
  GroupEntity,
  PatchGroupRequest,
  PostGroupRequest,
} from 'src/model/Group';
import { Star } from 'src/model/Star';
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
      throw new ConflictError('star already in one of existing group');
    if (
      body.starId === undefined &&
      (await this.userHasIndividualGroup(body.userId))
    )
      throw new ConflictError('volunteer user already exists');
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
    if (this.groups === undefined)
      this.groups = await this.dbService.getItems<Group>('group');

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
      throw new BadRequestError('input group should be a star-group');

    switch (body.action) {
      case ACTION.ADD:
        if (group.user.findIndex((v: User) => v.id === body.userId) >= 0)
          throw new ConflictError('user already exists');
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
          throw new ConflictError('user does not exist in this group');
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
        throw new InternalServerError();
    }

    this.groups = undefined;
  }

  public static convertGroup(groups: Group[]) {
    const volunteer: User[] = [];
    const star: Star[] = [];
    groups.forEach((group: Group) => {
      if (group.star === undefined) volunteer.push(group.user[0]);
      else star.push(group.star);
    });

    return { volunteer, star };
  }
}
