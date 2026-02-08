import { defineConfig } from "@prisma/config";
import { env } from "./src/config/env.js";

export default defineConfig({
  datasource: {
    url: env.DATABASE_URL,
  },
});
