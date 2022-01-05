export type TripsEvent = {
  httpMethod: string;
  headers: {
    'x-api-token': string;
  };
  body: string | null;
};
