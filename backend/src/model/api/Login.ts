export type PostLoginRequest = {
  account: string;
  password: string;
};

export type PostLoginResponse = {
  secret: string;
};
