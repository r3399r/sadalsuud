import { Group } from './Group';
import { Trip } from './Trip';
import { User } from './User';

export type GetMeResponse = User & {
  myTrip: Trip[];
  joinedTrip: Trip[];
  myGroup: Group[];
};
