import { VariablesParams } from 'src/model/variables';

export type VariablesEvent = {
  httpMethod: string;
  queryStringParameters: VariablesParams | null;
};
