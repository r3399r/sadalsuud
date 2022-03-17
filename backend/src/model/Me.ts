import { Group } from './Group';
import { SignResult } from './Sign';
import { Trip } from './Trip';
import { User } from './User';

export type GetMeResponse = User & {
  myTrip: Omit<Trip, 'owner'>[];
  myGroup: {
    group: Group;
    signedTrip: (Omit<Trip, 'owner' | 'joinedGroup'> & {
      result: SignResult;
    })[];
  }[];
};
