export interface VariablesEvent {
  httpMethod: string;
  queryStringParameters: {
    name?: string;
  } | null;
}
