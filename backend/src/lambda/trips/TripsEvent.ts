export type TripsEvent = {
  resource: string;
  httpMethod: string;
  headers: {
    'x-api-token': string;
  };
  body: string | null;
  pathParameters: { id: string } | null;
};
