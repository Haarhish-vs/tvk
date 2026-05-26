const stripNonDigits = (value: string) => value.replace(/\D/g, "");

export const normalizeIndianPhone = (value: string) => {
  const digits = stripNonDigits(value);
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
};

export const validateIndianPhone = (value: string) => {
  const digits = normalizeIndianPhone(value);
  if (!digits) return "Phone number is required";
  if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number";
  return null;
};
