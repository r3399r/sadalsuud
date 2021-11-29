import { entity, primaryAttribute } from '@y-celestial/service';
import { ROLE } from 'src/constant/User';
import { User } from './User';

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
  public verified: boolean;
  public role: ROLE;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: User) {
    this.id = input.id;
    this.name = input.name;
    this.phone = input.phone;
    this.birthday = input.birthday;
    this.verified = input.verified;
    this.role = input.role;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}
