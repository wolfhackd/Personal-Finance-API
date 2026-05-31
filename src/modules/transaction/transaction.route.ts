import type { FastifyInstance } from "fastify";
import { TransactionController } from "./transaction.controller.js";
import { TransactionService } from "./transaction.service.js";
import { TransactionRepository } from "./transaction.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import {
  error400,
  securityBearer,
  transactionEntity,
} from "../../config/swagger-schemas.js";

const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();
const service = new TransactionService(transactionRepository, userRepository);
const controller = new TransactionController(service);

const tokenService = new JwtTokenService();
const auth = authMiddleware(tokenService);

export const transactionRoute = (app: FastifyInstance) => {
  app.addHook("preHandler", auth);

  app.post(
    "/",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Criar transação",
        description:
          "Cria uma transação para o usuário do JWT. O corpo não inclui userId (derivado do token).",
        security: securityBearer,
        body: {
          type: "object",
          required: ["title", "amount", "type", "category", "date"],
          properties: {
            title: { type: "string", minLength: 2 },
            amount: { type: "number", minimum: 1 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string", minLength: 2 },
            date: {
              type: "string",
              format: "date-time",
              description: "Data da transação (aceito como ISO 8601)",
            },
          },
        },
        response: {
          200: {
            description: "Transação criada",
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          400: error400,
        },
      },
    },
    controller.createTransaction,
  );
  app.get(
    "/",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Listar transações",
        description:
          "Lista transações do usuário(UserID do token). Opcionalmente filtra por intervalo de datas (UTC).",
        security: securityBearer,
        querystring: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Início do intervalo (com endDate, ou dia único)",
            },
            endDate: {
              type: "string",
              format: "date-time",
              description: "Fim do intervalo (usar junto de date)",
            },
          },
        },
        response: {
          200: {
            description: "Lista de transações",
            type: "array",
            items: transactionEntity,
          },
          400: error400,
        },
      },
    },
    controller.getTransactions,
  );
  app.get(
    "/report",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Relatório por mês (transações)",
        description:
          "Agrega receitas e despesas do mês indicado pelo parâmetro date (após normalização de fuso).",
        security: securityBearer,
        querystring: {
          type: "object",
          required: ["date"],
          properties: {
            date: {
              type: "string",
              description: "Data de referência (aceita vários formatos parseáveis)",
            },
          },
        },
        response: {
          200: {
            description: "Totais do relatório (estrutura definida pelo serviço)",
            type: "object",
            additionalProperties: true,
          },
          400: error400,
        },
      },
    },
    controller.report,
  );

  app.get(
    "/balance",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Saldo consolidado",
        description: "Soma de entradas menos saídas de todas as transações do usuário.",
        security: securityBearer,
        response: {
          200: {
            description: "Saldo numérico",
            type: "number",
          },
          400: error400,
        },
      },
    },
    controller.balance,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Obter transação por ID",
        security: securityBearer,
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid", description: "ID da transação" },
          },
        },
        response: {
          200: {
            description: "Transação encontrada",
            ...transactionEntity,
          },
          400: error400,
        },
      },
    },
    controller.getTransactionById,
  );
};
