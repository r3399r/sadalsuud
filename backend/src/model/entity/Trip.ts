import { Status } from 'src/constant/Trip';

export type Trip = {
  id: string;
  topic: string;
  ad: string;
  content: string;
  region: string;
  date: Date;
  meetDate: Date;
  meetPlace: string;
  dismissDate: Date;
  dismissPlace: string;
  fee: number;
  other: string | null;
  ownerName: string;
  ownerPhone: string;
  ownerLine: string | null;
  code: string;
  status: Status;
  expiredDate: Date | null;
  notifyDate: Date | null;
  reason: string | null;
  dateCreated: Date;
  dateUpdated: Date | null;
};
