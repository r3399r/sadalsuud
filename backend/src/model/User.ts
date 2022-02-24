import { entity, primaryAttribute } from '@y-celestial/service';
import { ROLE, STATUS } from 'src/constant/user';

export type User = {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  status: STATUS;
  role: ROLE;
  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for User
 */
@entity('user')
export class UserEntity implements User {
  @primaryAttribute()
  public id: string;
  public name: string;
  public phone: string;
  public birthday: string;
  public status: STATUS;
  public role: ROLE;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: User) {
    this.id = input.id;
    this.name = input.name;
    this.phone = input.phone;
    this.birthday = input.birthday;
    this.status = input.status;
    this.role = input.role;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostUserRequest = {
  name: string;
  phone: string;
  birthday: string;
};

export type PostUserResponse = User;

export type PutUserRequest = {
  name: string;
  phone: string;
  birthday: string;
};

export type PutUserResponse = User;

export type GetUserResponse = User;

export type GetUsersResponse = (User & { nGroups: number })[];

export type PutUserRoleRequest = { role?: ROLE; status?: STATUS };

export type PutUserRoleResponse = User;
