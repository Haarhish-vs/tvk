import { postJson, putJson } from "../../services/request";
import {
  CompleteRegistrationRequest,
  CompleteRegistrationResponseData,
  LoginWithPinRequest,
  LoginWithPinResponseData,
  ProfileUpdateRequest,
  ProfileUpdateResponseData,
  SendOtpRequest,
  SendOtpResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from "../types/authTypes";

export const sendRegistrationOtp = async (payload: SendOtpRequest) => {
  return postJson<SendOtpResponseData>("/auth/register/send-otp", payload);
};

export const verifyRegistrationOtp = async (payload: VerifyOtpRequest) => {
  return postJson<VerifyOtpResponseData>("/auth/register/verify-phone", payload);
};

export const completeRegistration = async (payload: CompleteRegistrationRequest) => {
  return postJson<CompleteRegistrationResponseData>("/auth/register/complete", payload);
};

export const updateProfile = async (payload: ProfileUpdateRequest, accessToken: string) => {
  return putJson<ProfileUpdateResponseData>("/users/profile", payload, {
    Authorization: `Bearer ${accessToken}`,
  });
};

export const loginWithPin = async (payload: LoginWithPinRequest) => {
  return postJson<LoginWithPinResponseData>("/auth/login/pin", payload);
};
