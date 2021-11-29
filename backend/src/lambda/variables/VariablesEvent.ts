import { VariablesParams } from 'src/model/Variable';

export type VariablesEvent = {
  httpMethod: string;
  queryStringParameters: VariablesParams | null;
};
