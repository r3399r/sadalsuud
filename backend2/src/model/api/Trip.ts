import { Period, Status } from 'src/constant/Trip';
import { Sign } from 'src/model/entity/Sign';

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
  period: Period;
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

type GetTripsIdPassResponse = {
  status: Status.Pass;
  content: string;
  meetTime: string;
  meetPlace: string;
  dismissTime: string;
  dismissPlace: string;
  fee: number;
  other?: string;
};

type GetTripsIdPendingResponse = {
  status: Status.Pending;
};

type GetTripsIdRejectResponse = {
  status: Status.Reject;
  reason?: string;
};

export type GetTripsIdResponse = (
  | GetTripsIdPassResponse
  | GetTripsIdPendingResponse
  | GetTripsIdRejectResponse
) & {
  id: string;
  topic: string;
  date: string;
  ownerName: string;
  dateCreated?: number;
  dateUpdated?: number;
};

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
