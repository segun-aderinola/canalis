
export type CreateOTP = {
  userId: string;
  token: string;
  status: string;
  otpType: string,
  expiringDatetime: Date;
};
