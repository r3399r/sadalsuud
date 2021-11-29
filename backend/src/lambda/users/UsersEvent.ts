import { PostUserRequest } from 'src/model/User';

export type UsersEvent = {
  httpMethod: string;
  headers: {
    'x-api-token': string;
  };
  body: PostUserRequest;
};
