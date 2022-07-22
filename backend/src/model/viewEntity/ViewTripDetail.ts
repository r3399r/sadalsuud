import { Status } from 'src/constant/Trip';

export type ViewTripDetail = {
  id: string;
  uuid: string;
  topic: string;
  meetDate: Date;
  ownerName: string;
  ownerPhone: string;
  ownerLine: string | null;
  code: string;
  status: Status;
  count: string;
  dateCreated: Date;
  dateUpdated: Date | null;
};
