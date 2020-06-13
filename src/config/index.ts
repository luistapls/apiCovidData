import dotenv from 'dotenv';

dotenv.config();
export const config = {
  puerto:  process.env.PORT,
  dev: process.env.NODE_ENV !== 'production',
  sentryURL: process.env.SENTRY_URL,
};
