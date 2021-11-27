export type LoginUrlParams = {
  code?: string;
  state?: string;
};

export type LineToken = {
  access_token: string;
  token_type: 'Bearer';
  refresh_token: string;
  expires_in: number;
  scope: 'profile';
};
