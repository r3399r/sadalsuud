import { entity, primaryAttribute } from '@y-celestial/service';
import {
  relatedAttributeMany,
  relatedAttributeOne,
} from '@y-celestial/service/lib/src/util/DbHelper';
import { Star } from './Star';
import { User } from './User';

type Fee = { what: string; cost: number };

export type Trip = {
  id: string;
  verified: boolean;
  needAccompany: boolean;
  startDatetime: number;
  endDatetime: number;
  place: string;
  meetPlace: string;
  dismissPlace: string;
  fee: Fee[];
  briefDesc: string;
  detailDesc: string;
  expiredDatetime: number | null;
  owner: User;
  participant: User[];
  star: Star[];
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
  public verified: boolean;
  public needAccompany: boolean;
  public startDatetime: number;
  public endDatetime: number;
  public place: string;
  public meetPlace: string;
  public dismissPlace: string;
  public fee: Fee[];
  public briefDesc: string;
  public detailDesc: string;
  public expiredDatetime: number | null;
  @relatedAttributeOne()
  public owner: User;
  @relatedAttributeMany()
  public participant: User[];
  @relatedAttributeMany()
  public star: Star[];
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Trip) {
    this.id = input.id;
    this.verified = input.verified;
    this.needAccompany = input.needAccompany;
    this.startDatetime = input.startDatetime;
    this.endDatetime = input.endDatetime;
    this.place = input.place;
    this.meetPlace = input.meetPlace;
    this.dismissPlace = input.dismissPlace;
    this.fee = input.fee;
    this.briefDesc = input.briefDesc;
    this.detailDesc = input.detailDesc;
    this.expiredDatetime = input.expiredDatetime;
    this.owner = input.owner;
    this.participant = input.participant;
    this.star = input.star;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostTripRequest = Pick<
  Trip,
  | 'needAccompany'
  | 'startDatetime'
  | 'endDatetime'
  | 'place'
  | 'meetPlace'
  | 'dismissPlace'
  | 'fee'
  | 'briefDesc'
  | 'detailDesc'
>;

export type PostTripResponse = Trip;

export type GetTripResponse =
  | Trip[]
  | (Omit<Trip, 'owner' | 'participant' | 'star'> & {
      owner: Pick<User, 'id' | 'name'>;
      participant: Pick<User, 'id' | 'name'>[];
      star: Pick<Star, 'id' | 'nickname'>[];
    })[];
