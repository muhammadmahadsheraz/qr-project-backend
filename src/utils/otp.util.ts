export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOTPExpiry = (): Date => {
  const expiryMinutes = Number(process.env.OTP_EXPIRES_IN) || 10;
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};
