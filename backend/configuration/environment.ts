import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const requireEnvironment = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable '${name}'`);
  }
  return value;
};

export const ENVIRONMENT = {
  PORT: Number(requireEnvironment("PORT")),
  API_KEY: requireEnvironment("API_KEY"),
  CORS_ACCEPTED_ORIGINS: requireEnvironment("CORS_ACCEPTED_ORIGINS")
    .split(",")
    .map((origin) => origin.trim()),
  SUPABASE_CONNECTION_STRING: requireEnvironment("SUPABASE_CONNECTION_STRING"),
  SUPABASE_URI: requireEnvironment("SUPABASE_URI"),
  SUPABASE_KEY: requireEnvironment("SUPABASE_KEY"),
  REDIS_HOST: requireEnvironment("REDIS_HOST"),
  REDIS_PORT: Number(requireEnvironment("REDIS_PORT")),
  GROQ_API_KEY: requireEnvironment("GROQ_API_KEY"),
  GROQ_MODEL: requireEnvironment("GROQ_MODEL"),
};
