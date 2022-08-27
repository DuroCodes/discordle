import { load } from 'ts-dotenv';

export const env = load({
  DATABASE_URL: String,
  BOT_TOKEN: String,
  CLIENT_ID: String,
  PREFIX: String,
  PORT: Number,
});
