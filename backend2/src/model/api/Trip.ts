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

export type GetTripsResponse = {
  id: string;
  topic: string;
  ad: string;
  date: string;
  period: 'morning' | 'afternoon' | 'daytime' | 'evening' | 'allday' | 'pm';
  region: string;
  fee: number;
  other?: string;
  dateCreated: number;
  dateUpdated: number;
}[];

export type PutTripsSignRequest = {
  forWho: 'self' | 'kid';
  phone: string;
  line?: string;
  name: string;
  yearOfBirth: string;
  accompany?: boolean;
};
