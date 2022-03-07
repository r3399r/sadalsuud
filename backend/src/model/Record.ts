import {
  entity,
  primaryAttribute,
  relatedAttributeOne,
} from '@y-celestial/service';
import { Star, StarEntity } from './Star';
import { User, UserEntity } from './User';

export type Record = {
  id: string;
  reporter: User;
  target: Star;
  content: string;
  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for Record
 */
@entity('record')
export class RecordEntity implements Record {
  @primaryAttribute()
  public id: string;
  @relatedAttributeOne()
  public reporter: User;
  @relatedAttributeOne()
  public target: Star;
  public content: string;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Record) {
    this.id = input.id;
    this.reporter = new UserEntity(input.reporter);
    this.target = new StarEntity(input.target);
    this.content = input.content;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostRecordRequest = {
  reporterId: string;
  targetId: string;
  content: string;
};

export type PostRecordResponse = Record;

export type PutRecordRequest = {
  recordId: string;
  reporterId?: string;
  targetId?: string;
  content: string;
};

export type PutRecordResponse = Record;

export type EditRecordData = {
  recordId: string;
  reporter?: User;
  target?: Star;
  content: string;
};
