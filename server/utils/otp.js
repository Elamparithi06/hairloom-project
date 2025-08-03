// utils/otp.js

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export function otpExpiry(minutes = 5) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
