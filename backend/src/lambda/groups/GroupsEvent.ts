export type GroupsEvent = {
  httpMethod: string;
  headers: {
    'x-api-token': string;
  };
  body: string | null;
};
