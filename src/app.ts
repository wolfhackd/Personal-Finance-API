import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoute } from "./modules/user/user.route.js";
import { authRoute } from "./modules/auth/auth.route.js";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

//Routes
app.register(authRoute);
app.register(userRoute);

export { app };
