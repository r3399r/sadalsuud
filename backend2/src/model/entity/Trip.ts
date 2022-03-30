import {
  entity,
  primaryAttribute,
  relatedAttributeMany,
} from '@y-celestial/service';

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
  expiredDate?: string;
  notifyDate?: string;
  reason?: string;

  signId?: string[];

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
  public expiredDate?: string;
  public notifyDate?: string;
  public reason?: string;

  @relatedAttributeMany('sign')
  public signId?: string[];

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
    this.expiredDate = input.expiredDate;
    this.notifyDate = input.notifyDate;
    this.reason = input.reason;
    this.signId = input.signId;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}
