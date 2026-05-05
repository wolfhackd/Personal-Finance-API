import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { database } from "./infra/database.js";

async function main() {
  try {
    await database.connect();

    const app = await createApp();

    app.listen({ port: env.PORT, host: "0.0.0.0" }, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
      console.log(`📄 OpenAPI / Swagger UI: http://localhost:${env.PORT}/documentation`);
    });
  } catch (e) {
    console.log("Error starting server", { e });
    process.exit(0);
  }
}

main();
