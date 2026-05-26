export const validateOtp = (value: string) => {
  if (!value) return "OTP is required";
  if (!/^\d{6}$/.test(value)) return "OTP must be a 6-digit number";
  return null;
};
