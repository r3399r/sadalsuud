export type Sign = {
  id: string;
  name: string;
  phone: string;
  line: string | null;
  birthYear: string;
  isSelf: boolean;
  accompany: boolean | null;
  canJoin: boolean | null;
  comment: string | null;
  tripId: string;
  dateCreated: Date;
  dateUpdated: Date | null;
};
