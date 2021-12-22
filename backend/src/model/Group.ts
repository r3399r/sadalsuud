import { entity, primaryAttribute } from '@y-celestial/service';
import {
  relatedAttributeMany,
  relatedAttributeOne,
} from '@y-celestial/service/lib/src/util/DbHelper';
import { Star } from './Star';
import { User } from './User';

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
    this.user = input.user;
    this.star = input.star;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostGroupRequest = {
  userId: string;
  starId?: string;
};

export type PostGroupResponse = Group;

export type GetGroupResponse = Group[];
