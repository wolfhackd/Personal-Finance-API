import type { FastifyInstance } from "fastify";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";
import { BcryptHasher } from "../../infra/crypto/bcrypt-hasher.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import { error400 } from "../../config/swagger-schemas.js";

const repository = new UserRepository();
const hasher = new BcryptHasher();
const tokenService = new JwtTokenService();
const service = new UserService(repository, hasher, tokenService);
const controller = new UserController(service);

export const userRoute = (app: FastifyInstance) => {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Criar usuário",
        description: "Registra um novo usuário (senha é armazenada com hash).",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", minLength: 2, format: "email" },
            password: { type: "string", minLength: 2, description: "Senha em texto claro" },
          },
        },
        response: {
          201: {
            description: "Usuário criado",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              password: { type: "string", description: "Hash da senha (não expor em produção)" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          400: error400,
        },
      },
    },
    controller.createUser,
  );
};
