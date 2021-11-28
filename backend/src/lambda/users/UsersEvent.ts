import { VariablesParams } from 'src/model/variables';

export type UsersEvent = {
  httpMethod: string;
  queryStringParameters: VariablesParams | null;
};
