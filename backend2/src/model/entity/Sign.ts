import { entity, primaryAttribute } from '@y-celestial/service';

export type Sign = {
  id: string;
  name: string;
  phone: string;
  line?: string;
  yearOfBirth: string;
  isSelf: boolean;
  accompany?: boolean;

  status: 'bingo' | 'sorry' | 'pending';
  comment?: string;

  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for Sign
 */
@entity('sign')
export class SignEntity implements Sign {
  @primaryAttribute()
  public id: string;
  public name: string;
  public phone: string;
  public line?: string;
  public yearOfBirth: string;
  public isSelf: boolean;
  public accompany?: boolean;

  public status: 'bingo' | 'sorry' | 'pending';
  public comment?: string;

  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Sign) {
    this.id = input.id;
    this.name = input.name;
    this.phone = input.phone;
    this.line = input.line;
    this.yearOfBirth = input.yearOfBirth;
    this.isSelf = input.isSelf;
    this.accompany = input.accompany;
    this.status = input.status;
    this.comment = input.comment;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}
