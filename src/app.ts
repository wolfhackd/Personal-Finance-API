import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoute } from "./modules/user/user.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import { transactionRoute } from "./modules/transaction/transaction.route.js";
import { reportRoute } from "./modules/report/report.route.js";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

//Routes
app.register(authRoute);
app.register(userRoute);
app.register(transactionRoute, { prefix: "transactions" });
app.register(reportRoute, { prefix: "report" });

export { app };
