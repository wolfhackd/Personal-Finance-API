import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoute } from "./modules/user/user.route.js";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

//Routes
app.register(userRoute);

export { app };
