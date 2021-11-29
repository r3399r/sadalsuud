export type VerifyTokenResponse = {
  scope: string;
  client_id: string;
  expires_in: number;
};

export type GetProfileResponse = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};
