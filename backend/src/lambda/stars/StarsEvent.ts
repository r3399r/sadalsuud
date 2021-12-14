export type StarsEvent = {
  httpMethod: string;
  headers: {
    'x-api-token': string;
  };
  body: string | null;
  pathParameters: { id: string } | null;
};
