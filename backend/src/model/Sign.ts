import {
  entity,
  primaryAttribute,
  relatedAttributeOne,
} from '@y-celestial/service';
import { Group, GroupEntity } from './Group';
import { Trip, TripEntity } from './Trip';

export enum SignResult {
  PENDING = 'pending',
  YES = 'yes',
  NO = 'no',
}

export type Sign = {
  id: string;
  trip: Trip;
  group: Group;
  result: SignResult;
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
  @relatedAttributeOne()
  public trip: Trip;
  @relatedAttributeOne()
  public group: Group;
  public result: SignResult;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Sign) {
    this.id = input.id;
    this.trip = new TripEntity(input.trip);
    this.group = new GroupEntity(input.group);
    this.result = input.result;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}
