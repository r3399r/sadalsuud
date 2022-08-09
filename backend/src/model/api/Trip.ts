import { Status } from 'src/constant/Trip';
import { Sign } from 'src/model/entity/Sign';

export type PostTripsRequest = {
  ownerName: string;
  ownerPhone: string;
  ownerLine?: string;
  region: string;
  date: string;
  meetDate: string;
  meetPlace: string;
  dismissDate: string;
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
  meetDate: string;
  dismissDate: string;
  region: string;
  fee: number;
  other: string | null;
  expiredDate: string | null;
  notifyDate: string | null;
};

type GetTripsPendingResponse = {
  status: Status.Pending;
};

type GetTripsRejectResponse = {
  status: Status.Reject;
  reason: string | null;
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
  dateCreated: string;
  dateUpdated: string | null;
})[];

export type GetTripsDetailResponse = {
  id: string;
  topic: string;
  date: string;
  ownerName: string;
  ownerPhone: string;
  ownerLine: string | null;
  code: string;
  status: Status;
  signs: number;
  dateCreated: string;
  dateUpdated: string | null;
}[];

export type PutTripsSignRequest = {
  forWho: 'self' | 'kid';
  phone: string;
  line?: string;
  name: string;
  birthYear: string;
  accompany?: 'yes' | 'no';
};

export type GetTripsIdResponse = {
  id: string;
  topic: string;
  ad: string;
  content: string;
  date: string;
  region: string;
  meetDate: string;
  meetPlace: string;
  dismissDate: string;
  dismissPlace: string;
  fee: number;
  other: string | null;
  ownerName: string;
  status: Status;
  dateCreated: string;
  dateUpdated: string | null;
};

export type PutTripsIdRequest = {
  topic: string;
  ad: string;
  content: string;
  meetDate: string;
  dismissDate: string;
  region: string;
  meetPlace: string;
  dismissPlace: string;
  fee: number;
  other?: string;
};

export type PutTripsIdResponse = {
  id: string;
  topic: string;
  ad: string;
  content: string;
  date: string;
  region: string;
  meetDate: string;
  meetPlace: string;
  dismissDate: string;
  dismissPlace: string;
  fee: number;
  other: string | null;
  ownerName: string;
  status: Status;
  dateCreated: string;
  dateUpdated: string | null;
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

export type PutTripsIdMemberRequest = {
  signId: string[];
};
