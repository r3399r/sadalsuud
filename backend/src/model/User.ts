import { ROLE } from 'src/constant/User';

export type User = {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  verified: boolean;
  role: ROLE;
  dateCreated: number;
  dateUpdated: number;
};

export type PostUserRequest = {
  name: string;
  phone: string;
  birthday: string;
};

export type PostUserResponse = Omit<User, 'dateUpdated' | 'dateCreated'>;
