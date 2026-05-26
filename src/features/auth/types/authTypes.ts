export type SendOtpRequest = {
  phone: string;
};

export type SendOtpResponseData = {
  message: string;
  otp?: string;
};

export type VerifyOtpRequest = {
  phone: string;
  otp: string;
};

export type VerifyOtpResponseData = {
  message: string;
  registrationToken: string;
};

export type CompleteRegistrationRequest = {
  registrationToken: string;
  pin: string;
  ward?: number;
  role?: string;
};

export type AuthUser = {
  id?: string;
  _id?: string;
  phone?: string;
  role?: string;
  ward?: number;
};

export type CompleteRegistrationResponseData = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type LoginWithPinRequest = {
  phone: string;
  pin: string;
};

export type LoginWithPinResponseData = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type ProfileAddress = {
  street?: string;
  area?: string;
  city?: string;
  pincode?: string;
};

export type ProfileUpdateRequest = {
  name?: string;
  email?: string;
  ward?: number;
  address?: ProfileAddress;
};

export type ProfileUpdateResponseData = AuthUser & {
  department?: string;
  profileImage?: string;
  address?: ProfileAddress;
};
