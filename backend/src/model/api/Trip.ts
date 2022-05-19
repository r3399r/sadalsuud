import { Status } from 'src/constant/Trip';
import { Sign } from 'src/model/entity/Sign';
import { Trip } from 'src/model/entity/Trip';

export type PostTripsRequest = {
  ownerName: string;
  ownerPhone: string;
  ownerLine?: string;
  date: string;
  region: string;
  meetTime: string;
  meetPlace: string;
  dismissTime: string;
  dismissPlace: string;
  topic: string;
  ad: string;
  content: string;
  fee: number;
  other?: string;
};

type GetTripsPassResponse = {
  status: Status.Pass;
  ad: string;
  meetTime: string;
  dismissTime: string;
  region: string;
  fee: number;
  other?: string;
  expiredDate?: string;
  notifyDate?: string;
};

type GetTripsPendingResponse = {
  status: Status.Pending;
};

type GetTripsRejectResponse = {
  status: Status.Reject;
  reason?: string;
};

export type GetTripsResponse = ((
  | GetTripsPassResponse
  | GetTripsPendingResponse
  | GetTripsRejectResponse
) & {
  id: string;
  topic: string;
  date: string;
  ownerName: string;
  dateCreated?: number;
  dateUpdated?: number;
})[];

export type GetTripsDetailResponse = {
  id: string;
  topic: string;
  date: string;
  ownerName: string;
  ownerPhone: string;
  ownerLine?: string;
  code: string;
  status: 'pending' | 'pass' | 'reject';
  signs: number;
  dateCreated?: number;
  dateUpdated?: number;
}[];

export type PutTripsSignRequest = {
  forWho: 'self' | 'kid';
  phone: string;
  line?: string;
  name: string;
  yearOfBirth: string;
  accompany?: 'yes' | 'no';
};

export type GetTripsIdResponse = {
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
  status: 'pass' | 'pending' | 'reject';
  dateCreated?: number;
  dateUpdated?: number;
};

export type PutTripsIdRequest = {
  topic: string;
  ad: string;
  content: string;
  date: string;
  meetTime: string;
  dismissTime: string;
  region: string;
  meetPlace: string;
  dismissPlace: string;
  fee: number;
  other?: string;
};

export type PutTripsIdResponse = Trip;

export type PutTripsIdVerifyRequest =
  | {
      pass: 'yes';
      expiredDate: string;
      notifyDate: string;
    }
  | {
      pass: 'no';
      reason: string;
    };

export type GetTripsIdSign = Sign[];

export type PutTripsIdMember = {
  signId: string[];
};
