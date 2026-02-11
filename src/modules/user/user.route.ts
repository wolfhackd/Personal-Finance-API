import type { FastifyInstance } from "fastify";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";
import { BcryptHasher } from "../../infra/crypto/bcrypt-hasher.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";

const repository = new UserRepository();
const hasher = new BcryptHasher();
const tokenService = new JwtTokenService();
const service = new UserService(repository, hasher, tokenService);
const controller = new UserController(service);

export const userRoute = (app: FastifyInstance) => {
  app.post("/users", controller.createUser);
};
