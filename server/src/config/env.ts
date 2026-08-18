import dotenv from 'dotenv'

dotenv.config()
// helper function to validate the environment variable is not undefined
const getEnv = (name: string) => {

  const env = process.env[name];

  if (!env){
    throw new Error(`${name} is missing`)
  }
  return env;
}

export const env = {
  PORT: getEnv("PORT") || 3001,
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  NODE_ENV: getEnv("NODE_ENV"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  CORS_ORIGINS: getEnv("CORS_ORIGINS"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  CRON_SECRET: getEnv("CRON_SECRET"),
  LOGO_DEV: getEnv("LOGO_API_KEY"),
  CLERK_PUBLISHABLE_KEY: getEnv('CLERK_PUBLISHABLE_KEY'),
  CLERK_SECRET_KEY: getEnv('CLERK_SECRET_KEY'),
  CLERK_WEBHOOK_SIGNING_SECRET: getEnv('CLERK_WEBHOOK_SIGNING_SECRET')
};
