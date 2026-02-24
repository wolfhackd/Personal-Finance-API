import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoute } from "./modules/user/user.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import { transactionRoute } from "./modules/transaction/transaction.route.js";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

//Routes
app.register(authRoute);
app.register(userRoute);
app.register(transactionRoute, { prefix: "transactions" });

export { app };
