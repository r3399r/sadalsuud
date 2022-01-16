import { Trip } from './Trip';
import { User } from './User';

enum SignStatus {
  WAIT = 'wait',
  WIN = 'win',
  LOSE = 'lose',
}

export type GetMeResponse = User & {
  myTrips: Trip[];
  signedTrips?: (Trip & { status: SignStatus })[];
};
