import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { registerSwagger } from "./config/swagger.js";
import { userRoute } from "./modules/user/user.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import { transactionRoute } from "./modules/transaction/transaction.route.js";
import { reportRoute } from "./modules/report/report.route.js";

export async function createApp() {
  const app = fastify();

  app.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  await registerSwagger(app);

  app.register(authRoute);
  app.register(userRoute);
  app.register(transactionRoute, { prefix: "transactions" });
  app.register(reportRoute, { prefix: "report" });

  return app;
}
