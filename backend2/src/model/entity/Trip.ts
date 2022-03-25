import {
  entity,
  primaryAttribute,
  relatedAttributeMany,
} from '@y-celestial/service';
import { Sign, SignEntity } from './Sign';

export type Trip = {
  id: string;
  topic: string;
  ad: string;
  content: string;
  date: string;
  region: string;
  meetTime: string;
  meetPlace: string;
  dismissTime: string;
  dismissPlace: string;
  fee: number;
  other?: string;

  ownerName: string;
  ownerPhone: string;
  ownerLine?: string;

  code: string;
  status: 'pending' | 'pass' | 'reject';

  sign: Sign[];

  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for Trip
 */
@entity('trip')
export class TripEntity implements Trip {
  @primaryAttribute()
  public id: string;
  public topic: string;
  public ad: string;
  public content: string;
  public date: string;
  public region: string;
  public meetTime: string;
  public meetPlace: string;
  public dismissTime: string;
  public dismissPlace: string;
  public fee: number;
  public other?: string;

  public ownerName: string;
  public ownerPhone: string;
  public ownerLine?: string;

  public code: string;
  public status: 'pending' | 'pass' | 'reject';

  @relatedAttributeMany()
  public sign: Sign[];

  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Trip) {
    this.id = input.id;
    this.topic = input.topic;
    this.ad = input.ad;
    this.content = input.content;
    this.date = input.date;
    this.region = input.region;
    this.meetTime = input.meetTime;
    this.meetPlace = input.meetPlace;
    this.dismissTime = input.dismissTime;
    this.dismissPlace = input.dismissPlace;
    this.fee = input.fee;
    this.other = input.other;
    this.ownerName = input.ownerName;
    this.ownerPhone = input.ownerPhone;
    this.ownerLine = input.ownerLine;
    this.code = input.code;
    this.status = input.status;
    this.sign = input.sign.map((v) => new SignEntity(v));
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}
