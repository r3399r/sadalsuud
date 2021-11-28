export type AuthEvent = {
  type: 'TOKEN';
  methodArn: string;
  authorizationToken: string;
};
