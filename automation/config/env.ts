import 'dotenv/config';

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://authorized-partner.vercel.app',
  mailApi: process.env.MAIL_API ?? 'https://api.mail.tm',
  otpRegex: new RegExp(process.env.OTP_REGEX ?? '\\b\\d{6}\\b'),
  otpTimeoutMs: Number(process.env.OTP_TIMEOUT_MS ?? 90_000),
    slowMo: Number(process.env.SLOW_MO ?? 0),
};