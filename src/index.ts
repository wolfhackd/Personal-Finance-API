import { app } from "./app.js";
import { env } from "./config/env.js";
import { database } from "./infra/database.js";

async function main() {
  try {
    await database.connect();

    app.listen({ port: env.PORT, host: "0.0.0.0" }, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    });
  } catch (e) {
    console.log("Error starting server", { e });
    process.exit(0);
  }
}

main();
