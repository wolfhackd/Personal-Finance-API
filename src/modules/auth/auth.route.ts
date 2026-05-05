import type { FastifyInstance } from "fastify";
import { authController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../user/user.repository.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import { BcryptHasher } from "../../infra/crypto/bcrypt-hasher.js";
import { authMiddleware } from "./auth.middleware.js";
import { error400, securityBearer } from "../../config/swagger-schemas.js";

const hasher = new BcryptHasher();
const tokenService = new JwtTokenService();
const repository = new UserRepository();
const service = new AuthService(tokenService, hasher, repository);
const controller = new authController(service);

const authRoute = (app: FastifyInstance) => {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login",
        description: "Autentica com email e senha e retorna um JWT.",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", minLength: 2, description: "Email do usuário" },
            password: {
              type: "string",
              minLength: 2,
              description: "Senha em texto claro",
            },
          },
        },
        response: {
          200: {
            description: "Token JWT",
            type: "object",
            properties: {
              token: { type: "string", description: "JWT para uso em Authorization: Bearer" },
            },
            required: ["token"],
          },
          400: error400,
        },
      },
    },
    controller.login,
  );
  app.get(
    "/me",
    {
      preHandler: authMiddleware(tokenService),
      schema: {
        tags: ["Auth"],
        summary: "Usuário atual",
        description: "Retorna o ID do usuário autenticado (JWT obrigatório).",
        security: securityBearer,
        response: {
          200: {
            description: "ID do usuário",
            type: "string",
            format: "uuid",
          },
          400: error400,
        },
      },
    },
    controller.me,
  );
};

export { authRoute };
