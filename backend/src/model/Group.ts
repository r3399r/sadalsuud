import {
  entity,
  primaryAttribute,
  relatedAttributeMany,
  relatedAttributeOne,
} from '@y-celestial/service';
import { ACTION } from 'src/constant/group';
import { Star, StarEntity } from './Star';
import { User, UserEntity } from './User';

export type Group = {
  id: string;
  user: User[];
  star?: Star;
  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for Group
 */
@entity('group')
export class GroupEntity implements Group {
  @primaryAttribute()
  public id: string;
  @relatedAttributeMany()
  public user: User[];
  @relatedAttributeOne()
  public star?: Star;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Group) {
    this.id = input.id;
    this.user = input.user.map((v: User) => new UserEntity(v));
    this.star =
      input.star === undefined ? undefined : new StarEntity(input.star);
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostGroupRequest = {
  userId: string;
  starId?: string;
};

export type PostGroupResponse = Group;

export type GetGroupsResponse = Group[];

export type PatchGroupRequest = {
  action: ACTION;
  userId: string;
};
