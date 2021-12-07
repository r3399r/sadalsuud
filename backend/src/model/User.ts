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

export type PostUserResponse = User;

export type PutUserRequest = {
  name: string;
  phone: string;
  birthday: string;
};

export type PutUserResponse = User;

export type GetUserResponse = User;

export type GetUsersResponse = User[];

export type GetMeResponse = User;
