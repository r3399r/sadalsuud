import {
  entity,
  primaryAttribute,
  relatedAttributeMany,
  relatedAttributeOne,
} from '@y-celestial/service';
import { Group, GroupEntity } from './Group';
import { Sign } from './Sign';
import { Star } from './Star';
import { User, UserEntity } from './User';

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
  joinedGroup?: Group[];
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
  public joinedGroup?: Group[];
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
    this.owner = new UserEntity(input.owner);
    this.joinedGroup = input.joinedGroup?.map((v: Group) => new GroupEntity(v));
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

export type GetTripsResponse =
  | (Omit<Trip, 'joinedGroup'> & {
      volunteer: User[];
      star: Star[];
    })[]
  | (Omit<Trip, 'owner' | 'joinedGroup'> & {
      owner: { id: string; name: string };
      volunteer: { id: string; name: string }[];
      star: { id: string; nickname: string }[];
    })[];

export type GetTripResponse =
  | (Omit<Trip, 'joinedGroup'> & {
      volunteer: User[];
      star: Star[];
    })
  | (Omit<Trip, 'owner' | 'joinedGroup'> & {
      owner: { id: string; name: string };
      volunteer: { id: string; name: string }[];
      star: { id: string; nickname: string }[];
    });

export type VerifyTripRequest = {
  expiredDatetime: number;
};

export type VerifyTripResponse = Trip;

export type ReviseTripRequest = Pick<
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

export type ReviseTripResponse = Trip;

export type SetTripMemberRequest = {
  groupId: string[];
};

export type SetTripMemberResponse = Trip;

export type SignTripRequest = {
  groupId: string;
};

export type SignTripResponse = Sign;

export type GetSignResponse = Sign[];
