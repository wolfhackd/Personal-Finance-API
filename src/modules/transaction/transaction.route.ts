import type { FastifyInstance } from "fastify";
import { TransactionController } from "./transaction.controller.js";
import { TransactionService } from "./transaction.service.js";
import { TransactionRepository } from "./transaction.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";

const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();
const service = new TransactionService(transactionRepository, userRepository);
const controller = new TransactionController(service);

const tokenService = new JwtTokenService();
const auth = authMiddleware(tokenService);

export const transactionRoute = (app: FastifyInstance) => {
  app.addHook("preHandler", auth);

  app.post("/", controller.createTransaction);
  app.get("/", controller.getTransactions);
  app.get("/:id", controller.getTransactionById);

  //Acho que o balance poderia ficar em user
  app.get("/balance", controller.balance);
};
