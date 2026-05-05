import type { FastifyInstance } from "fastify";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { ReportController } from "./report.controller.js";
import { ReportService } from "./report.service.js";
import { ReportRepository } from "./report.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { error400, securityBearer } from "../../config/swagger-schemas.js";

const repository = new ReportRepository();
const userRepository = new UserRepository();
const service = new ReportService(repository, userRepository);
const controller = new ReportController(service);

const tokenService = new JwtTokenService();
const auth = authMiddleware(tokenService);

export const reportRoute = (app: FastifyInstance) => {
  app.addHook("preHandler", auth);

  app.get(
    "/",
    {
      schema: {
        tags: ["Report"],
        summary: "Relatório mensal por categoria",
        description:
          "Agrega despesas por mês (índice 0–11) e por categoria. Formato: objeto aninhado.",
        security: securityBearer,
        response: {
          200: {
            description: "Mapa mês → categoria → valor agregado",
            type: "object",
            additionalProperties: true,
          },
          400: error400,
        },
      },
    },
    controller.getMonthlyReport,
  );
  app.get(
    "/forecast",
    {
      schema: {
        tags: ["Report"],
        summary: "Previsão (microserviço externo)",
        description:
          "Envia o relatório mensal ao serviço configurado em FORECAST_SERVICE_URL e devolve a resposta JSON.",
        security: securityBearer,
        response: {
          200: {
            description: "Payload retornado pelo microserviço de forecast",
            type: "object",
            additionalProperties: true,
          },
          400: error400,
        },
      },
    },
    controller.getForecast,
  );
};