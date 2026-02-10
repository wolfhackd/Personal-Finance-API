import dotenv from "dotenv";
import path from "node:path";
import z from "zod";

dotenv.config({
  path: "./.env",
});
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no arquivo .env");
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
