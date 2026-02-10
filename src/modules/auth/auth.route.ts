import type { FastifyInstance } from "fastify";
import { authController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import { BcryptHasher } from "../../infra/crypto/bcrypt-hasher.js";

const hasher = new BcryptHasher();
const tokenService = new JwtTokenService();
const repository = new UserRepository();
const service = new AuthService(tokenService, hasher, repository);
const controller = new authController(service);

const authRoute = (app: FastifyInstance) => {
  app.post("/login", controller.login);
};

export { authRoute };
